package com.krishimitra.controller;

import com.krishimitra.dto.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/schemes")
@RequiredArgsConstructor
@Tag(name = "Government Schemes", description = "Scheme discovery and eligibility APIs")
public class SchemeController {

    @GetMapping
    @Operation(summary = "Get all government schemes")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllSchemes(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String state) {

        return ResponseEntity.ok(ApiResponse.success(List.of(
            Map.of("id", 1, "name", "PM Kisan Samman Nidhi", "benefit", "₹6,000/year",
                "eligibility", "Land-owning farmers", "category", "INCOME_SUPPORT",
                "icon", "🌾", "applicationUrl", "https://pmkisan.gov.in"),
            Map.of("id", 2, "name", "Pradhan Mantri Fasal Bima Yojana", "benefit", "Crop Insurance",
                "eligibility", "All farmers with crop loans", "category", "INSURANCE",
                "icon", "🛡️", "applicationUrl", "https://pmfby.gov.in"),
            Map.of("id", 3, "name", "Kisan Credit Card (KCC)", "benefit", "Credit up to ₹3 lakh @ 4%",
                "eligibility", "Farmers with land records", "category", "CREDIT",
                "icon", "💳", "applicationUrl", "https://agricoop.nic.in"),
            Map.of("id", 4, "name", "PM Kusum Solar Pump", "benefit", "60% subsidy on solar pump",
                "eligibility", "Farmers without grid electricity", "category", "INFRASTRUCTURE",
                "icon", "☀️", "applicationUrl", "https://mnre.gov.in"),
            Map.of("id", 5, "name", "Soil Health Card Scheme", "benefit", "Free soil testing & card",
                "eligibility", "All farmers", "category", "SOIL",
                "icon", "🧪", "applicationUrl", "https://soilhealth.dac.gov.in"),
            Map.of("id", 6, "name", "e-NAM Platform", "benefit", "Better market prices online",
                "eligibility", "Registered farmers", "category", "MARKET",
                "icon", "📊", "applicationUrl", "https://enam.gov.in"),
            Map.of("id", 7, "name", "Paramparagat Krishi Vikas Yojana", "benefit", "₹50,000/ha for organic farming",
                "eligibility", "Farmers willing to adopt organic", "category", "ORGANIC",
                "icon", "🌿", "applicationUrl", "https://pgsindia-ncof.gov.in")
        )));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get scheme details by ID")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "id", id,
                "name", "PM Kisan Samman Nidhi",
                "description", "Under PM-KISAN scheme, financial benefit of ₹6000 per year is provided to the farmer families, payable in three equal installments of ₹2000 each.",
                "benefit", "₹6,000/year in 3 installments",
                "eligibility", List.of("Land-owning farmer families", "Family includes farmer, spouse and minor children", "Subject to certain exclusion criteria"),
                "documents", List.of("Aadhaar Card", "Bank Account Details", "Land Records (Khatauni)"),
                "applicationUrl", "https://pmkisan.gov.in",
                "helpline", "155261"
        )));
    }

    @PostMapping("/{id}/eligibility")
    @Operation(summary = "Check eligibility for a scheme")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkEligibility(
            @PathVariable Long id,
            @RequestBody Map<String, Object> profile) {

        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "schemeId", id,
                "eligible", true,
                "score", 85,
                "reasons", List.of("You are a land-owning farmer", "Your income is within the eligible range"),
                "missingCriteria", List.of(),
                "nextSteps", List.of("Visit pmkisan.gov.in", "Register with Aadhaar and bank details", "Submit land records")
        )));
    }
}
