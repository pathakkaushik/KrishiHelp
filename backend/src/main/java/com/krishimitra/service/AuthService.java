package com.krishimitra.service;

import com.krishimitra.dto.request.LoginRequest;
import com.krishimitra.dto.request.RegisterRequest;
import com.krishimitra.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    void verifyOtp(Long userId, String otp);
    void resendOtp(Long userId);
    void forgotPassword(String email);
    void resetPassword(String token, String newPassword);
    void changePassword(String email, String currentPassword, String newPassword);
}
