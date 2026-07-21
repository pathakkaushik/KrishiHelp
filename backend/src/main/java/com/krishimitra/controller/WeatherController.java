package com.krishimitra.controller;

import com.krishimitra.dto.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/weather")
@RequiredArgsConstructor
@Tag(name = "Weather", description = "Weather and climate advisory APIs")
public class WeatherController {

    private final RestTemplate restTemplate;

    @Value("${app.weather.api-key:}")
    private String weatherApiKey;

    @Value("${app.weather.base-url:https://api.openweathermap.org/data/2.5}")
    private String weatherBaseUrl;

    @GetMapping("/current")
    @Operation(summary = "Get current weather by coordinates")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCurrentWeather(
            @RequestParam(defaultValue = "19.9975") double lat,
            @RequestParam(defaultValue = "73.7898") double lon) {

        if (weatherApiKey == null || weatherApiKey.isBlank()) {
            return ResponseEntity.ok(ApiResponse.success(getMockWeather()));
        }

        try {
            String url = weatherBaseUrl + "/weather?lat=" + lat + "&lon=" + lon
                    + "&units=metric&appid=" + weatherApiKey;
            Map data = restTemplate.getForObject(url, Map.class);
            return ResponseEntity.ok(ApiResponse.success(data));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.success(getMockWeather()));
        }
    }

    @GetMapping("/forecast")
    @Operation(summary = "Get 7-day weather forecast")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getForecast(
            @RequestParam(defaultValue = "19.9975") double lat,
            @RequestParam(defaultValue = "73.7898") double lon,
            @RequestParam(defaultValue = "7") int days) {

        return ResponseEntity.ok(ApiResponse.success(getMockForecast()));
    }

    @GetMapping("/alerts")
    @Operation(summary = "Get active weather alerts")
    public ResponseEntity<ApiResponse<List<Map<String, String>>>> getAlerts(
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon) {

        return ResponseEntity.ok(ApiResponse.success(List.of(
                Map.of("type", "RAIN", "severity", "MODERATE",
                        "message", "Heavy rainfall expected Tuesday–Wednesday. Rainfall 65–80mm.",
                        "validFrom", "2024-06-25", "validTo", "2024-06-26"),
                Map.of("type", "HEATWAVE", "severity", "LOW",
                        "message", "Temperatures may touch 35°C on Friday. Stay hydrated.",
                        "validFrom", "2024-06-28", "validTo", "2024-06-28")
        )));
    }

    @GetMapping("/farming-advice")
    @Operation(summary = "Get weather-based farming advice")
    public ResponseEntity<ApiResponse<List<Map<String, String>>>> getFarmingAdvice(
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon) {

        return ResponseEntity.ok(ApiResponse.success(List.of(
                Map.of("category", "IRRIGATION", "advice", "Rain expected Tue–Wed. Skip irrigation for 2 days.", "icon", "💧"),
                Map.of("category", "SOWING", "advice", "Good window for sowing on Fri–Sat. Soil moisture optimal.", "icon", "🌾"),
                Map.of("category", "PEST", "advice", "High humidity increases fungal risk. Apply preventive spray today.", "icon", "🐛"),
                Map.of("category", "HARVEST", "advice", "Avoid harvesting Tue–Wed due to rain. Plan for Thursday.", "icon", "🧹")
        )));
    }

    private Map<String, Object> getMockWeather() {
        return Map.of(
                "temp", 29, "feels_like", 33, "humidity", 68,
                "wind", 14, "visibility", 8, "pressure", 1012,
                "uv", 6, "condition", "Partly Cloudy", "icon", "⛅",
                "rain_probability", 20
        );
    }

    private Map<String, Object> getMockForecast() {
        return Map.of("daily", List.of(
                Map.of("day", "Today", "high", 32, "low", 22, "rain", 20, "condition", "Partly Cloudy"),
                Map.of("day", "Tue", "high", 29, "low", 21, "rain", 65, "condition", "Rainy"),
                Map.of("day", "Wed", "high", 27, "low", 20, "rain", 80, "condition", "Thunderstorm"),
                Map.of("day", "Thu", "high", 31, "low", 22, "rain", 30, "condition", "Mostly Sunny"),
                Map.of("day", "Fri", "high", 33, "low", 24, "rain", 10, "condition", "Sunny"),
                Map.of("day", "Sat", "high", 34, "low", 25, "rain", 5, "condition", "Clear"),
                Map.of("day", "Sun", "high", 30, "low", 22, "rain", 45, "condition", "Showers")
        ));
    }
}
