package com.architect.app.service;

import com.architect.app.model.ArchitectRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@Service
public class HuggingFaceImageService {

    private final WebClient webClient;

    @Value("${huggingface.api.token:}")
    private String hfToken;

    public HuggingFaceImageService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public Mono<String> generatePlanImage(ArchitectRequest request, String planType) {
        // Debug logging
        System.out.println("=== HuggingFace Image Generation ===");
        System.out.println("Token present: " + (hfToken != null && !hfToken.isEmpty()));
        System.out.println("Token length: " + (hfToken != null ? hfToken.length() : 0));

        if (hfToken == null || hfToken.trim().isEmpty() || hfToken.contains("YOUR_HF_TOKEN_HERE")) {
            System.out.println("Using static fallback image for Plan " + planType);
            return Mono.just(getDefaultImagePath(planType));
        }

        String prompt = createImagePrompt(request, planType);
        System.out.println("Generating image for Plan " + planType);
        System.out.println("Prompt: " + prompt);

        String apiUrl = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

        Map<String, Object> body = Map.of(
                "inputs", prompt,
                "parameters", Map.of(
                        "num_inference_steps", 30,
                        "guidance_scale", 7.5));

        return webClient.post()
                .uri(apiUrl)
                .header("Authorization", "Bearer " + hfToken)
                .header("Content-Type", "application/json")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(byte[].class)
                .map(imageBytes -> {
                    System.out.println(
                            "Successfully generated image for Plan " + planType + " (" + imageBytes.length + " bytes)");
                    String base64Image = java.util.Base64.getEncoder().encodeToString(imageBytes);
                    return "data:image/png;base64," + base64Image;
                })
                .onErrorResume(e -> {
                    System.err.println("HF Image generation failed for Plan " + planType + ": " + e.getMessage());
                    e.printStackTrace();
                    return Mono.just(getDefaultImagePath(planType));
                });
    }

    private String createImagePrompt(ArchitectRequest r, String planType) {
        String budgetTier = planType.equals("A") ? "budget-friendly, economical"
                : planType.equals("B") ? "mid-range modern, contemporary" : "luxury premium, high-end";

        String floors = r.getFloors() != null ? r.getFloors().toLowerCase() : "single floor";
        String houseType = r.getHouseType() != null ? r.getHouseType() : "residential";
        String facing = r.getFacing() != null ? r.getFacing().toLowerCase() : "north";

        return String.format(
                "Professional architectural visualization: %s Indian %s house with %s, %s facing, " +
                        "split screen showing 2D floor plan blueprint on left and 3D isometric exterior view on right, "
                        +
                        "pastel colors, bright natural lighting, modern aesthetic, detailed, high quality, architectural rendering",
                budgetTier, houseType, floors, facing);
    }

    private String getDefaultImagePath(String planType) {
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
