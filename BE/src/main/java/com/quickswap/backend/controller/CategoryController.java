package com.quickswap.backend.controller;

import com.quickswap.backend.entity.Category;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @GetMapping
    public ResponseEntity<List<String>> list() {
        List<String> vals = Arrays.stream(Category.values()).map(Enum::name).toList();
        return ResponseEntity.ok(vals);
    }
}
