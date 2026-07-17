package com.labigel.backend.controller;

import com.labigel.backend.dto.request.CategoryRequest;
import com.labigel.backend.dto.response.ApiResponse;
import com.labigel.backend.dto.response.CategoryResponse;
import com.labigel.backend.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // Public Endpoints
    @GetMapping("/public/categories")
    public ApiResponse<List<CategoryResponse>> getPublicCategories() {
        return ApiResponse.success(categoryService.getAllActiveCategories(), "Kategoriler getirildi");
    }

    @GetMapping("/public/categories/{slug}")
    public ApiResponse<CategoryResponse> getPublicCategoryBySlug(@PathVariable String slug) {
        return ApiResponse.success(categoryService.getCategoryBySlug(slug), "Kategori detayı getirildi");
    }

    // Admin Endpoints — category management is ADMIN-only.
    @GetMapping("/admin/categories")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<CategoryResponse>> getAllCategories() {
        return ApiResponse.success(categoryService.getAllCategories(), "Tüm kategoriler getirildi");
    }

    @PostMapping("/admin/categories")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<CategoryResponse> createCategory(@Valid @RequestBody CategoryRequest request) {
        return ApiResponse.success(categoryService.createCategory(request), "Kategori oluşturuldu");
    }

    @PutMapping("/admin/categories/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<CategoryResponse> updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryRequest request) {
        return ApiResponse.success(categoryService.updateCategory(id, request), "Kategori güncellendi");
    }

    @DeleteMapping("/admin/categories/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ApiResponse.success(null, "Kategori silindi");
    }

    @PatchMapping("/admin/categories/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<CategoryResponse> toggleActive(@PathVariable Long id) {
        return ApiResponse.success(categoryService.toggleActive(id), "Kategori durumu güncellendi");
    }
}
