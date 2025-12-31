package com.architect.app.controller;

import com.architect.app.service.CostOptimizedOpenAIService;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import java.util.*;

@RestController
@RequestMapping("/api/architect")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174" })
public class CostOptimizedArchitectController {

        private final CostOptimizedOpenAIService aiService;

        public CostOptimizedArchitectController(CostOptimizedOpenAIService aiService) {
                this.aiService = aiService;
        }

        @PostMapping("/suggest")
        public Mono<String> suggest(@RequestBody Map<String, String> lifestyleData) {
                return aiService.suggestConfiguration(lifestyleData);
        }

        @PostMapping("/generate")
        public Mono<String> generate(@RequestBody com.architect.app.model.ArchitectRequest request) {
                System.out.println("🚀 Received plan generation request for " + request.getHouseType());
                return aiService.generatePlans(request);
        }
}
