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
@RequestMapping("/mandi")
@RequiredArgsConstructor
@Tag(name = "Mandi Prices", description = "Agricultural market price APIs")
public class MandiController {

    @GetMapping("/prices")
    @Operation(summary = "Get current mandi prices")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getPrices(
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String crop) {

        return ResponseEntity.ok(ApiResponse.success(getMockPrices()));
    }

    @GetMapping("/nearby")
    @Operation(summary = "Get nearby mandis by coordinates")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getNearbyMandis(
            @RequestParam double lat,
            @RequestParam double lon) {

        return ResponseEntity.ok(ApiResponse.success(List.of(
                Map.of("name", "Nashik APMC", "distance", "12 km", "state", "Maharashtra", "type", "APMC"),
                Map.of("name", "Sinnar Market", "distance", "18 km", "state", "Maharashtra", "type", "LOCAL"),
                Map.of("name", "Yeola Mandi", "distance", "34 km", "state", "Maharashtra", "type", "APMC")
        )));
    }

    @GetMapping("/prices/history")
    @Operation(summary = "Get historical price data for a crop")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getPriceHistory(
            @RequestParam String cropName,
            @RequestParam(required = false) String mandiId,
            @RequestParam(defaultValue = "30") int days) {

        return ResponseEntity.ok(ApiResponse.success(List.of(
                Map.of("date", "2024-05-24", "price", 2100, "crop", cropName),
                Map.of("date", "2024-05-31", "price", 2180, "crop", cropName),
                Map.of("date", "2024-06-07", "price", 2200, "crop", cropName),
                Map.of("date", "2024-06-14", "price", 2230, "crop", cropName),
                Map.of("date", "2024-06-21", "price", 2250, "crop", cropName),
                Map.of("date", "2024-06-24", "price", 2260, "crop", cropName)
        )));
    }

    @GetMapping("/prices/forecast")
    @Operation(summary = "Get AI-powered price forecast")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPriceForecast(
            @RequestParam String cropName) {

        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "crop", cropName,
                "currentPrice", 2260,
                "forecast7Days", 2280,
                "forecast30Days", 2350,
                "trend", "UPWARD",
                "confidence", 72,
                "recommendation", "HOLD - Prices likely to rise in next 2 weeks due to reduced arrivals."
        )));
    }

    private List<Map<String, Object>> getMockPrices() {
        return List.of(
                Map.of("crop", "Wheat", "hindi", "गेहूं", "price", 2250, "prevPrice", 2180, "unit", "Quintal", "mandi", "Nashik", "category", "Cereal"),
                Map.of("crop", "Rice", "hindi", "धान", "price", 2150, "prevPrice", 2200, "unit", "Quintal", "mandi", "Nashik", "category", "Cereal"),
                Map.of("crop", "Tomato", "hindi", "टमाटर", "price", 1800, "prevPrice", 1200, "unit", "Quintal", "mandi", "Nashik", "category", "Vegetable"),
                Map.of("crop", "Onion", "hindi", "प्याज", "price", 950, "prevPrice", 1050, "unit", "Quintal", "mandi", "Nashik", "category", "Vegetable"),
                Map.of("crop", "Soybean", "hindi", "सोयाबीन", "price", 4800, "prevPrice", 4650, "unit", "Quintal", "mandi", "Pune", "category", "Oilseed"),
                Map.of("crop", "Cotton", "hindi", "कपास", "price", 7200, "prevPrice", 7000, "unit", "Quintal", "mandi", "Aurangabad", "category", "Cash Crop"),
                Map.of("crop", "Turmeric", "hindi", "हल्दी", "price", 9500, "prevPrice", 8800, "unit", "Quintal", "mandi", "Sangli", "category", "Spice")
        );
    }
}
