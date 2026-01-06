package com.quickswap.backend.service;

import com.quickswap.backend.dto.RatingRequest;
import com.quickswap.backend.dto.RatingResponse;
import com.quickswap.backend.entity.Rating;
import com.quickswap.backend.entity.User;
import com.quickswap.backend.repository.RatingRepository;
import com.quickswap.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final UserRepository userRepository;

    @Transactional
    public RatingResponse rateUser(Long ratedUserId, String raterEmail, RatingRequest request) {
        User rater = userRepository.findByEmail(raterEmail).orElseThrow(() -> new RuntimeException("Rater not found"));
        User rated = userRepository.findById(ratedUserId)
                .orElseThrow(() -> new RuntimeException("Rated user not found"));

        if (rater.getId().equals(rated.getId())) {
            throw new RuntimeException("Cannot rate yourself");
        }

        Rating rating = Rating.builder()
                .rater(rater)
                .rated(rated)
                .score(request.getScore())
                .comment(request.getComment())
                .build();

        ratingRepository.save(rating);

        // update aggregated rating on User entity
        Double avg = ratingRepository.averageScoreByRated(rated);
        long count = ratingRepository.countByRated(rated);
        rated.setRatingAverage(avg == null ? null : Math.round(avg * 10.0) / 10.0);
        rated.setRatingCount(count);
        userRepository.save(rated);

        return new RatingResponse(rating.getId(), rater.getId(), rated.getId(), rating.getScore(), rating.getComment(),
                rating.getCreatedAt());
    }

    public List<RatingResponse> listRatings(Long userId) {
        User rated = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return ratingRepository.findByRatedOrderByCreatedAtDesc(rated).stream()
                .map(r -> new RatingResponse(r.getId(), r.getRater().getId(), r.getRated().getId(), r.getScore(),
                        r.getComment(), r.getCreatedAt()))
                .collect(Collectors.toList());
    }

    public com.quickswap.backend.dto.RatingSummary getSummary(Long userId) {
        User rated = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Double avg = ratingRepository.averageScoreByRated(rated);
        long count = ratingRepository.countByRated(rated);
        return new com.quickswap.backend.dto.RatingSummary(count, avg == null ? 0.0 : Math.round(avg * 10.0) / 10.0);
    }
}
