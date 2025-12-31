package com.quickswap.backend.service;

import com.quickswap.backend.dto.*;
import com.quickswap.backend.model.User;
import com.quickswap.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    
    private final Map<String, String> otpStore = new ConcurrentHashMap<>();
    private final Map<String, Boolean> otpVerified = new ConcurrentHashMap<>();

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email hoặc mật khẩu không chính xác"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Email hoặc mật khẩu không chính xác");
        }

        return new LoginResponse(user.getEmail(), user.getFullName());
    }

    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Mật khẩu xác nhận không khớp");
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã được đăng ký");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);
        return new RegisterResponse( user.getEmail(),user.getFullName());
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Email không tồn tại"));

    
    if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
        throw new RuntimeException("Mật khẩu cũ không chính xác");
    }

    
    if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
        throw new RuntimeException("Mật khẩu mới phải khác mật khẩu cũ");
    }

       
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    
    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));

        String otp = generateOtp();
        otpStore.put(user.getEmail(), otp);
        otpVerified.put(user.getEmail(), false);

    
        System.out.println("DEBUG: OTP gửi tới " + user.getEmail() + ": " + otp);
    }

    public void verifyOtp(VerifyOtpRequest request) {
        String savedOtp = otpStore.get(request.getEmail());

        if (savedOtp == null || !savedOtp.equals(request.getOtp())) {
            throw new RuntimeException("Mã OTP không chính xác hoặc đã hết hạn");
        }

        otpVerified.put(request.getEmail(), true);
    }

    public void resendOtp(ResendOtpRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isEmpty()) {
            throw new RuntimeException("Email không tồn tại");
        }

        String otp = generateOtp();
        otpStore.put(request.getEmail(), otp);
        otpVerified.put(request.getEmail(), false);

        System.out.println("DEBUG: OTP gửi lại tới " + request.getEmail() + ": " + otp);
    }

    @Transactional
    public void resetPasswordWithOtp(ResetPasswordOtpRequest request) {
        Boolean verified = otpVerified.getOrDefault(request.getEmail(), false);

        if (!verified) {
            throw new RuntimeException("Vui lòng xác minh OTP trước khi đổi mật khẩu");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));

        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new RuntimeException("Mật khẩu mới phải khác mật khẩu cũ");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        
        otpStore.remove(request.getEmail());
        otpVerified.remove(request.getEmail());
    }

    private String generateOtp() {
        return String.format("%04d", new Random().nextInt(10000));
    }
}