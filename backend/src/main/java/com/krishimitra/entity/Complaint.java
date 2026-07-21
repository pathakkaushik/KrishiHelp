package com.krishimitra.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "complaints", indexes = {
    @Index(name = "idx_complaint_number", columnList = "complaintNumber", unique = true),
    @Index(name = "idx_complaint_user", columnList = "user_id"),
    @Index(name = "idx_complaint_status", columnList = "status"),
    @Index(name = "idx_complaint_priority", columnList = "priority"),
    @Index(name = "idx_complaint_category", columnList = "category"),
    @Index(name = "idx_complaint_officer", columnList = "assigned_officer_id"),
})
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String complaintNumber;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Category category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private Status status = Status.OPEN;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    @Builder.Default
    private Priority priority = Priority.MEDIUM;

    @Column(length = 255)
    private String location;

    @Column(length = 100)
    private String village;

    @Column(length = 100)
    private String district;

    private LocalDateTime incidentDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_officer_id")
    private User assignedOfficer;

    @OneToMany(mappedBy = "complaint", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ComplaintAttachment> attachments = new ArrayList<>();

    @OneToMany(mappedBy = "complaint", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ComplaintStatusHistory> statusHistory = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    private String aiAnalysis;

    @Column(columnDefinition = "TINYINT DEFAULT 0")
    private int aiConfidence;

    @Builder.Default
    private int upvotes = 0;

    @Builder.Default
    private boolean isDuplicate = false;

    private Long duplicateOf;

    private LocalDateTime resolvedAt;

    private LocalDateTime escalatedAt;

    @Column(columnDefinition = "TEXT")
    private String resolutionNotes;

    private Integer feedbackRating;

    @Column(columnDefinition = "TEXT")
    private String feedbackComment;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum Category {
        WATER_IRRIGATION, ELECTRICITY, ROADS, GOVERNMENT_SCHEMES,
        AGRICULTURE, FERTILIZER, SEEDS, ANIMAL_HUSBANDRY,
        PUBLIC_SERVICES, DISASTER
    }

    public enum Status {
        OPEN, PENDING, IN_PROGRESS, RESOLVED, CLOSED, ESCALATED
    }

    public enum Priority {
        LOW, MEDIUM, HIGH, CRITICAL
    }
}
