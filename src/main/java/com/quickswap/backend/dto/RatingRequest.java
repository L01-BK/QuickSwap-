package com.quickswap.backend.dto;

import lombok.Data;

@Data
public class RatingRequest {
    private int score; // 1-5
    private String comment;
}
