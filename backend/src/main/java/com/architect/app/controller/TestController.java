package com.architect.app.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @Value("${huggingface.api.token:NOT_FOUND}")
    private String hfToken;

    @Value("${openai.api.key:NOT_FOUND}")
    private String openaiKey;

    @GetMapping("/config")
    public String testConfig() {
        StringBuilder sb = new StringBuilder();
        sb.append("=== Configuration Test ===\n");
        sb.append("HuggingFace Token Present: ").append(hfToken != null && !hfToken.equals("NOT_FOUND")).append("\n");
        sb.append("HuggingFace Token Length: ").append(hfToken != null ? hfToken.length() : 0).append("\n");
        sb.append("HuggingFace Token First 10 chars: ")
                .append(hfToken != null && hfToken.length() > 10 ? hfToken.substring(0, 10) + "..." : "N/A")
                .append("\n");
        sb.append("OpenAI Key Present: ").append(openaiKey != null && !openaiKey.equals("NOT_FOUND")).append("\n");
        sb.append("OpenAI Key Length: ").append(openaiKey != null ? openaiKey.length() : 0).append("\n");
        return sb.toString();
    }
}
