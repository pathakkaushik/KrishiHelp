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
@Table(name = "users", indexes = {
    @Index(name = "idx_users_email", columnList = "email", unique = true),
    @Index(name = "idx_users_mobile", columnList = "mobile", unique = true),
    @Index(name = "idx_users_role", columnList = "role"),
    @Index(name = "idx_users_village", columnList = "village"),
})
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false, unique = true, length = 15)
    private String mobile;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @Column(length = 255)
    private String profilePicture;

    @Column(length = 100)
    private String village;

    @Column(length = 100)
    private String district;

    @Column(length = 100)
    private String state;

    @Column(length = 10)
    private String pincode;

    @Column(columnDefinition = "DECIMAL(10,8)")
    private Double latitude;

    @Column(columnDefinition = "DECIMAL(11,8)")
    private Double longitude;

    @Column(length = 20)
    private String landArea; // acres

    @Column(length = 50)
    private String primaryCrop;

    @Column(length = 6)
    private String otp;

    private LocalDateTime otpExpiry;

    @Builder.Default
    private boolean emailVerified = false;

    @Builder.Default
    private boolean mobileVerified = false;

    @Builder.Default
    private boolean active = true;

    @Builder.Default
    private boolean deleted = false;

    private LocalDateTime lastLogin;

    @Column(length = 100)
    private String department; // For officers

    @Column(length = 50)
    private String designation; // For officers

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum Role {
        FARMER, OFFICER, ADMIN, SUPER_ADMIN
    }
}
