package com.quickswap.backend.dto;

public class LoginResponse {
    private String email;
    private String fullName;
    

    public LoginResponse() {} 

    public LoginResponse(String email, String fullName) {
        this.email = email;
        this.fullName = fullName;
    }

    
    public String getEmail() { 
        return email; 
    }
    public String getFullName() { 
        return fullName; 
    }
    public void setEmail(String email) { 
        this.email = email; 
    }
    public void setFullName(String fullName) { 
        this.fullName = fullName; 
    }
    
}