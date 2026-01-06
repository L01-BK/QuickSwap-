package com.quickswap.backend.dto;

import com.quickswap.backend.entity.Category;
import lombok.Data;
import java.util.List;

@Data
public class PostRequest {
    private String title;
    private String content;
    private Double price;
    private Category category; // Enum: TAI_LIEU, DUNG_CU...
    private String conditionPercent; // "95%"
    private String subjectCode; // "Giải tích 1"
    private String faculty;
    private String isbnOrAuthor;
    private List<String> imageUrls; // URL ảnh đã upload
    private List<String> tags; // ["Trao đổi", "Miễn phí"]
}