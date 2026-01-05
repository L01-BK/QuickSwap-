package com.quickswap.backend.controller;

import com.quickswap.backend.dto.PostRequest;
import com.quickswap.backend.dto.PostResponse;
import com.quickswap.backend.entity.Post;
import com.quickswap.backend.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final com.quickswap.backend.service.SavedPostService savedPostService;

    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody PostRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        Post created = postService.createPost(request, email);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<Page<PostResponse>> listPosts(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(postService.getPosts(page, limit));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostResponse> updatePost(@PathVariable Long id, @RequestBody PostRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return ResponseEntity.ok(postService.updatePost(id, request, email));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        postService.deletePost(id, email);
        return ResponseEntity.ok(Map.of("message", "Success"));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PostResponse>> getUserPosts(@PathVariable Long userId) {
        return ResponseEntity.ok(postService.getPostsByUserId(userId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<PostResponse>> search(@RequestParam String keyword) {
        return ResponseEntity.ok(postService.searchPosts(keyword));
    }

    @PostMapping("/{id}/save")
    public ResponseEntity<?> savePost(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        savedPostService.savePost(id, email);
        return ResponseEntity.ok(Map.of("message", "saved"));
    }

    @DeleteMapping("/{id}/save")
    public ResponseEntity<?> unsavePost(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        savedPostService.unsavePost(id, email);
        return ResponseEntity.ok(Map.of("message", "unsaved"));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<PostResponse>> filter(
            @RequestParam(required = false) com.quickswap.backend.entity.Category category,
            @RequestParam(required = false) Double priceMin,
            @RequestParam(required = false) Double priceMax,
            @RequestParam(required = false) String faculty) {
        return ResponseEntity.ok(postService.filterPosts(category, priceMin, priceMax, faculty));
    }
}
