package com.quickswap.backend.dto;

import com.quickswap.backend.entity.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private String username;
    private String handle;
    private String phone;
    private String avatarUrl;
    private String university;
    private String address;
    private Double rating;
}
