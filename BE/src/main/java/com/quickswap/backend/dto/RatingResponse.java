package com.quickswap.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class RatingResponse {
    private Long id;
    private Long raterId;
    private Long ratedId;
    private int score;
    private String comment;
    private LocalDateTime createdAt;
}
