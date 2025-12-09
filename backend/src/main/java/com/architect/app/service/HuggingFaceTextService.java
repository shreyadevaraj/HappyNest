package com.architect.app.service;

import com.architect.app.model.ArchitectRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@Service
public class HuggingFaceTextService {

    private final WebClient webClient;

    @Value("${huggingface.api.token:}")
    private String hfToken;

    public HuggingFaceTextService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public Mono<String> generatePlanText(ArchitectRequest request) {
        System.out.println("=== HuggingFace Text Generation ===");

        if (hfToken == null || hfToken.trim().isEmpty() || hfToken.contains("YOUR_HF_TOKEN_HERE")) {
            System.out.println("No HF token, using mock response");
            return Mono.just(getMockResponse(request));
        }

        String prompt = createTextPrompt(request);
        System.out.println("Generating text with HuggingFace...");

        // Using Llama or Mistral for text generation (FREE)
        String apiUrl = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";

        Map<String, Object> body = Map.of(
                "inputs", prompt,
                "parameters", Map.of(
                        "max_new_tokens", 2000,
                        "temperature", 0.7,
                        "return_full_text", false));

        return webClient.post()
                .uri(apiUrl)
                .header("Authorization", "Bearer " + hfToken)
                .header("Content-Type", "application/json")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .map(response -> {
                    System.out.println("HF Text response received");
                    // Extract JSON from response
                    try {
                        // HF returns [{"generated_text": "..."}]
                        String jsonContent = response;
                        if (response.contains("generated_text")) {
                            int start = response.indexOf("\"generated_text\":\"") + 18;
                            int end = response.lastIndexOf("\"}");
                            if (start > 0 && end > start) {
                                jsonContent = response.substring(start, end);
                                jsonContent = jsonContent.replace("\\n", "\n").replace("\\\"", "\"");
                            }
                        }
                        // Try to extract JSON object
                        int jsonStart = jsonContent.indexOf("{");
                        int jsonEnd = jsonContent.lastIndexOf("}") + 1;
                        if (jsonStart >= 0 && jsonEnd > jsonStart) {
                            return jsonContent.substring(jsonStart, jsonEnd);
                        }
                        return jsonContent;
                    } catch (Exception e) {
                        System.err.println("Error parsing HF response: " + e.getMessage());
                        return getMockResponse(request);
                    }
                })
                .onErrorResume(e -> {
                    System.err.println("HF Text generation failed: " + e.getMessage());
                    return Mono.just(getMockResponse(request));
                });
    }

    private String createTextPrompt(ArchitectRequest r) {
        return String.format(
                "You are an expert Indian residential architect. Generate 3 floor plan options in JSON format.\n\n" +
                        "Client Requirements:\n" +
                        "- Plot Size: %s\n" +
                        "- Floors: %s\n" +
                        "- House Type: %s\n" +
                        "- Facing: %s\n" +
                        "- Budget: %s\n" +
                        "- Mandatory Rooms: %s\n" +
                        "- Vaastu: %s\n\n" +
                        "Generate ONLY valid JSON with this exact structure (no markdown, no explanation):\n" +
                        "{\n" +
                        "  \"plans\": [\n" +
                        "    {\n" +
                        "      \"name\": \"Plan A: Budget Match\",\n" +
                        "      \"headline\": \"Efficient design within budget\",\n" +
                        "      \"roomDetails\": \"Living (12x14), Kitchen (10x12), 2 Bedrooms (11x11)\",\n" +
                        "      \"builtUpArea\": \"1200 sq.ft\",\n" +
                        "      \"floorDistribution\": \"Ground floor layout\",\n" +
                        "      \"lightVentilation\": \"Windows on %s face for natural light\",\n" +
                        "      \"vaastuCompliance\": \"Kitchen in SE, Master bed in SW\",\n" +
                        "      \"budgetEstimate\": \"%s\",\n" +
                        "      \"image\": \"/plan-a.png\",\n" +
                        "      \"contractors\": [{\"name\": \"Budget Builders\", \"contact\": \"98765 43210\", \"specialty\": \"Economical\"}]\n"
                        +
                        "    },\n" +
                        "    {\"name\": \"Plan B\", ...},\n" +
                        "    {\"name\": \"Plan C\", ...}\n" +
                        "  ]\n" +
                        "}",
                r.getPlotSize(), r.getFloors(), r.getHouseType(), r.getFacing(),
                r.getBudget(), r.getMandatoryRooms(), r.getVaastu(), r.getFacing(), r.getBudget());
    }

