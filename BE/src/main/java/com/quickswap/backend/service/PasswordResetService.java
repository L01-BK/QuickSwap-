package com.quickswap.backend.service;

import com.quickswap.backend.entity.PasswordResetToken;
import com.quickswap.backend.entity.User;
import com.quickswap.backend.repository.PasswordResetTokenRepository;
import com.quickswap.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Transactional
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    private static final int OTP_EXPIRY_MINUTES = 15;

    public void sendResetOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // generate 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(1_000_000));

        // compute expiry
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES);

        // remove existing token if any
        tokenRepository.deleteByUser(user);

        PasswordResetToken token = PasswordResetToken.builder()
                .token(otp)
                .expiryDate(expiry)
                .user(user)
                .build();

        tokenRepository.save(token);

        String subject = "[QuickSwap] Mã OTP lấy lại mật khẩu";
        String text = "Mã OTP của bạn là: " + otp + "\nMã này có hiệu lực trong " + OTP_EXPIRY_MINUTES + " phút.";
        emailService.sendSimpleMessage(user.getEmail(), subject, text);
    }

    public void verifyAndReset(String email, String otp, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        PasswordResetToken token = tokenRepository.findByUserAndToken(user, otp)
                .orElseThrow(() -> new RuntimeException("OTP không hợp lệ"));

        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            tokenRepository.delete(token);
            throw new RuntimeException("OTP đã hết hạn");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        tokenRepository.delete(token);
    }

    public boolean checkOtpValid(String email, String otp) {
        User user = userRepository.findByEmail(email)
                .orElse(null);
        if (user == null)
            return false;
        PasswordResetToken token = tokenRepository.findByUserAndToken(user, otp)
                .orElse(null);
        if (token == null)
            return false;
        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            tokenRepository.delete(token);
            return false;
        }
        return true;
    }
}
