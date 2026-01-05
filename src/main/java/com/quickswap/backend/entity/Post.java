package com.quickswap.backend.entity;

import com.quickswap.backend.entity.Category;
import com.quickswap.backend.entity.PostStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- Thông tin cơ bản (Hình 2: Form đăng) ---
    @Column(nullable = false)
    private String title; // Ví dụ: "Sách giáo trình triết học"

    @Column(columnDefinition = "TEXT")
    private String content; // Mô tả chi tiết

    private Double price; // Nếu để 0 hoặc null thì là "Miễn phí" hoặc "Trao đổi"

    // --- Phân loại & Thuộc tính (Hình 2: Thông tin thêm) ---
    @Enumerated(EnumType.STRING)
    private Category category; // Sách, Dụng cụ...

    private String conditionPercent; // Ví dụ: "95%", "Như mới"

    private String subjectCode; // Môn học (VD: Giải tích 1, Triết học)

    private String faculty; // Khoa (VD: Khoa học máy tính)

    private String isbnOrAuthor; // ISBN/Tác giả (Dành cho sách)

    // --- Hình ảnh (Lưu danh sách URL) ---
    @ElementCollection
    @CollectionTable(name = "post_images", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "image_url")
    private List<String> imageUrls; // List ảnh upload lên (Cloudinary/Firebase)

    // --- Tags (Hình 3: JSON ["Trao đổi", "Miễn phí"]) ---
    @ElementCollection
    @CollectionTable(name = "post_tags", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "tag")
    private List<String> tags;

    // --- Quan hệ & Meta data ---
    @Enumerated(EnumType.STRING)
    private PostStatus status; // Mặc định là HIEU_LUC

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Người đăng (Link tới bảng User hôm qua mình làm)

    @CreationTimestamp
    private LocalDateTime createdAt; // Thời gian đăng (tự động)

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}