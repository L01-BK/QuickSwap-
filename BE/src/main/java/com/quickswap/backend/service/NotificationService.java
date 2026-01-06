package com.quickswap.backend.service;

import com.quickswap.backend.dto.NotificationDto;
import com.quickswap.backend.entity.NotificationHistory;
import com.quickswap.backend.entity.User;
import com.quickswap.backend.repository.NotificationHistoryRepository;
import com.quickswap.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationHistoryRepository historyRepository;
    private final UserRepository userRepository;
    private final FCMService fcmService;

    @Transactional
    public NotificationDto sendToUser(Long userId, String title, String body) {
        User recipient = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        String token = recipient.getDeviceToken();
        if (token != null && !token.isBlank()) {
            fcmService.sendNotification(token, title, body);
        }

        NotificationHistory h = NotificationHistory.builder()
                .recipient(recipient)
                .title(title)
                .body(body)
                .token(token)
                .read(false)
                .build();

        historyRepository.save(h);

        return new NotificationDto(h.getId(), recipient.getId(), h.getTitle(), h.getBody(), h.getToken(), h.isRead(),
                h.getSentAt());
    }

    @Transactional
    public NotificationDto sendToToken(String token, String title, String body) {
        // no recipient available
        if (token != null && !token.isBlank()) {
            fcmService.sendNotification(token, title, body);
        }
        NotificationHistory h = NotificationHistory.builder()
                .recipient(null)
                .title(title)
                .body(body)
                .token(token)
                .read(false)
                .build();
        historyRepository.save(h);
        return new NotificationDto(h.getId(), null, h.getTitle(), h.getBody(), h.getToken(), h.isRead(), h.getSentAt());
    }

    public List<NotificationDto> listForUser(Long userId) {
        User recipient = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return historyRepository.findByRecipientOrderBySentAtDesc(recipient).stream()
                .map(h -> new NotificationDto(h.getId(), recipient.getId(), h.getTitle(), h.getBody(), h.getToken(),
                        h.isRead(), h.getSentAt()))
                .collect(Collectors.toList());
    }

    @Transactional
    public NotificationDto markAsRead(Long notificationId, Long userId) {
        var h = historyRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        if (h.getRecipient() == null || !h.getRecipient().getId().equals(userId)) {
            throw new RuntimeException("Not authorized to modify this notification");
        }
        h.setRead(true);
        historyRepository.save(h);
        return new NotificationDto(h.getId(), userId, h.getTitle(), h.getBody(), h.getToken(), h.isRead(),
                h.getSentAt());
    }

    @Transactional
    public void markAllRead(Long userId) {
        User recipient = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        var list = historyRepository.findByRecipientOrderBySentAtDesc(recipient);
        list.forEach(n -> n.setRead(true));
        historyRepository.saveAll(list);
    }
}
