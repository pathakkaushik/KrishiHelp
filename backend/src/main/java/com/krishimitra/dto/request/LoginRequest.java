package com.krishimitra.dto.request;

import com.krishimitra.entity.User;
import jakarta.validation.constraints.*;
import lombok.Data;

// ─── Login Request ───────────────────────────────────────────────────────────
@Data
public class LoginRequest {
    @NotBlank(message = "Email or mobile is required")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
}
