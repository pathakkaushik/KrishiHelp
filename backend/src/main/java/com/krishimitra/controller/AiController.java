package com.krishimitra.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.krishimitra.dto.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "AI Assistant", description = "AI-powered farming assistant APIs")
public class AiController {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${ANTHROPIC_API_KEY:}")
    private String anthropicApiKey;

    private static final String SYSTEM_PROMPT = """
        You are KrishiMitra AI, an expert agricultural assistant for Indian farmers.
        You help with crop diseases, pests, treatments, fertilizer recommendations,
        irrigation advice, government schemes (PM Kisan, KCC, crop insurance, PMFBY),
        mandi prices, weather-based farming advice, loan guidance and financial planning.
        
        Always respond in a clear, friendly manner. Support both Hindi and English.
        When diagnosing crop problems, ask about: crop type/age, symptoms, location/season,
        recent weather/irrigation. Provide practical, actionable advice.
        Mention relevant support resources (KVK, agriculture department) when appropriate.
        Keep responses concise and farmer-friendly.
        """;

    @PostMapping("/chat")
    @Operation(summary = "Chat with KrishiMitra AI assistant")
    public ResponseEntity<ApiResponse<Map<String, String>>> chat(
            @RequestBody Map<String, Object> body,
            Authentication auth) {

        String message = (String) body.get("message");
        List<Map<String, String>> history = (List<Map<String, String>>) body.getOrDefault("history", List.of());

        if (message == null || message.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Message cannot be empty"));
        }

        try {
            String response = callAnthropicAPI(message, history);
            return ResponseEntity.ok(ApiResponse.success(
                    Map.of("message", response, "timestamp", new Date().toString())));
        } catch (Exception e) {
            log.error("AI chat error: {}", e.getMessage());
            return ResponseEntity.ok(ApiResponse.success(
                    Map.of("message", getFallbackResponse(message))));
        }
    }

    @GetMapping("/suggestions")
    @Operation(summary = "Get suggested questions based on context")
    public ResponseEntity<ApiResponse<List<String>>> getSuggestions(
            @RequestParam(required = false) String context) {

        List<String> suggestions = List.of(
                "मेरी फसल की पत्तियां पीली हो रही हैं।",
                "खरीफ फसल के लिए सबसे अच्छी खाद कौन सी है?",
                "PM Kisan योजना के बारे में बताएं",
                "मिट्टी की जांच कैसे करें?",
                "टमाटर में लगने वाले कीटों से कैसे बचें?",
                "KCC loan के लिए कैसे apply करें?",
                "सोलर पंप सब्सिडी की जानकारी दें",
                "बरसात से पहले क्या-क्या सावधानियां बरतनी चाहिए?"
        );
        return ResponseEntity.ok(ApiResponse.success(suggestions));
    }

    // ─── Private Helpers ─────────────────────────────────────────────────────

    private String callAnthropicAPI(String message, List<Map<String, String>> history) {
        if (anthropicApiKey == null || anthropicApiKey.isBlank()) {
            return getFallbackResponse(message);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-api-key", anthropicApiKey);
        headers.set("anthropic-version", "2023-06-01");

        List<Map<String, String>> messages = new ArrayList<>();
        for (Map<String, String> h : history) {
            messages.add(Map.of("role", h.get("role"), "content", h.get("content")));
        }
        messages.add(Map.of("role", "user", "content", message));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "claude-sonnet-4-6");
        requestBody.put("max_tokens", 1000);
        requestBody.put("system", SYSTEM_PROMPT);
        requestBody.put("messages", messages);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                "https://api.anthropic.com/v1/messages", request, Map.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            List<Map<String, Object>> content = (List<Map<String, Object>>) response.getBody().get("content");
            if (content != null && !content.isEmpty()) {
                return (String) content.get(0).get("text");
            }
        }
        return getFallbackResponse(message);
    }

    private String getFallbackResponse(String message) {
        String lower = message.toLowerCase();
        if (lower.contains("wheat") || lower.contains("गेहूं")) {
            return "गेहूं के बारे में: रोग की पहचान के लिए पत्तियों का रंग और धब्बों का आकार देखें। " +
                    "पीली पत्तियां Rust रोग का संकेत हो सकती हैं। Mancozeb 75WP @ 2g/L का छिड़काव करें। " +
                    "अपने नजदीकी KVK से संपर्क करें।";
        }
        if (lower.contains("pm kisan") || lower.contains("scheme") || lower.contains("योजना")) {
            return "PM Kisan Samman Nidhi योजना में हर साल ₹6,000 की सहायता मिलती है। " +
                    "पात्रता: जमीन के मालिक किसान। आवेदन: pmkisan.gov.in पर जाएं। " +
                    "दस्तावेज: आधार, बैंक खाता, जमीन के कागज।";
        }
        if (lower.contains("kcc") || lower.contains("loan") || lower.contains("ऋण")) {
            return "किसान क्रेडिट कार्ड (KCC) पर 4% ब्याज दर पर ₹3 लाख तक का ऋण मिलता है। " +
                    "नजदीकी बैंक शाखा से संपर्क करें। जमीन के कागज और आधार कार्ड जरूरी हैं।";
        }
        return "नमस्ते! मैं KrishiMitra AI हूं। मैं आपकी खेती से जुड़ी समस्याओं में मदद कर सकता हूं। " +
                "कृपया अपनी फसल का नाम और समस्या विस्तार से बताएं।";
    }
}
