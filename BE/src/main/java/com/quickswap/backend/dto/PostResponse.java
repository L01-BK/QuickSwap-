package com.quickswap.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import com.quickswap.backend.entity.Post;
import com.quickswap.backend.entity.PostStatus;

@Data
@Builder
public class PostResponse {
    private Long id;
    private UserResponse user; // Tái sử dụng DTO User hôm qua (chỉ hiện tên, avatar)
    private String title;
    private String time; // String format "14h trước" (Sẽ xử lý ở Service)
    private String content;
    private List<String> tags;
    private List<String> imageUrls;
    private Map<String, String> info; // Trả về dạng Map cho giống JSON hình 3
    private PostStatus status;
    private Double price;
    // Ví dụ: info: {"Danh mục": "Sách", "Tình trạng": "95%"}
}