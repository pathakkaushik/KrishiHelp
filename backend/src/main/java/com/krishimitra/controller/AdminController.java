package com.krishimitra.controller;

import com.krishimitra.dto.response.ApiResponse;
import com.krishimitra.entity.User;
import com.krishimitra.repository.ComplaintRepository;
import com.krishimitra.repository.UserRepository;
import com.krishimitra.service.ComplaintService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
@Tag(name = "Admin", description = "Admin management APIs")
public class AdminController {

    private final UserRepository userRepository;
    private final ComplaintRepository complaintRepository;
    private final ComplaintService complaintService;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/stats")
    @Operation(summary = "Get platform dashboard statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalUsers", userRepository.count());
        stats.put("totalFarmers", userRepository.countByRole(User.Role.FARMER));
        stats.put("totalOfficers", userRepository.countByRole(User.Role.OFFICER));
        stats.put("activeFarmers", userRepository.countByRoleAndActiveTrue(User.Role.FARMER));

        Map<String, Long> complaintStats = complaintService.getAdminStats();
        stats.putAll(complaintStats);

        Double avgResolution = complaintRepository.avgResolutionTimeHours();
        stats.put("avgResolutionHours", avgResolution != null ? Math.round(avgResolution) : 0);

        long thisMonth = complaintRepository.countSince(LocalDateTime.now().minusMonths(1));
        stats.put("complaintsThisMonth", thisMonth);

        List<Object[]> byCategory = complaintRepository.countByCategory();
        Map<String, Long> categoryMap = new HashMap<>();
        byCategory.forEach(row -> categoryMap.put(row[0].toString(), (Long) row[1]));
        stats.put("byCategory", categoryMap);

        List<Object[]> byStatus = complaintRepository.countByStatusGroup();
        Map<String, Long> statusMap = new HashMap<>();
        byStatus.forEach(row -> statusMap.put(row[0].toString(), (Long) row[1]));
        stats.put("byStatus", statusMap);

        long resolved = (Long) complaintStats.getOrDefault("resolved", 0L);
        long total = (Long) complaintStats.getOrDefault("total", 1L);
        stats.put("resolutionRate", total > 0 ? Math.round((resolved * 100.0) / total * 10) / 10.0 : 0);

        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/users")
    @Operation(summary = "List all users with pagination")
    public ResponseEntity<ApiResponse<Page<User>>> getUsers(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        var pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<User> users;

        if (role != null && search != null) {
            users = userRepository.searchByRole(User.Role.valueOf(role), search, pageable);
        } else if (role != null) {
            users = userRepository.findByRole(User.Role.valueOf(role), pageable);
        } else {
            users = userRepository.findAll(pageable);
        }

        // Mask passwords
        users.forEach(u -> u.setPassword(null));
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @PatchMapping("/users/{id}/role")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Update user role (Super Admin only)")
    public ResponseEntity<ApiResponse<Void>> updateUserRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        userRepository.findById(id).ifPresent(user -> {
            user.setRole(User.Role.valueOf(body.get("role")));
            userRepository.save(user);
        });
        return ResponseEntity.ok(ApiResponse.success(null, "Role updated successfully"));
    }

    @PatchMapping("/users/{id}/status")
    @Operation(summary = "Activate or deactivate a user account")
    public ResponseEntity<ApiResponse<Void>> toggleUserStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body) {

        userRepository.findById(id).ifPresent(user -> {
            user.setActive(body.get("active"));
            userRepository.save(user);
        });
        return ResponseEntity.ok(ApiResponse.success(null, "User status updated"));
    }

    @GetMapping("/officers")
    @Operation(summary = "Get list of all officers")
    public ResponseEntity<ApiResponse<Page<User>>> getOfficers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        var pageable = PageRequest.of(page, size, Sort.by("fullName"));
        Page<User> officers = userRepository.findByRoleAndActiveTrue(User.Role.OFFICER, pageable);
        officers.forEach(u -> u.setPassword(null));
        return ResponseEntity.ok(ApiResponse.success(officers));
    }

    @PostMapping("/officers")
    @Operation(summary = "Create a new officer account")
    public ResponseEntity<ApiResponse<User>> createOfficer(@RequestBody Map<String, String> body) {
        if (userRepository.existsByEmail(body.get("email"))) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error("Email already registered"));
        }

        User officer = User.builder()
                .fullName(body.get("fullName"))
                .email(body.get("email"))
                .mobile(body.get("mobile"))
                .password(passwordEncoder.encode(body.getOrDefault("password", "Officer@123")))
                .role(User.Role.OFFICER)
                .department(body.get("department"))
                .designation(body.get("designation"))
                .district(body.get("district"))
                .state(body.get("state"))
                .active(true)
                .emailVerified(true)
                .build();

        User saved = userRepository.save(officer);
        saved.setPassword(null);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(saved, "Officer account created"));
    }

    @GetMapping("/analytics/villages")
    @Operation(summary = "Get village-level analytics")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getVillageAnalytics() {
        // Simplified — production would use proper query
        return ResponseEntity.ok(ApiResponse.success(List.of(
            Map.of("village", "Rahata", "district", "Ahmednagar", "complaints", 42, "resolved", 38, "rate", 90.5),
            Map.of("village", "Igatpuri", "district", "Nashik", "complaints", 38, "resolved", 31, "rate", 81.6),
            Map.of("village", "Sangamner", "district", "Ahmednagar", "complaints", 35, "resolved", 33, "rate", 94.3)
        )));
    }

    @GetMapping("/analytics/departments")
    @Operation(summary = "Get department-level analytics")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getDepartmentAnalytics() {
        return ResponseEntity.ok(ApiResponse.success(List.of(
            Map.of("department", "Agriculture", "assigned", 120, "resolved", 108, "avgDays", 3.2),
            Map.of("department", "Water Dept", "assigned", 95, "resolved", 82, "avgDays", 4.1),
            Map.of("department", "Roads", "assigned", 78, "resolved", 61, "avgDays", 7.5)
        )));
    }

    @GetMapping("/analytics/resolution")
    @Operation(summary = "Get resolution time analytics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getResolutionAnalytics() {
        Double avgHours = complaintRepository.avgResolutionTimeHours();
        return ResponseEntity.ok(ApiResponse.success(Map.of(
            "avgResolutionHours", avgHours != null ? avgHours : 0,
            "avgResolutionDays", avgHours != null ? avgHours / 24 : 0,
            "slaBreached", 0,
            "resolvedWithin3Days", 0,
            "resolvedWithin7Days", 0
        )));
    }
}
