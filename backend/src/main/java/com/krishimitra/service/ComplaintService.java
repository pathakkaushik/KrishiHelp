package com.krishimitra.service;

import com.krishimitra.entity.Complaint;
import com.krishimitra.entity.ComplaintStatusHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface ComplaintService {
    Complaint createComplaint(Complaint complaint, String userEmail);
    Complaint updateStatus(Long id, Complaint.Status newStatus, String remarks, String updaterEmail);
    Complaint assignToOfficer(Long id, Long officerId);
    Complaint upvote(Long id, String userEmail);
    void submitFeedback(Long id, int rating, String comment);
    Complaint findById(Long id);
    Page<Complaint> getMyComplaints(String userEmail, Complaint.Status status, Complaint.Priority priority, String search, Pageable pageable);
    Page<Complaint> getAllComplaints(Complaint.Status status, Complaint.Priority priority, Complaint.Category category, String search, Pageable pageable);
    Page<Complaint> getOfficerComplaints(String officerEmail, Complaint.Status status, Pageable pageable);
    List<ComplaintStatusHistory> getTimeline(Long id);
    Map<String, Long> getStats(String userEmail);
    Map<String, Long> getAdminStats();
    List<Complaint> findPotentialDuplicates(String title, String description);
}
