package com.quickswap.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ResetPasswordOtpRequest {

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;

    @NotBlank(message = "Mã OTP không được để trống")
    private String otp;

    @NotBlank(message = "Mật khẩu mới không được để trống")
    @Size(min = 8, message = "Mật khẩu mới tối thiểu 8 ký tự")
    private String newPassword;

    public String getEmail() { 
        return email; 
    }
    public void setEmail(String email) { 
        this.email = email; 
    }
    public String getOtp() { 
        return otp; 
    }
    public void setOtp(String otp) { 
        this.otp = otp; 
    }
    public String getNewPassword() { 
        return newPassword; 
    }
    public void setNewPassword(String newPassword) { 
        this.newPassword = newPassword; 
    }
}