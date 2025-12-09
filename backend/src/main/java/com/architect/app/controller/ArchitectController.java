package com.architect.app.controller;

import com.architect.app.model.ArchitectRequest;
import com.architect.app.service.HuggingFaceTextService;
import com.architect.app.service.HuggingFaceImageService;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.ArrayNode;

@RestController
@RequestMapping("/api/architect")
public class ArchitectController {

    private final HuggingFaceTextService textService;
    private final HuggingFaceImageService imageService;
    private final ObjectMapper objectMapper;

    public ArchitectController(HuggingFaceTextService textService,
            HuggingFaceImageService imageService,
            ObjectMapper objectMapper) {
        this.textService = textService;
        this.imageService = imageService;
        this.objectMapper = objectMapper;
    }

    @PostMapping("/generate")
    public Mono<String> generate(@RequestBody ArchitectRequest request) {
        return textService.generatePlanText(request)
                .flatMap(plansJson -> {
                    return Mono.zip(
                            imageService.generatePlanImage(request, "A"),
                            imageService.generatePlanImage(request, "B"),
                            imageService.generatePlanImage(request, "C")).map(imageTuple -> {
                                try {
                                    ObjectNode root = (ObjectNode) objectMapper.readTree(plansJson);
                                    ArrayNode plans = (ArrayNode) root.get("plans");

                                    if (plans != null && plans.size() >= 3) {
                                        ((ObjectNode) plans.get(0)).put("image", imageTuple.getT1());
                                        ((ObjectNode) plans.get(1)).put("image", imageTuple.getT2());
                                        ((ObjectNode) plans.get(2)).put("image", imageTuple.getT3());
                                    }

                                    return objectMapper.writeValueAsString(root);
                                } catch (Exception e) {
                                    return plansJson;
                                }
                            });
                });
    }
}
