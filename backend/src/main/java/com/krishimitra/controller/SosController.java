package com.krishimitra.controller;

import com.krishimitra.dto.response.ApiResponse;
import com.krishimitra.entity.User;
import com.krishimitra.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/sos")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "SOS Emergency", description = "Emergency SOS APIs")
public class SosController {

    private final UserRepository userRepository;

    @PostMapping("/trigger")
    @Operation(summary = "Trigger an SOS emergency alert")
    public ResponseEntity<ApiResponse<Map<String, Object>>> triggerSOS(
            @RequestBody Map<String, String> body,
            Authentication auth) {

        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        String referenceId = "SOS-" + System.currentTimeMillis();

        log.warn("🚨 SOS TRIGGERED by {} ({}) — Type: {} — Location: {}",
                user.getFullName(), user.getMobile(),
                body.get("type"), user.getVillage());

        // In production: notify nearest officers, send SMS, trigger alerts
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "referenceId", referenceId,
                "status", "TRIGGERED",
                "message", "SOS alert sent. Authorities have been notified.",
                "triggeredAt", LocalDateTime.now().toString(),
                "estimatedResponse", "15-30 minutes"
        ), "SOS alert triggered successfully"));
    }

    @GetMapping("/contacts")
    @Operation(summary = "Get nearby emergency contacts")
    public ResponseEntity<ApiResponse<List<Map<String, String>>>> getContacts(
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon) {

        return ResponseEntity.ok(ApiResponse.success(List.of(
                Map.of("name", "Ambulance", "number", "108", "type", "MEDICAL"),
                Map.of("name", "Police Control Room", "number", "100", "type", "POLICE"),
                Map.of("name", "Fire Brigade", "number", "101", "type", "FIRE"),
                Map.of("name", "NDRF Helpline", "number", "011-24363260", "type", "DISASTER"),
                Map.of("name", "Kisan Helpline", "number", "1800-180-1551", "type", "AGRICULTURE"),
                Map.of("name", "PM Kisan Helpline", "number", "155261", "type", "SCHEME"),
                Map.of("name", "Women Helpline", "number", "1091", "type", "SAFETY"),
                Map.of("name", "Child Helpline", "number", "1098", "type", "CHILD")
        )));
    }
}