    private String getMockResponse(ArchitectRequest r) {
        String baseBudget = r.getBudget() != null ? r.getBudget() : "50 Lakhs";
        String facing = r.getFacing() != null ? r.getFacing() : "North";

        return "{\n" +
                "  \"plans\": [\n" +
                "    {\n" +
                "      \"name\": \"Plan A: Budget-Optimized Design\",\n" +
                "      \"headline\": \"Efficient & Practical Living\",\n" +
                "      \"roomDetails\": \"Living (12x14), Kitchen (10x12), 2 Bedrooms (11x11 each), 2 Bathrooms\",\n" +
                "      \"builtUpArea\": \"1200 sq.ft\",\n" +
                "      \"floorDistribution\": \"" + r.getFloors() + " - Compact layout\",\n" +
                "      \"lightVentilation\": \"Large windows on " + facing
                + " face ensure maximum natural light throughout the day. Cross ventilation via " + facing
                + "-South openings.\",\n" +
                "      \"vaastuCompliance\": \"Kitchen in SE corner, Master bedroom in SW, Main entrance in " + facing
                + " as per Vaastu principles.\",\n" +
                "      \"budgetEstimate\": \"" + baseBudget + " (Standard materials)\",\n" +
                "      \"image\": \"/plan-a.png\",\n" +
                "      \"contractors\": [{\"name\": \"Ramesh Civil Works\", \"contact\": \"98765 43210\", \"specialty\": \"Budget Residential\"}]\n"
                +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"Plan B: Enhanced Comfort\",\n" +
                "      \"headline\": \"Modern Living with Better Finishes\",\n" +
                "      \"roomDetails\": \"Spacious Living (16x18), Modular Kitchen (12x14), Master Bed with Balcony (14x14), 2 Guest Rooms (12x12)\",\n"
                +
                "      \"builtUpArea\": \"1500 sq.ft\",\n" +
                "      \"floorDistribution\": \"" + r.getFloors() + " with open terrace\",\n" +
                "      \"lightVentilation\": \"French windows on " + facing
                + " facade with skylights. Automated exhaust system for optimal air circulation.\",\n" +
                "      \"vaastuCompliance\": \"Strict Brahmasthan (center) kept open, Pooja room in NE, Kitchen in SE with "
                + facing + " facing windows.\",\n" +
                "      \"budgetEstimate\": \"15-20% above budget (Premium finishes)\",\n" +
                "      \"image\": \"/plan-b.png\",\n" +
                "      \"contractors\": [{\"name\": \"UrbanNest Builders\", \"contact\": \"91234 56789\", \"specialty\": \"Modern G+1\"}]\n"
                +
                "    },\n" +
                "    {\n" +
                "      \"name\": \"Plan C: Luxury Villa\",\n" +
                "      \"headline\": \"Premium Lifestyle & Grandeur\",\n" +
                "      \"roomDetails\": \"Double-height Living, Home Theater, 4 Ensuite Bedrooms, Servant Quarters, Study Room\",\n"
                +
                "      \"builtUpArea\": \"2200 sq.ft+\",\n" +
                "      \"floorDistribution\": \"" + r.getFloors() + " + Terrace Garden\",\n" +
                "      \"lightVentilation\": \"Full-height glass facade on " + facing
                + " side. Automated climate control with smart ventilation sensors.\",\n" +
                "      \"vaastuCompliance\": \"100% Vaastu-compliant with elemental balancing. Water feature in "
                + facing + ", Fire element in SE.\",\n" +
                "      \"budgetEstimate\": \"50%+ above budget (Luxury tier)\",\n" +
                "      \"image\": \"/plan-c.png\",\n" +
                "      \"contractors\": [{\"name\": \"Elite Spaces Architects\", \"contact\": \"90000 11111\", \"specialty\": \"Luxury Villas\"}]\n"
                +
                "    }\n" +
                "  ]\n" +
                "}";
    }
}
