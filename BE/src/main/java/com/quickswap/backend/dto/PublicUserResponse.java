package com.quickswap.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PublicUserResponse {
    private Long id;
    private String name;
    private String username;
    private String handle;
    private String avatarUrl;
    private String university;
    private String address;
    private Double rating;
}
