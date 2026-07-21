package com.krishimitra.service.impl;

import com.krishimitra.dto.request.LoginRequest;
import com.krishimitra.dto.request.RegisterRequest;
import com.krishimitra.dto.response.AuthResponse;
import com.krishimitra.entity.User;
import com.krishimitra.exception.BadRequestException;
import com.krishimitra.exception.ResourceNotFoundException;
import com.krishimitra.repository.UserRepository;
import com.krishimitra.security.JwtUtils;
import com.krishimitra.service.AuthService;
import com.krishimitra.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }
        if (userRepository.existsByMobile(request.getMobile())) {
            throw new BadRequestException("Mobile already registered");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .mobile(request.getMobile())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(parseRole(request.getRole()))
                .village(request.getVillage())
                .district(request.getDistrict())
                .state(request.getState())
                .pincode(request.getPincode())
                .landArea(request.getLandArea())
                .primaryCrop(request.getPrimaryCrop())
                .active(true)
                .build();

        // Generate OTP
        String otp = generateOtp();
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));

        user = userRepository.save(user);
        log.info("User registered: {} ({})", user.getEmail(), user.getRole());

        // TODO: Send OTP via SMS/email

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtils.generateToken(userDetails);
        String refreshToken = jwtUtils.generateRefreshToken(userDetails);

        return buildAuthResponse(user, token, refreshToken);
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (BadCredentialsException e) {
            throw new BadRequestException("Invalid email or password");
        }

        User user = userRepository.findByEmailOrMobile(request.getEmail(), request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.isActive()) {
            throw new BadRequestException("Account is deactivated. Contact support.");
        }

        userRepository.updateLastLogin(user.getId());

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtils.generateToken(userDetails);
        String refreshToken = jwtUtils.generateRefreshToken(userDetails);

        log.info("User logged in: {}", user.getEmail());
        return buildAuthResponse(user, token, refreshToken);
    }

    @Override
    @Transactional
    public void verifyOtp(Long userId, String otp) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getOtp() == null || !user.getOtp().equals(otp)) {
            throw new BadRequestException("Invalid OTP");
        }
        if (LocalDateTime.now().isAfter(user.getOtpExpiry())) {
            throw new BadRequestException("OTP has expired. Please request a new one.");
        }

        user.setMobileVerified(true);
        user.setEmailVerified(true);
        user.setOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void resendOtp(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String otp = generateOtp();
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);
        // TODO: Send OTP
    }

    @Override
    @Transactional
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("No account found with this email"));

        String otp = generateOtp();
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);
        // TODO: Send reset email
    }

    @Override
    @Transactional
    public void resetPassword(String token, String newPassword) {
        // Token-based reset logic
        // TODO: Implement token-based password reset
    }

    @Override
    @Transactional
    public void changePassword(String email, String currentPassword, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    private User.Role parseRole(String roleStr) {
        try {
            return User.Role.valueOf(roleStr.toUpperCase());
        } catch (Exception e) {
            return User.Role.FARMER;
        }
    }

    private AuthResponse buildAuthResponse(User user, String token, String refreshToken) {
        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(86400000L)
                .user(AuthResponse.UserResponse.builder()
                        .id(user.getId())
                        .fullName(user.getFullName())
                        .email(user.getEmail())
                        .mobile(user.getMobile())
                        .role(user.getRole().name())
                        .village(user.getVillage())
                        .district(user.getDistrict())
                        .state(user.getState())
                        .profilePicture(user.getProfilePicture())
                        .emailVerified(user.isEmailVerified())
                        .mobileVerified(user.isMobileVerified())
                        .createdAt(user.getCreatedAt())
                        .build())
                .build();
    }
}
