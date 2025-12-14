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
        // Use static images based on house type and floors
        String imagePath = getStaticImagePath(request);
        System.out.println("Using static image for Plan " + planType + ": " + imagePath);
        return Mono.just(imagePath);
    }

    private String getStaticImagePath(ArchitectRequest r) {
        String houseType = r.getHouseType() != null ? r.getHouseType().toLowerCase() : "1bhk";
        String floors = r.getFloors() != null ? r.getFloors().toLowerCase() : "single floor";

        // Map house type
        String typePrefix = "1bhk";
        if (houseType.contains("2bhk")) typePrefix = "2bhk";
        else if (houseType.contains("3bhk")) typePrefix = "3bhk";
        else if (houseType.contains("4bhk")) typePrefix = "4bhk";
        else if (houseType.contains("villa")) typePrefix = "villa";
        
        // Map floors
        String floorSuffix = "multi";
        if (floors.contains("single")) {
            floorSuffix = "single";
        }

        return "/house_images/" + typePrefix + "_" + floorSuffix + ".png";
    }

    private String createImagePrompt(ArchitectRequest r, String planType) {
       return "";
    }

    private String getDefaultImagePath(String planType) {
        return "/plan-a.png";
    }
}
