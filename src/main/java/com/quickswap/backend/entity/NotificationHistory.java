package com.quickswap.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id")
    private User recipient;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String body;

    private String token; // device token used (if any)

    private boolean read;

    @CreationTimestamp
    private LocalDateTime sentAt;
}
