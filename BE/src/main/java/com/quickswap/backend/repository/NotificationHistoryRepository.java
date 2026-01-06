package com.quickswap.backend.repository;

import com.quickswap.backend.entity.NotificationHistory;
import com.quickswap.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationHistoryRepository extends JpaRepository<NotificationHistory, Long> {
    List<NotificationHistory> findByRecipientOrderBySentAtDesc(User recipient);
}
