package com.krishimitra.controller;

import com.krishimitra.dto.response.ApiResponse;
import com.krishimitra.entity.Complaint;
import com.krishimitra.entity.ComplaintStatusHistory;
import com.krishimitra.service.ComplaintService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/complaints")
@RequiredArgsConstructor
@Tag(name = "Complaints", description = "Grievance Management APIs")
public class ComplaintController {

    private final ComplaintService complaintService;

    @PostMapping
    @Operation(summary = "Create a new complaint")
    public ResponseEntity<ApiResponse<Complaint>> create(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String category,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String incidentDate,
            @RequestParam(required = false) List<MultipartFile> attachments,
            Authentication auth) {

        Complaint complaint = new Complaint();
        complaint.setTitle(title);
        complaint.setDescription(description);
        complaint.setCategory(Complaint.Category.valueOf(category));
        complaint.setLocation(location);

        Complaint saved = complaintService.createComplaint(complaint, auth.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(saved, "Complaint filed successfully"));
    }

    @GetMapping("/my")
    @Operation(summary = "Get my complaints")
    public ResponseEntity<ApiResponse<Page<Complaint>>> getMyComplaints(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort,
            Authentication auth) {

        String[] sortParts = sort.split(",");
        Pageable pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.fromString(sortParts.length > 1 ? sortParts[1] : "desc"), sortParts[0]));

        Page<Complaint> complaints = complaintService.getMyComplaints(
                auth.getName(),
                status != null ? Complaint.Status.valueOf(status) : null,
                priority != null ? Complaint.Priority.valueOf(priority) : null,
                search, pageable);

        return ResponseEntity.ok(ApiResponse.success(complaints));
    }

    @GetMapping
    @Operation(summary = "Get all complaints (Admin/Officer)")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'OFFICER')")
    public ResponseEntity<ApiResponse<Page<Complaint>>> getAllComplaints(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication auth) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<Complaint> complaints = complaintService.getAllComplaints(
                status != null ? Complaint.Status.valueOf(status) : null,
                priority != null ? Complaint.Priority.valueOf(priority) : null,
                category != null ? Complaint.Category.valueOf(category) : null,
                search, pageable);

        return ResponseEntity.ok(ApiResponse.success(complaints));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get complaint by ID")
    public ResponseEntity<ApiResponse<Complaint>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(complaintService.findById(id)));
    }

    @GetMapping("/{id}/timeline")
    @Operation(summary = "Get complaint status timeline")
    public ResponseEntity<ApiResponse<List<ComplaintStatusHistory>>> getTimeline(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(complaintService.getTimeline(id)));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update complaint status")
    @PreAuthorize("hasAnyRole('OFFICER', 'ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Complaint>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            Authentication auth) {

        Complaint updated = complaintService.updateStatus(
                id,
                Complaint.Status.valueOf(body.get("status")),
                body.get("remarks"),
                auth.getName());

        return ResponseEntity.ok(ApiResponse.success(updated, "Status updated"));
    }

    @PatchMapping("/{id}/assign")
    @Operation(summary = "Assign complaint to officer")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Complaint>> assign(
            @PathVariable Long id,
            @RequestBody Map<String, Long> body) {
        return ResponseEntity.ok(ApiResponse.success(
                complaintService.assignToOfficer(id, body.get("officerId")),
                "Complaint assigned"));
    }

    @PostMapping("/{id}/vote")
    @Operation(summary = "Upvote a community complaint")
    public ResponseEntity<ApiResponse<Complaint>> vote(
            @PathVariable Long id,
            Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success(
                complaintService.upvote(id, auth.getName()),
                "Vote recorded"));
    }

    @PostMapping("/{id}/feedback")
    @Operation(summary = "Submit resolution feedback")
    public ResponseEntity<ApiResponse<Void>> feedback(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        complaintService.submitFeedback(
                id,
                Integer.parseInt(body.get("rating").toString()),
                body.getOrDefault("comment", "").toString());
        return ResponseEntity.ok(ApiResponse.success(null, "Feedback submitted. Thank you!"));
    }

    @GetMapping("/stats")
    @Operation(summary = "Get my complaint statistics")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getStats(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success(complaintService.getStats(auth.getName())));
    }

    @PostMapping("/check-duplicate")
    @Operation(summary = "Check for duplicate complaints")
    public ResponseEntity<ApiResponse<List<Complaint>>> checkDuplicate(
            @RequestBody Map<String, String> body) {
        List<Complaint> duplicates = complaintService.findPotentialDuplicates(
                body.get("title"), body.get("description"));
        return ResponseEntity.ok(ApiResponse.success(duplicates,
                duplicates.isEmpty() ? "No duplicates found" : duplicates.size() + " potential duplicate(s) found"));
    }
}
