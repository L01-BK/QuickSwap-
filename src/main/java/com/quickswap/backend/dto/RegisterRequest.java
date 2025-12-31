package com.quickswap.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @NotBlank(message = "Tên không được để trống")
    private String fullName;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 8, message = "Mật khẩu tối thiểu 8 ký tự")
    private String password;

    @NotBlank(message = "Mật khẩu xác nhận không được để trống")
    private String confirmPassword;

    // Getters
    public String getFullName() { 
        return fullName; 
    }
    public String getEmail() { 
        return email; 
    }
    public String getPassword() { 
        return password; 
    }
    public String getConfirmPassword() { 
        return confirmPassword; 
    }

    // Setters
    public void setFullName(String fullName) { 
        this.fullName = fullName; 
    }
    public void setEmail(String email) { 
        this.email = email; 
    }
    public void setPassword(String password) { 
        this.password = password; 
    }
    public void setConfirmPassword(String confirmPassword) { 
        this.confirmPassword = confirmPassword; 
    }
}