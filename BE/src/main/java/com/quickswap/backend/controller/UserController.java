package com.quickswap.backend.controller;

import com.quickswap.backend.dto.UpdateProfileRequest;
import com.quickswap.backend.entity.User;
import com.quickswap.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final com.quickswap.backend.service.SavedPostService savedPostService;

    // Lấy thông tin người dùng đang đăng nhập
    @GetMapping("/me")
    public ResponseEntity<com.quickswap.backend.dto.UserResponse> getMyProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return ResponseEntity.ok(userService.getMyProfile(email));
    }

    @GetMapping("/me/saved")
    public ResponseEntity<java.util.List<com.quickswap.backend.dto.PostResponse>> getMySavedPosts() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return ResponseEntity.ok(savedPostService.getSavedPosts(email));
    }

    // Cập nhật thông tin
    @PutMapping("/me")
    public ResponseEntity<com.quickswap.backend.dto.UserResponse> updateProfile(
            @RequestBody UpdateProfileRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return ResponseEntity.ok(userService.updateProfile(email, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<com.quickswap.backend.dto.PublicUserResponse> getPublicProfile(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getPublicProfile(id));
    }
}