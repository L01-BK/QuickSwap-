package com.quickswap.backend.repository;

import com.quickswap.backend.entity.Rating;
import com.quickswap.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByRatedOrderByCreatedAtDesc(User rated);

    @Query("SELECT AVG(r.score) FROM Rating r WHERE r.rated = :rated")
    Double averageScoreByRated(User rated);

    long countByRated(User rated);
}
