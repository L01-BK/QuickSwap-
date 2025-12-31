package com.quickswap.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ResetPasswordRequest {

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;

    @NotBlank(message = "Mật khẩu cũ không được để trống") 
    private String oldPassword;

    @NotBlank(message = "Mật khẩu mới không được để trống")
    @Size(min = 8, message = "Mật khẩu mới tối thiểu 8 ký tự")
    private String newPassword;

    public String getEmail() { 
        return email; 
    }
    public void setEmail(String email) { 
        this.email = email; 
    }

    public String getOldPassword() { 
        return oldPassword; 
    } 
    public void setOldPassword(String oldPassword) { 
        this.oldPassword = oldPassword; 
    }
    public String getNewPassword() { 
        return newPassword; 
    }
    public void setNewPassword(String newPassword) { 
        this.newPassword = newPassword; 
    }
}