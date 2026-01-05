package com.quickswap.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RatingSummary {
    private long count;
    private double average;
}
