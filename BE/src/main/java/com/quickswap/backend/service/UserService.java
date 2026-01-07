package com.quickswap.backend.service;

import com.quickswap.backend.dto.*;
import com.quickswap.backend.entity.Role;
import com.quickswap.backend.entity.User;
import com.quickswap.backend.repository.UserRepository;
import com.quickswap.backend.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;

    public com.quickswap.backend.dto.AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã tồn tại!");
        }

        var user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER) // Mặc định là User thường
                .ratingAverage(5.0) // Điểm khởi đầu
                .ratingCount(1L)
                .build();

        userRepository.save(user);
        String token = jwtUtils.generateToken(user);
        return new com.quickswap.backend.dto.AuthResponse(token, toUserResponse(user));
    }

    public com.quickswap.backend.dto.AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        String token = jwtUtils.generateToken(user);
        return new com.quickswap.backend.dto.AuthResponse(token, toUserResponse(user));
    }

    public com.quickswap.backend.dto.UserResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getName() != null)
            user.setName(request.getName());
        if (request.getUsername() != null)
            user.setUsername(request.getUsername());
        if (request.getHandle() != null)
            user.setHandle(request.getHandle());
        if (request.getPhone() != null)
            user.setPhone(request.getPhone());
        if (request.getUniversity() != null)
            user.setUniversity(request.getUniversity());
        if (request.getAddress() != null)
            user.setAddress(request.getAddress());
        if (request.getAvatarUrl() != null)
            user.setAvatarUrl(request.getAvatarUrl());

        User saved = userRepository.save(user);
        return toUserResponse(saved);
    }

    public void saveDeviceToken(String email, String deviceToken) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        user.setDeviceToken(deviceToken);
        userRepository.save(user);
    }

    public com.quickswap.backend.dto.UserResponse getMyProfile(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return toUserResponse(user);
    }

    public com.quickswap.backend.dto.PublicUserResponse getPublicProfile(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return com.quickswap.backend.dto.PublicUserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .username(user.getUsername())
                .handle(user.getHandle())
                .avatarUrl(user.getAvatarUrl())
                .university(user.getUniversity())
                .address(user.getAddress())
                .rating(user.getRatingAverage())
                .build();
    }

    private com.quickswap.backend.dto.UserResponse toUserResponse(User user) {
        return com.quickswap.backend.dto.UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .username(user.getUsername())
                .handle(user.getHandle())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .university(user.getUniversity())
                .address(user.getAddress())
                .rating(user.getRatingAverage())
                .build();
    }

    public String getDeviceTokenByUserId(Long userId) {
        return userRepository.findById(userId).map(User::getDeviceToken).orElse(null);
    }
}