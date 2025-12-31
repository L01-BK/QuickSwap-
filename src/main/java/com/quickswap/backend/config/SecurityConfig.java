package com.quickswap.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
            .requestMatchers(
                "/swagger-ui/**",     
                "/v3/api-docs/**",    
                "/api/auth/**"        
            ).permitAll()
            .anyRequest().authenticated()
        )
        .logout(logout -> logout
            .logoutUrl("/api/auth/logout") 
            .logoutSuccessHandler((request, response, authentication) -> {
                response.setStatus(200); 
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("Logout success");
            })
            .invalidateHttpSession(true) 
            .deleteCookies("JSESSIONID") 
        );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
