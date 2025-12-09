package com.architect.app.controller;

import com.architect.app.model.ArchitectRequest;
import com.architect.app.service.ImageGenerationService;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    private final ImageGenerationService imageGenerationService;

    public ImageController(ImageGenerationService imageGenerationService) {
        this.imageGenerationService = imageGenerationService;
    }

    @PostMapping("/generate")
    public Mono<Map<String, String>> generateImages(@RequestBody ArchitectRequest request) {
        // Generate images for all three plans
        return Mono.zip(
                imageGenerationService.generatePlanImage(request, "A"),
                imageGenerationService.generatePlanImage(request, "B"),
                imageGenerationService.generatePlanImage(request, "C")).map(
                        tuple -> Map.of(
                                "planA", tuple.getT1(),
                                "planB", tuple.getT2(),
                                "planC", tuple.getT3()));
    }
}
