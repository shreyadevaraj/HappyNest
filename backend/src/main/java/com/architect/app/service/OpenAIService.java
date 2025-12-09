package com.architect.app.service;

import com.architect.app.model.ArchitectRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Service
public class OpenAIService {

        private final WebClient webClient;

        @Value("${openai.api.key}")
        private String apiKey;

        public OpenAIService(WebClient.Builder webClientBuilder) {
                this.webClient = webClientBuilder.baseUrl("https://api.openai.com/v1").build();
        }

        public Mono<String> generatePlans(ArchitectRequest request) {
                // Automatically default to simulation if key is placeholder or missing to avoid
                // errors
                if (apiKey == null || apiKey.contains("YOUR_OPENAI_API_KEY_HERE") || apiKey.length() < 10) {
                        return Mono.just(getMockResponse(request));
                }

                String prompt = createPrompt(request);

                Map<String, Object> body = Map.of(
                                "model", "gpt-4o",
                                "messages", List.of(
                                                Map.of("role", "system", "content",
                                                                "You are an expert Indian residential architect and construction planner. Output strictly in valid JSON format."),
                                                Map.of("role", "user", "content", prompt)),
                                "temperature", 0.7);

                return webClient.post()
                                .uri("/chat/completions")
                                .header("Authorization", "Bearer " + apiKey)
                                .bodyValue(body)
                                .retrieve()
                                .bodyToMono(String.class)
                                .map(response -> response)
                                .onErrorResume(e -> Mono.just(getMockResponse(request)));
        }

        private String getMockResponse(ArchitectRequest r) {
                String baseBudget = r.getBudget() != null ? r.getBudget() : "50 Lakhs";

                return "{\n" +
                                "  \"plans\": [\n" +
                                "    {\n" +
                                "      \"name\": \"Plan A: The Strict Budget Allocator\",\n" +
                                "      \"headline\": \"Efficient & Practical Living\",\n" +
                                "      \"roomDetails\": \"Optimized Living (12x14), 2 Std Beds (11x11), Compact Kitchen (8x10)\",\n"
                                +
                                "      \"builtUpArea\": \"1200 sq.ft\",\n" +
                                "      \"floorDistribution\": \"Efficient Single Floor / G+1 Compact\",\n" +
                                "      \"lightVentilation\": \"Strategic window placement to reduce electricity costs.\",\n"
                                +
                                "      \"vaastuCompliance\": \"Essential compliance for Master Bed & Kitchen to keep cost low but luck high.\",\n"
                                +
                                "      \"budgetEstimate\": \"Exact Match: " + baseBudget + " (Standard Materials)\",\n"
                                +
                                "      \"image\": \"/plan-a.png\",\n" +
                                "      \"contractors\": [\n" +
                                "         {\"name\": \"Ramesh Civil Works\", \"contact\": \"98765 43210\", \"specialty\": \"Budget Residential\"},\n"
                                +
                                "         {\"name\": \"BuildSmart Solutions\", \"contact\": \"99887 76655\", \"specialty\": \"Cost Effective\"}\n"
                                +
                                "      ]\n" +
                                "    },\n" +
                                "    {\n" +
                                "      \"name\": \"Plan B: The Value Plus\",\n" +
                                "      \"headline\": \"Enhanced Comfort & Aesthetics\",\n" +
                                "      \"roomDetails\": \"Spacious Living (16x18), Master Bed with Balcony, Modular Kitchen\",\n"
                                +
                                "      \"builtUpArea\": \"1500 sq.ft\",\n" +
                                "      \"floorDistribution\": \"G+1 with Open Terrace\",\n" +
                                "      \"lightVentilation\": \"Added skylights and French windows for superior airflow.\",\n"
                                +
                                "      \"vaastuCompliance\": \"Strict adherence including Brahmasthan open space.\",\n"
                                +
                                "      \"budgetEstimate\": \"Exceeds by 15-20% (Better Finishes & Teak Wood)\",\n" +
                                "      \"image\": \"/plan-b.png\",\n" +
                                "      \"contractors\": [\n" +
                                "         {\"name\": \"UrbanNest Builders\", \"contact\": \"91234 56789\", \"specialty\": \"Modern G+1\"},\n"
                                +
                                "         {\"name\": \"CityStruct Engg\", \"contact\": \"88776 65544\", \"specialty\": \"Premium Finish\"}\n"
                                +
                                "      ]\n" +
                                "    },\n" +
                                "    {\n" +
                                "      \"name\": \"Plan C: The Dream Luxury\",\n" +
                                "      \"headline\": \"Premium Lifestyle & Grandeur\",\n" +
                                "      \"roomDetails\": \"Double-height Foyer, Home Theater, 4 Ensuite Beds, Servant Quarters\",\n"
                                +
                                "      \"builtUpArea\": \"2200 sq.ft+\",\n" +
                                "      \"floorDistribution\": \"G+2 / Duplex with Private Garden\",\n" +
                                "      \"lightVentilation\": \"Architectural glass facade and automated ventilation systems.\",\n"
                                +
                                "      \"vaastuCompliance\": \"100% Zero-Defect Vaastu with elemental balancing.\",\n" +
                                "      \"budgetEstimate\": \"Luxury Tier (50%+ above base budget)\",\n" +
                                "      \"image\": \"/plan-c.png\",\n" +
                                "      \"contractors\": [\n" +
                                "         {\"name\": \"Elite Spaces Architects\", \"contact\": \"90000 11111\", \"specialty\": \"Luxury Villas\"},\n"
                                +
                                "         {\"name\": \"Signature Homes\", \"contact\": \"95555 22222\", \"specialty\": \"High-end Automation\"}\n"
                                +
                                "      ]\n" +
                                "    }\n" +
                                "  ]\n" +
                                "}";
        }

