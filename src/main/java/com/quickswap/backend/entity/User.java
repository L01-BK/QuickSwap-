package com.quickswap.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails { // Implement UserDetails để tích hợp Spring Security
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // Tên hiển thị (Kevin Nguyễn)

    @Column(unique = true, nullable = false)
    private String email; // kv@hcmut.edu.vn

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role; // ADMIN hoặc USER

    // Các trường bổ sung (Update sau)
    private String username; // Nguyễn Văn Kevin
    private String handle; // @hocITcungnhau
    private String phone;
    private String avatarUrl;
    private String university;
    private String address;
    private Double ratingAverage; // 4.5
    private Long ratingCount;
    private String deviceToken;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        return email;
    } // Dùng email làm tên đăng nhập

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}