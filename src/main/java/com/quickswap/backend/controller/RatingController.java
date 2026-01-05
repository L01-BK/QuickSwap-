package com.quickswap.backend.controller;

import com.quickswap.backend.dto.RatingRequest;
import com.quickswap.backend.dto.RatingResponse;
import com.quickswap.backend.dto.RatingSummary;
import com.quickswap.backend.service.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @PostMapping("/{id}/rate")
    public ResponseEntity<RatingResponse> rateUser(@PathVariable("id") Long id, @RequestBody RatingRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String raterEmail = auth.getName();
        return ResponseEntity.ok(ratingService.rateUser(id, raterEmail, request));
    }

    @GetMapping("/{id}/ratings")
    public ResponseEntity<List<RatingResponse>> listRatings(@PathVariable("id") Long id) {
        return ResponseEntity.ok(ratingService.listRatings(id));
    }

    @GetMapping("/{id}/rating-summary")
    public ResponseEntity<RatingSummary> summary(@PathVariable("id") Long id) {
        return ResponseEntity.ok(ratingService.getSummary(id));
    }
}
