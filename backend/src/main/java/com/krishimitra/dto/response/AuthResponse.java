package com.krishimitra.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class AuthResponse {
    private String token;
    private String refreshToken;
    private String tokenType;
    private UserResponse user;
    private Long expiresIn;

    @Data
    @Builder
    public static class UserResponse {
        private Long id;
        private String fullName;
        private String email;
        private String mobile;
        private String role;
        private String village;
        private String district;
        private String state;
        private String profilePicture;
        private boolean emailVerified;
        private boolean mobileVerified;
        private LocalDateTime createdAt;
    }
}
