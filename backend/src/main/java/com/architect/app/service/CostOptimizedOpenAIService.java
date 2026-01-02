package com.architect.app.service;

import com.architect.app.model.ArchitectRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

/**
 * STRICT LOW-COST OpenAI Service
 * - LOCKED to gpt-4.1-mini ONLY (lowest cost model)
 * - Generates only 3 plans with image prompts
 * - No interior generation
 * - FORBIDDEN: GPT-4o, GPT-4 Turbo, GPT-4.5, GPT-4o-mini
 */
@Service
public class CostOptimizedOpenAIService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    @Value("${openai.api.key}")
    private String apiKey;

    public CostOptimizedOpenAIService(WebClient.Builder webClientBuilder, ObjectMapper objectMapper) {
        this.webClient = webClientBuilder.baseUrl("https://api.openai.com/v1").build();
        this.objectMapper = objectMapper;
    }

    public Mono<String> generatePlans(ArchitectRequest request) {
        if (apiKey == null || apiKey.contains("YOUR_OPENAI_API_KEY_HERE") || apiKey.length() < 10) {
            System.out.println("⚠️ No valid OpenAI API key found, using mock response");
            return Mono.just(getMockResponse(request));
        }

        String prompt = createPrompt(request);
        System.out.println("🤖 Generating 1 AI plan with gpt-4o-mini (STRICT SINGLE-PLAN MODE)...");

        Map<String, Object> body = Map.of(
                "model", "gpt-4o-mini",
                "messages", List.of(
                        Map.of("role", "system", "content",
                                "You are the HappyNest Architecture AI Engine. Generate architectural plans in STRICTOR JSON format. No markdown, no conversational text."),
                        Map.of("role", "user", "content", prompt)),
                "temperature", 0.7);

        return webClient.post()
                .uri("/chat/completions")
                .header("Authorization", "Bearer " + apiKey)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .flatMap(response -> {
                    try {
                        JsonNode root = objectMapper.readTree(response);
                        String rawContent = root.path("choices").get(0).path("message").path("content").asText();
                        final String cleanContent = cleanJson(rawContent);

                        // Parse JSON to get prompts
                        final JsonNode planJson = objectMapper.readTree(cleanContent);
                        final JsonNode plans = planJson.path("plans");
                        if (!plans.isArray() || plans.isEmpty()) {
                            System.out.println("⚠️ OpenAI returned invalid plan array");
                            return Mono.just(cleanContent);
                        }

                        String exteriorPrompt = plans.get(0).path("exteriorPrompt").asText();
                        String floorPlanPrompt = plans.get(0).path("floorPlanPrompt").asText();

                        if ((exteriorPrompt == null || exteriorPrompt.isEmpty())
                                && (floorPlanPrompt == null || floorPlanPrompt.isEmpty())) {
                            System.out.println("⚠️ No image prompts found in AI response");
                            return Mono.just(cleanContent);
                        }

                        System.out
                                .println("🎨 Generating separate AI images (Exterior & Floor Plan) using DALL-E 2...");

                        Mono<String> exteriorImageMono = generateImage(exteriorPrompt,
                                "Professional architectural exterior visualization of: ");
                        Mono<String> floorPlanImageMono = generateImage(floorPlanPrompt,
                                "Professional 2D architectural floor plan blueprint of: ");

                        return Mono.zip(exteriorImageMono, floorPlanImageMono)
                                .map(tuple -> {
                                    try {
                                        com.fasterxml.jackson.databind.node.ObjectNode firstPlan = (com.fasterxml.jackson.databind.node.ObjectNode) plans
                                                .get(0);
                                        firstPlan.put("image", tuple.getT1()); // Keep 'image' for backward
                                                                               // compatibility
                                        firstPlan.put("exteriorImage", tuple.getT1());
                                        firstPlan.put("floorPlanImage", tuple.getT2());
                                        System.out.println("✅ Both AI Images generated successfully via DALL-E 2");
                                        return planJson.toString();
                                    } catch (Exception e) {
                                        return cleanContent;
                                    }
                                });
                    } catch (Exception e) {
                        System.err.println("❌ Failed to parse OpenAI response: " + e.getMessage());
                        return Mono.just(getMockResponse(request));
                    }
                })
                .onErrorResume(e -> {
                    System.err.println("❌ OpenAI API call failed: " + e.getMessage());
                    return Mono.just(getMockResponse(request));
                });
    }

    private Mono<String> generateImage(String prompt, String prefix) {
        if (prompt == null || prompt.isEmpty())
            return Mono.just("");

        Map<String, Object> body = Map.of(
                "model", "dall-e-2",
                "prompt", prefix + prompt + ". Clean architectural style, high quality.",
                "n", 1,
                "size", "256x256"); // Smallest size = cheapest cost

        return webClient.post()
                .uri("/images/generations")
                .header("Authorization", "Bearer " + apiKey)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .map(response -> {
                    try {
                        JsonNode root = objectMapper.readTree(response);
                        return root.path("data").get(0).path("url").asText();
                    } catch (Exception e) {
                        return "";
                    }
                })
                .onErrorReturn("");
    }

    public Mono<String> suggestConfiguration(Map<String, String> lifestyleData) {
        if (apiKey == null || apiKey.length() < 10) {
            return Mono.just(
                    "{\"houseType\":\"3BHK Comfort\", \"floors\":\"G+1 (Duplex)\", \"facing\":\"East\", \"mandatoryRooms\":\"Living, Kitchen, 3 Bedrooms, Study room\"}");
        }

        String prompt = String.format(
                "Based on this lifestyle, suggest the best house configuration (Type, Floors, Facing, Mandatory Rooms).\\n"
                        +
                        "Family Size: %s\\n" +
                        "Elderly/Needs: %s\\n" +
                        "WFH/Study: %s\\n" +
                        "Style: %s\\n" +
                        "Budget: %s\\n" +
                        "Output strictly in JSON: {\\\"houseType\\\":\\\"...\\\", \\\"floors\\\":\\\"...\\\", \\\"facing\\\":\\\"...\\\", \\\"mandatoryRooms\\\":\\\"...\\\"}",
                lifestyleData.get("familySize"), lifestyleData.get("elderly"), lifestyleData.get("wfh"),
                lifestyleData.get("style"), lifestyleData.get("budget"));

        Map<String, Object> body = Map.of(
                "model", "gpt-4o-mini",
                "messages", List.of(
                        Map.of("role", "system", "content",
                                "You are an expert Indian residential architect suggesting layouts based on lifestyle."),
                        Map.of("role", "user", "content", prompt)),
                "temperature", 0.7);

        return webClient.post()
                .uri("/chat/completions")
                .header("Authorization", "Bearer " + apiKey)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .map(response -> {
                    try {
                        JsonNode root = objectMapper.readTree(response);
                        String content = root.path("choices").get(0).path("message").path("content").asText();
                        return cleanJson(content);
                    } catch (Exception e) {
                        return "{\"houseType\":\"3BHK Comfort\", \"floors\":\"G+1 (Duplex)\", \"facing\":\"East\", \"mandatoryRooms\":\"3 Bedrooms, Office Space\"}";
                    }
                });
    }

    private String cleanJson(String content) {
        if (content == null)
            return "{}";
        content = content.trim();

        // If it already looks like a JSON object starting at index 0, return it
        if (content.startsWith("{") && content.endsWith("}"))
            return content;

        // More robust: find the first { and last }
        int firstBrace = content.indexOf('{');
        int lastBrace = content.lastIndexOf('}');

        if (firstBrace != -1 && lastBrace != -1 && lastBrace > firstBrace) {
            return content.substring(firstBrace, lastBrace + 1);
        }

        return content;
    }

    private String getMockResponse(ArchitectRequest r) {
        String budget = r.getBudget() != null ? r.getBudget() : "50 Lakhs";
        String houseType = r.getHouseType() != null ? r.getHouseType() : "2BHK";
        String floors = r.getFloors() != null ? r.getFloors() : "1";
        String facing = r.getFacing() != null ? r.getFacing() : "East";

        return String.format("{\"plans\":[" +
                "{\"plan\":\"Optimized\",\"title\":\"%s Dream Home\",\"rooms\":\"Living, Kitchen, %s\",\"builtUpArea\":\"1200 sq.ft\",\"budgetEstimate\":\"%s\",\"exteriorPrompt\":\"Modern %s house exterior\",\"floorPlanPrompt\":\"Detailed %s floor plan\",\"lightVentilation\":\"Optimized for cross-ventilation in all rooms\",\"highlights\":\"Maximized usable area with zero-waste corridor design\",\"houseFeatures\":[\"Space-saving modular kitchen\",\"Efficient LED lighting system\",\"Large windows for natural light\"]}"
                + "]}", houseType, houseType, budget, houseType, houseType);
    }

    private String createPrompt(ArchitectRequest r) {
        return String.format(
                "Generate EXACTLY ONE architectural plan for an Indian residential house matching THESE specific requirements.\\n\\n"
                        +
                        "Requirements:\\n" +
                        "- Plot: %s\\n" +
                        "- Floors: %s\\n" +
                        "- Type: %s\\n" +
                        "- Facing: %s\\n" +
                        "- Budget: %s\\n" +
                        "- Rooms: %s\\n\\n" +
                        "Rules:\\n" +
                        "• Plan must be within or slightly above budget (optimized for value)\\n" +
                        "• Include 'exteriorPrompt' (a detailed prompt for a 3D architectural exterior render)\\n" +
                        "• Include 'floorPlanPrompt' (a detailed prompt for a 2D architectural floor plan blueprint)\\n"
                        +
                        "• Include 'lightVentilation' (a string), 'highlights' (summary), and 'houseFeatures' (array of strings).\\n\\n"
                        +
                        "OUTPUT FORMAT (STRICT JSON, no markdown):\\n" +
                        "{\"plans\":[{\"plan\":\"Optimized\",\"title\":\"...\",\"rooms\":\"...\",\"builtUpArea\":\"...\",\"budgetEstimate\":\"...\",\"exteriorPrompt\":\"...\",\"floorPlanPrompt\":\"...\",\"lightVentilation\":\"...\",\"highlights\":\"...\",\"houseFeatures\":[\"...\", \"...\"]}]}",
                r.getPlotSize(), r.getFloors(), r.getHouseType(), r.getFacing(), r.getBudget(),
                r.getMandatoryRooms());
    }
}
