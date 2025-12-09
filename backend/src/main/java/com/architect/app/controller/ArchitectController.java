package com.architect.app.controller;

import com.architect.app.model.ArchitectRequest;
import com.architect.app.service.OpenAIService;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/architect")
public class ArchitectController {

    private final OpenAIService openAIService;

    public ArchitectController(OpenAIService openAIService) {
        this.openAIService = openAIService;
    }

    @PostMapping("/generate")
    public Mono<String> generate(@RequestBody ArchitectRequest request) {
        // Generate plans with static images (no API image generation costs)
        return openAIService.generatePlans(request);
    }
}
