package com.krishimitra.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications", indexes = {
    @Index(name = "idx_notif_user", columnList = "user_id"),
    @Index(name = "idx_notif_read", columnList = "is_read"),
})
@EntityListeners(AuditingEntityListener.class)
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Notification {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    @Builder.Default
    private Type type = Type.INFO;

    @Column(name = "is_read")
    @Builder.Default
    private boolean isRead = false;

    @Column(length = 100)
    private String relatedEntityType;

    private Long relatedEntityId;

    @Column(length = 255)
    private String actionUrl;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    public enum Type { INFO, SUCCESS, WARNING, ERROR }
}
