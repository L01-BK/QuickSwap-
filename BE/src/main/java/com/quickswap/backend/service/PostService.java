package com.quickswap.backend.service;

import com.quickswap.backend.dto.PostRequest;
import com.quickswap.backend.dto.PostResponse;
import com.quickswap.backend.entity.Category;
import com.quickswap.backend.entity.Post;
import com.quickswap.backend.entity.PostStatus;
import com.quickswap.backend.entity.User;
import com.quickswap.backend.repository.PostRepository;
import com.quickswap.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import com.quickswap.backend.dto.UserResponse;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public Post createPost(PostRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow();
        Post post = Post.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .price(request.getPrice())
                .category(request.getCategory())
                .conditionPercent(request.getConditionPercent())
                .subjectCode(request.getSubjectCode())
                .faculty(request.getFaculty())
                .isbnOrAuthor(request.getIsbnOrAuthor())
                .imageUrls(request.getImageUrls())
                .tags(request.getTags())
                .status(PostStatus.HIEU_LUC)
                .user(user)
                .build();

        return postRepository.save(post);
    }

    public Page<PostResponse> getPosts(int page, int limit) {
        Pageable pageable = PageRequest.of(page, limit);
        List<Post> all = postRepository.findAllByOrderByCreatedAtDesc();
        int start = Math.min(page * limit, all.size());
        int end = Math.min(start + limit, all.size());
        List<Post> sub = all.subList(start, end);
        List<PostResponse> mapped = sub.stream().map(this::toPostResponse).collect(Collectors.toList());
        return new PageImpl<>(mapped, pageable, all.size());
    }

    public PostResponse getPostById(Long id) {
        Post p = postRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Post not found"));
        return toPostResponse(p);
    }

    public PostResponse updatePost(Long id, PostRequest request, String userEmail) {
        Post post = postRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Post not found"));
        if (!post.getUser().getEmail().equals(userEmail))
            throw new SecurityException("Not owner");

        if (request.getTitle() != null)
            post.setTitle(request.getTitle());
        if (request.getContent() != null)
            post.setContent(request.getContent());
        if (request.getPrice() != null)
            post.setPrice(request.getPrice());
        if (request.getCategory() != null)
            post.setCategory(request.getCategory());
        if (request.getConditionPercent() != null)
            post.setConditionPercent(request.getConditionPercent());
        if (request.getSubjectCode() != null)
            post.setSubjectCode(request.getSubjectCode());
        if (request.getFaculty() != null)
            post.setFaculty(request.getFaculty());
        if (request.getIsbnOrAuthor() != null)
            post.setIsbnOrAuthor(request.getIsbnOrAuthor());
        if (request.getImageUrls() != null)
            post.setImageUrls(request.getImageUrls());
        if (request.getTags() != null)
            post.setTags(request.getTags());

        return toPostResponse(postRepository.save(post));
    }

    public void deletePost(Long id, String userEmail) {
        Post post = postRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Post not found"));
        if (!post.getUser().getEmail().equals(userEmail))
            throw new SecurityException("Not owner");
        postRepository.delete(post);
    }

    public List<PostResponse> getPostsByUserId(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new NoSuchElementException("User not found"));
        List<Post> posts = postRepository.findAllByOrderByCreatedAtDesc().stream()
                .filter(p -> p.getUser().getId().equals(userId))
                .collect(Collectors.toList());
        return posts.stream().map(this::toPostResponse).collect(Collectors.toList());
    }

    public List<PostResponse> searchPosts(String keyword) {
        if (keyword == null || keyword.isBlank())
            return Collections.emptyList();
        List<Post> posts = postRepository.searchPosts(keyword);
        return posts.stream().map(this::toPostResponse).collect(Collectors.toList());
    }

    public List<PostResponse> filterPosts(Category category, Double priceMin, Double priceMax, String faculty) {
        List<Post> posts = postRepository.findAllByOrderByCreatedAtDesc();
        return posts.stream()
                .filter(p -> category == null || p.getCategory() == category)
                .filter(p -> faculty == null || p.getFaculty() == null || p.getFaculty().equalsIgnoreCase(faculty))
                .filter(p -> priceMin == null || p.getPrice() == null || p.getPrice() >= priceMin)
                .filter(p -> priceMax == null || p.getPrice() == null || p.getPrice() <= priceMax)
                .map(this::toPostResponse)
                .collect(Collectors.toList());
    }

    private PostResponse toPostResponse(Post p) {
        String time = formatRelative(p.getCreatedAt());
        Map<String, String> info = new LinkedHashMap<>();
        info.put("Danh mục", p.getCategory() == null ? "" : p.getCategory().name());
        if (p.getConditionPercent() != null)
            info.put("Tình trạng", p.getConditionPercent());
        if (p.getSubjectCode() != null)
            info.put("Môn học", p.getSubjectCode());
        if (p.getIsbnOrAuthor() != null && !p.getIsbnOrAuthor().isEmpty()) {
            info.put("Tác giả", p.getIsbnOrAuthor());
        }

        if (p.getFaculty() != null && !p.getFaculty().isEmpty()) {
            info.put("Khoa", p.getFaculty());
        }
        return PostResponse.builder()
                .id(p.getId())
                .title(p.getTitle())
                .user(UserResponse.builder()
                        .id(p.getUser().getId())
                        .name(p.getUser().getName())
                        .email(p.getUser().getEmail())
                        .role(p.getUser().getRole())
                        .username(p.getUser().getUsername())
                        .handle(p.getUser().getHandle())
                        .phone(p.getUser().getPhone())
                        .avatarUrl(p.getUser().getAvatarUrl())
                        .university(p.getUser().getUniversity())
                        .address(p.getUser().getAddress())
                        .rating(p.getUser().getRatingAverage())
                        .build())
                .time(time)
                .content(p.getContent())
                .tags(p.getTags())
                .imageUrls(p.getImageUrls())
                .status(p.getStatus())
                .price(p.getPrice())
                .info(info)
                .build();
    }

    private String formatRelative(LocalDateTime dt) {
        if (dt == null)
            return "";
        Duration d = Duration.between(dt, LocalDateTime.now());
        long days = d.toDays();
        if (days > 0)
            return days + " ngày trước";
        long hours = d.toHours();
        if (hours > 0)
            return hours + " giờ trước";
        long minutes = d.toMinutes();
        if (minutes > 0)
            return minutes + " phút trước";
        return "vừa xong";
    }
}
