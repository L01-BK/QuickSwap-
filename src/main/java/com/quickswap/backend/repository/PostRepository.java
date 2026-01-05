package com.quickswap.backend.repository;
import com.quickswap.backend.entity.Post;
import com.quickswap.backend.entity.Category;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
public interface PostRepository extends JpaRepository<Post, Long> {
    // Tìm bài đăng mới nhất
    List<Post> findAllByOrderByCreatedAtDesc();

    // Tìm kiếm theo từ khóa (Title hoặc Content hoặc Môn học)
    @Query("SELECT p FROM Post p WHERE " +
            "LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "AND p.status = 'HIEU_LUC'")
    List<Post> searchPosts(String keyword);

    // Lọc theo danh mục
    List<Post> findByCategory(Category category);
    
}
