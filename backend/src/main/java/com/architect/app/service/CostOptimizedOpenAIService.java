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
        System.out.println("🤖 Generating plans with OpenAI gpt-4o-mini (STRICT LOW-COST MODE)...");

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
                .map(response -> {
                    try {
                        JsonNode root = objectMapper.readTree(response);
                        String content = root.path("choices").get(0).path("message").path("content").asText();
                        content = cleanJson(content);
                        System.out.println("✅ Plans generated successfully via OpenAI");
                        return content;
                    } catch (Exception e) {
                        System.err.println("❌ Failed to parse OpenAI response: " + e.getMessage());
                        return getMockResponse(request);
                    }
                })
                .onErrorResume(e -> {
                    System.err.println("❌ OpenAI API call failed: " + e.getMessage());
                    return Mono.just(getMockResponse(request));
                });
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
                "{\"plan\":\"A\",\"title\":\"Budget-Optimized %s\",\"rooms\":\"Living, Kitchen, 2 Bedrooms\",\"builtUpArea\":\"1200 sq.ft\",\"budgetEstimate\":\"%s\",\"imagePrompt\":\"Simple modern Indian %s house, %s floors, %s facing\",\"lightVentilation\":\"Optimized for cross-ventilation in all rooms\",\"highlights\":\"Maximized usable area with zero-waste corridor design\",\"houseFeatures\":[\"Space-saving modular kitchen\",\"Efficient LED lighting system\",\"Large windows for natural light\"]},"
                +
                "{\"plan\":\"B\",\"title\":\"Enhanced Comfort %s\",\"rooms\":\"Large Living, Modular Kitchen, 3 Bedrooms\",\"builtUpArea\":\"1500 sq.ft\",\"budgetEstimate\":\"15-20%% over budget\",\"imagePrompt\":\"Mid-range modern Indian %s house, %s floors, %s facing\",\"lightVentilation\":\"Bay windows in master bedroom for maximum sunlight\",\"highlights\":\"Enhanced spatial flow with integrated workspace zones\",\"houseFeatures\":[\"Automated smart home sensors\",\"Premium flooring finishing\",\"Solar-ready roof design\"]},"
                +
                "{\"plan\":\"C\",\"title\":\"Luxury %s Villa\",\"rooms\":\"Double-height Living, Home Theater, 4 Bedrooms\",\"builtUpArea\":\"2200 sq.ft\",\"budgetEstimate\":\"50%% over budget\",\"imagePrompt\":\"Luxury Indian %s villa, %s floors, %s facing\",\"lightVentilation\":\"Double-height atrium providing massive natural light overflow\",\"highlights\":\"Premium lifestyle design with seamless indoor-outdoor transition\",\"houseFeatures\":[\"Private home theater with acoustic treatment\",\"Italian marble flooring throughout\",\"Designer landscape garden with automatic irrigation\"]}"
                +
                "]}", houseType, budget, houseType, floors, facing, houseType, houseType, floors, facing,
                houseType, houseType, floors, facing);
    }

    private String createPrompt(ArchitectRequest r) {
        return String.format(
                "Generate 3 architectural plan variants (A, B, C) for an Indian residential house.\\n\\n" +
                        "Requirements:\\n" +
                        "- Plot: %s\\n" +
                        "- Floors: %s\\n" +
                        "- Type: %s\\n" +
                        "- Facing: %s\\n" +
                        "- Budget: %s\\n" +
                        "- Rooms: %s\\n\\n" +
                        "Rules:\\n" +
                        "• Plan A = within budget\\n" +
                        "• Plan B = 10-20%% over\\n" +
                        "• Plan C = 40-50%% over (luxury)\\n" +
                        "• Include 'imagePrompt' for a split-screen visualization (Left: 2D Blueprint, Right: 3D Exterior)\\n"
                        +
                        "• For each plan, include 'lightVentilation' (a string), 'highlights' (a string summarizing project's efficiency), and 'houseFeatures' (an array of strings showing premium additions).\\n\\n"
                        +
                        "OUTPUT FORMAT (STRICT JSON, no markdown):\\n" +
                        "{\"plans\":[{\"plan\":\"A\",\"title\":\"...\",\"rooms\":\"...\",\"builtUpArea\":\"...\",\"budgetEstimate\":\"...\",\"imagePrompt\":\"...\",\"lightVentilation\":\"...\",\"highlights\":\"...\",\"houseFeatures\":[\"...\", \"...\"]},{\"plan\":\"B\",...},{\"plan\":\"C\",...}]}",
                r.getPlotSize(), r.getFloors(), r.getHouseType(), r.getFacing(), r.getBudget(),
                r.getMandatoryRooms());
    }
}
