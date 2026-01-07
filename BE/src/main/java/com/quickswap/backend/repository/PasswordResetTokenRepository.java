package com.quickswap.backend.repository;

import com.quickswap.backend.entity.PasswordResetToken;
import com.quickswap.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByUser(User user);

    Optional<PasswordResetToken> findByUserAndToken(User user, String token);

    void deleteByUser(User user);
}
