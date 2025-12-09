package com.architect.app.service;

import com.architect.app.model.ArchitectRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Service
public class ImageGenerationService {

    private final WebClient webClient;

    @Value("${openai.api.key}")
    private String apiKey;

    public ImageGenerationService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://api.openai.com/v1").build();
    }

    public Mono<String> generatePlanImage(ArchitectRequest request, String planType) {
        // Check if API key is valid
        if (apiKey == null || apiKey.contains("YOUR_OPENAI_API_KEY_HERE") || apiKey.length() < 10) {
            return Mono.just(getDefaultImagePath(planType));
        }

        String prompt = createImagePrompt(request, planType);

        Map<String, Object> body = Map.of(
                "model", "dall-e-3",
                "prompt", prompt,
                "n", 1,
                "size", "1024x1024",
                "quality", "standard");

        return webClient.post()
                .uri("/images/generations")
                .header("Authorization", "Bearer " + apiKey)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .map(response -> {
                    // Extract image URL from response
                    // Response format: {"data": [{"url": "..."}]}
                    try {
                        // Simple extraction - in production, use proper JSON parsing
                        int urlStart = response.indexOf("\"url\":\"") + 7;
                        int urlEnd = response.indexOf("\"", urlStart);
                        return response.substring(urlStart, urlEnd);
                    } catch (Exception e) {
                        return getDefaultImagePath(planType);
                    }
                })
                .onErrorResume(e -> {
                    System.err.println("Image generation failed: " + e.getMessage());
                    return Mono.just(getDefaultImagePath(planType));
                });
    }

    private String createImagePrompt(ArchitectRequest r, String planType) {
        String budgetTier = planType.equals("A") ? "budget-friendly"
                : planType.equals("B") ? "mid-range modern" : "luxury premium";

        String floors = r.getFloors() != null ? r.getFloors() : "single floor";
        String houseType = r.getHouseType() != null ? r.getHouseType() : "residential";

        return String.format(
                "Create a split-screen architectural visualization: " +
                        "LEFT SIDE: Clean 2D technical floor plan blueprint with room labels and dimensions for a %s %s house. "
                        +
                        "RIGHT SIDE: Photorealistic 3D isometric exterior view of a %s Indian residential %s home with %s. "
                        +
                        "Professional architectural rendering, pastel colors, bright natural lighting, modern aesthetic. "
                        +
                        "Show the house from a 45-degree angle with visible entrance, windows, and roof details.",
                houseType, floors, budgetTier, houseType, floors);
    }

    private String getDefaultImagePath(String planType) {
        // Return default static images as fallback
        switch (planType) {
            case "A":
                return "/plan-a.png";
            case "B":
                return "/plan-b.png";
            case "C":
                return "/plan-c.png";
            default:
                return "/plan-a.png";
        }
    }
}
