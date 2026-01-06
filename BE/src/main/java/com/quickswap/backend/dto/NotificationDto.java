package com.quickswap.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class NotificationDto {
    private Long id;
    private Long recipientId;
    private String title;
    private String body;
    private String token;
    private boolean read;
    private LocalDateTime sentAt;
}
