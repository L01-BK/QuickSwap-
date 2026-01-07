package com.quickswap.backend.controller;

import com.quickswap.backend.dto.*;
import com.quickswap.backend.entity.User;
import com.quickswap.backend.service.UserService;
import com.quickswap.backend.service.PasswordResetService;
import com.quickswap.backend.dto.ForgotPasswordRequest;
import com.quickswap.backend.dto.ResetPasswordRequest;
import com.quickswap.backend.dto.VerifyOtpRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final PasswordResetService passwordResetService;

    @PostMapping("/register")
    public ResponseEntity<com.quickswap.backend.dto.AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(userService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<com.quickswap.backend.dto.AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        passwordResetService.sendResetOtp(request.getEmail());
        return ResponseEntity.ok("OTP đã được gửi đến email nếu email tồn tại trong hệ thống.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        passwordResetService.verifyAndReset(request.getEmail(), request.getOtp(), request.getNewPassword());
        return ResponseEntity.ok("Mật khẩu đã được đặt lại thành công.");
    }

    @PostMapping("/check-otp")
    public ResponseEntity<Boolean> checkOtp(@RequestBody VerifyOtpRequest request) {
        boolean valid = passwordResetService.checkOtpValid(request.getEmail(), request.getOtp());
        return ResponseEntity.ok(valid);
    }
}