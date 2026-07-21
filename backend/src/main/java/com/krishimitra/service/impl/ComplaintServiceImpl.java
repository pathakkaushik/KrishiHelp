package com.krishimitra.service.impl;

import com.krishimitra.entity.Complaint;
import com.krishimitra.entity.ComplaintStatusHistory;
import com.krishimitra.entity.Notification;
import com.krishimitra.entity.User;
import com.krishimitra.exception.BadRequestException;
import com.krishimitra.exception.ResourceNotFoundException;
import com.krishimitra.repository.ComplaintRepository;
import com.krishimitra.repository.NotificationRepository;
import com.krishimitra.repository.UserRepository;
import com.krishimitra.service.ComplaintService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

@Service
@RequiredArgsConstructor
@Slf4j
public class ComplaintServiceImpl implements ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    @Override
    @Transactional
    public Complaint createComplaint(Complaint complaint, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        complaint.setUser(user);
        complaint.setComplaintNumber(generateComplaintNumber());
        complaint.setStatus(Complaint.Status.OPEN);

        // AI Priority prediction (simplified rule-based)
        complaint.setPriority(predictPriority(complaint));

        Complaint saved = complaintRepository.save(complaint);

        // Add initial status history
        addStatusHistory(saved, Complaint.Status.OPEN, "Complaint filed successfully", user);

        // Create notification
        createNotification(user, "Complaint Filed",
                "Your complaint #" + saved.getComplaintNumber() + " has been registered.",
                Notification.Type.SUCCESS, "complaint", saved.getId());

        log.info("Complaint created: {} by {}", saved.getComplaintNumber(), userEmail);
        return saved;
    }

    @Override
    @Transactional
    public Complaint updateStatus(Long id, Complaint.Status newStatus, String remarks, String updaterEmail) {
        Complaint complaint = findById(id);
        User updater = userRepository.findByEmail(updaterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Complaint.Status oldStatus = complaint.getStatus();
        complaint.setStatus(newStatus);

        if (newStatus == Complaint.Status.RESOLVED) {
            complaint.setResolvedAt(LocalDateTime.now());
        }
        if (newStatus == Complaint.Status.ESCALATED) {
            complaint.setEscalatedAt(LocalDateTime.now());
        }

        addStatusHistory(complaint, newStatus, remarks, updater);
        Complaint updated = complaintRepository.save(complaint);

        // Notify the farmer
        createNotification(complaint.getUser(),
                "Complaint Update",
                "Your complaint #" + complaint.getComplaintNumber() + " status changed to " + newStatus,
                newStatus == Complaint.Status.RESOLVED ? Notification.Type.SUCCESS : Notification.Type.INFO,
                "complaint", complaint.getId());

        return updated;
    }

    @Override
    @Transactional
    public Complaint assignToOfficer(Long id, Long officerId) {
        Complaint complaint = findById(id);
        User officer = userRepository.findById(officerId)
                .orElseThrow(() -> new ResourceNotFoundException("Officer not found"));

        complaint.setAssignedOfficer(officer);
        complaint.setStatus(Complaint.Status.PENDING);

        addStatusHistory(complaint, Complaint.Status.PENDING,
                "Assigned to " + officer.getFullName(), officer);

        // Notify officer
        createNotification(officer, "New Complaint Assigned",
                "Complaint #" + complaint.getComplaintNumber() + " has been assigned to you.",
                Notification.Type.INFO, "complaint", complaint.getId());

        return complaintRepository.save(complaint);
    }

    @Override
    @Transactional
    public Complaint upvote(Long id, String userEmail) {
        Complaint complaint = findById(id);
        complaint.setUpvotes(complaint.getUpvotes() + 1);
        return complaintRepository.save(complaint);
    }

    @Override
    @Transactional
    public void submitFeedback(Long id, int rating, String comment) {
        Complaint complaint = findById(id);
        if (complaint.getStatus() != Complaint.Status.RESOLVED) {
            throw new BadRequestException("Can only submit feedback for resolved complaints");
        }
        complaint.setFeedbackRating(rating);
        complaint.setFeedbackComment(comment);
        complaintRepository.save(complaint);
    }

    @Override
    @Transactional(readOnly = true)
    public Complaint findById(Long id) {
        return complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Complaint> getMyComplaints(String userEmail, Complaint.Status status,
                                            Complaint.Priority priority, String search, Pageable pageable) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return complaintRepository.findByUserWithFilters(user, status, priority, search, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Complaint> getAllComplaints(Complaint.Status status, Complaint.Priority priority,
                                            Complaint.Category category, String search, Pageable pageable) {
        return complaintRepository.findAllWithFilters(status, priority, category, search, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Complaint> getOfficerComplaints(String officerEmail, Complaint.Status status, Pageable pageable) {
        User officer = userRepository.findByEmail(officerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Officer not found"));
        if (status != null) {
            return complaintRepository.findByAssignedOfficerAndStatus(officer, status, pageable);
        }
        return complaintRepository.findByAssignedOfficer(officer, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComplaintStatusHistory> getTimeline(Long id) {
        Complaint complaint = findById(id);
        return complaint.getStatusHistory();
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> getStats(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return Map.of(
            "total", complaintRepository.countByUser(user),
            "open", complaintRepository.countByUserAndStatus(user, Complaint.Status.OPEN),
            "pending", complaintRepository.countByUserAndStatus(user, Complaint.Status.PENDING),
            "in_progress", complaintRepository.countByUserAndStatus(user, Complaint.Status.IN_PROGRESS),
            "resolved", complaintRepository.countByUserAndStatus(user, Complaint.Status.RESOLVED),
            "high_priority", 0L // simplified
        );
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> getAdminStats() {
        return Map.of(
            "total", complaintRepository.count(),
            "open", complaintRepository.countByStatus(Complaint.Status.OPEN),
            "pending", complaintRepository.countByStatus(Complaint.Status.PENDING),
            "in_progress", complaintRepository.countByStatus(Complaint.Status.IN_PROGRESS),
            "resolved", complaintRepository.countByStatus(Complaint.Status.RESOLVED),
            "high_priority", complaintRepository.countByPriority(Complaint.Priority.HIGH)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<Complaint> findPotentialDuplicates(String title, String description) {
        return complaintRepository.findPotentialDuplicates(title, description);
    }

    // ─── Private Helpers ─────────────────────────────────────────────────────

    private String generateComplaintNumber() {
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long count = complaintRepository.count() + 1;
        return "KM-" + date + "-" + String.format("%04d", count);
    }

    private Complaint.Priority predictPriority(Complaint complaint) {
        String text = (complaint.getTitle() + " " + complaint.getDescription()).toLowerCase();

        if (text.contains("flood") || text.contains("disaster") || text.contains("death")
                || text.contains("emergency") || text.contains("fire") || text.contains("accident")) {
            return Complaint.Priority.CRITICAL;
        }
        if (text.contains("urgent") || text.contains("water") || text.contains("electric")
                || text.contains("hospital") || text.contains("children")) {
            return Complaint.Priority.HIGH;
        }
        if (text.contains("road") || text.contains("crop") || text.contains("scheme")
                || text.contains("fertilizer")) {
            return Complaint.Priority.MEDIUM;
        }
        return Complaint.Priority.LOW;
    }

    private void addStatusHistory(Complaint complaint, Complaint.Status status,
                                   String remarks, User updatedBy) {
        ComplaintStatusHistory history = ComplaintStatusHistory.builder()
                .complaint(complaint)
                .status(status)
                .remarks(remarks)
                .action(status.name().replace("_", " "))
                .updatedBy(updatedBy)
                .build();
        complaint.getStatusHistory().add(history);
    }

    private void createNotification(User user, String title, String message,
                                     Notification.Type type, String entityType, Long entityId) {
        Notification notif = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .relatedEntityType(entityType)
                .relatedEntityId(entityId)
                .build();
        notificationRepository.save(notif);
    }
}
