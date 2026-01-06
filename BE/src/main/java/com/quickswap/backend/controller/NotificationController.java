package com.quickswap.backend.controller;

import com.quickswap.backend.service.FCMService;
import com.quickswap.backend.service.NotificationService;
import com.quickswap.backend.service.UserService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    @PostMapping("/send-to-user/{id}")
    public ResponseEntity<?> sendToUser(@PathVariable Long id, @RequestBody SendRequest req) {
        notificationService.sendToUser(id, req.getTitle(), req.getBody());
        return ResponseEntity.ok(Map.of("sent", true));
    }

    @PostMapping("/send-to-token")
    public ResponseEntity<?> sendToToken(@RequestBody SendRequest req) {
        notificationService.sendToToken(req.getToken(), req.getTitle(), req.getBody());
        return ResponseEntity.ok(Map.of("sent", true));
    }

    @PostMapping("/me/device-token")
    public ResponseEntity<?> saveMyToken(@RequestBody DeviceTokenRequest req) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        userService.saveDeviceToken(email, req.getDeviceToken());
        return ResponseEntity.ok(Map.of("saved", true));
    }

    @GetMapping("/me")
    public ResponseEntity<?> myNotifications() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        var user = userService.getMyProfile(email);
        var list = notificationService.listForUser(user.getId());
        return ResponseEntity.ok(list);
    }

    @PutMapping("/me/{notificationId}/read")
    public ResponseEntity<?> markRead(@PathVariable Long notificationId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        var user = userService.getMyProfile(email);
        var dto = notificationService.markAsRead(notificationId, user.getId());
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/me/read-all")
    public ResponseEntity<?> markAllRead() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        var user = userService.getMyProfile(email);
        notificationService.markAllRead(user.getId());
        return ResponseEntity.ok(Map.of("marked", true));
    }

    @Data
    static class SendRequest {
        private String token;
        private String title;
        private String body;
    }

    @Data
    static class DeviceTokenRequest {
        private String deviceToken;
    }
}
