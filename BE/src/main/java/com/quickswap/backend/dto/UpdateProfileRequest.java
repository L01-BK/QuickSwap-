package com.quickswap.backend.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String name;
    private String username;
    private String handle;
    private String phone;
    private String university;
    private String address;
    private String avatarUrl;
}