package com.quickswap.backend.service;

import com.quickswap.backend.dto.PostResponse;
import com.quickswap.backend.entity.Post;
import com.quickswap.backend.entity.SavedPost;
import com.quickswap.backend.entity.User;
import com.quickswap.backend.repository.PostRepository;
import com.quickswap.backend.repository.SavedPostRepository;
import com.quickswap.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SavedPostService {

    private final SavedPostRepository savedPostRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final PostService postService;

    public void savePost(Long postId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NoSuchElementException("User not found"));
        Post post = postRepository.findById(postId).orElseThrow(() -> new NoSuchElementException("Post not found"));
        if (savedPostRepository.existsByUserAndPost(user, post))
            return;
        SavedPost sp = SavedPost.builder().user(user).post(post).build();
        savedPostRepository.save(sp);
    }

    public void unsavePost(Long postId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NoSuchElementException("User not found"));
        Post post = postRepository.findById(postId).orElseThrow(() -> new NoSuchElementException("Post not found"));
        savedPostRepository.findByUserAndPost(user, post).ifPresent(savedPostRepository::delete);
    }

    public List<PostResponse> getSavedPosts(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NoSuchElementException("User not found"));
        List<SavedPost> list = savedPostRepository.findByUserOrderBySavedAtDesc(user);
        return list.stream().map(sp -> postService.getPostById(sp.getPost().getId())).collect(Collectors.toList());
    }
}