        private String createPrompt(ArchitectRequest r) {
                return String.format(
                                "I am a client planning to construct a house.\\n" +
                                                "Plot Size: %s\\n" +
                                                "Floors: %s\\n" +
                                                "House Type: %s\\n" +
                                                "Facing: %s\\n" +
                                                "Budget: %s\\n" +
                                                "Mandatory Rooms: %s\\n" +
                                                "Vaastu: %s\\n" +
                                                "\\n" +
                                                "Generate 3 different optimized floor plan layouts (Plan A, Plan B, Plan C) strictly in ASCENDING order of budget usage:\\n"
                                                +
                                                "1. Plan A: STRICTLY within the specific budget provided.\\n" +
                                                "2. Plan B: SLIGHTLY EXCEED the budget (10-20%%).\\n" +
                                                "3. Plan C: LUXURY option. Exceed budget significantly (40-50%%).\\n" +
                                                "\\n" +
                                                "RETURN JSON ONLY structure:\\n" +
                                                "{\\n" +
                                                "  \"plans\": [\\n" +
                                                "    {\\n" +
                                                "      \"name\": \"Plan A (Budget Match)\",\\n" +
                                                "      \"headline\": \"...\",\\n" +
                                                "      \"image\": \"/plan-a.png\", // ALWAYS return this exact path for Plan A\\n"
                                                +
                                                "      \"roomDetails\": \"...\",\\n" +
                                                "      \"builtUpArea\": \"...\",\\n" +
                                                "      \"floorDistribution\": \"...\",\\n" +
                                                "      \"lightVentilation\": \"...\",\\n" +
                                                "      \"vaastuCompliance\": \"...\",\\n" +
                                                "      \"budgetEstimate\": \"...\",\\n" +
                                                "      \"contractors\": [{\"name\": \"...\", \"contact\": \"...\", \"specialty\": \"...\"}]\\n"
                                                +
                                                "    },\\n" +
                                                "    {\\n" +
                                                "      \"name\": \"Plan B (Value Upgrade)\",\\n" +
                                                "      \"image\": \"/plan-b.png\", // ALWAYS return this exact path for Plan B\\n"
                                                +
                                                "      ...\\n" +
                                                "    },\\n" +
                                                "    {\\n" +
                                                "      \"name\": \"Plan C (Luxury)\",\\n" +
                                                "      \"image\": \"/plan-c.png\", // ALWAYS return this exact path for Plan C\\n"
                                                +
                                                "      ...\\n" +
                                                "    }\\n" +
                                                "  ]\\n" +
                                                "}\\n" +
                                                "Do not include markdown formatting (```json), just the raw JSON.",
                                r.getPlotSize(), r.getFloors(), r.getHouseType(), r.getFacing(), r.getBudget(),
                                r.getMandatoryRooms(), r.getVaastu());
        }
}
