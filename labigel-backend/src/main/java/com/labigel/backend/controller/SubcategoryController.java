package com.labigel.backend.controller;

import com.labigel.backend.dto.request.SubcategoryRequest;
import com.labigel.backend.dto.response.ApiResponse;
import com.labigel.backend.dto.response.SubcategoryResponse;
import com.labigel.backend.service.SubcategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SubcategoryController {

    private final SubcategoryService subcategoryService;

    // Public Endpoints
    @GetMapping("/public/subcategories/{slug}")
    public ApiResponse<SubcategoryResponse> getPublicSubcategoryBySlug(@PathVariable String slug) {
        return ApiResponse.success(subcategoryService.getSubcategoryBySlug(slug), "Alt kategori detayı getirildi");
    }

    // Admin Endpoints
    @PostMapping("/admin/subcategories")
    public ApiResponse<SubcategoryResponse> createSubcategory(@Valid @RequestBody SubcategoryRequest request) {
        return ApiResponse.success(subcategoryService.createSubcategory(request), "Alt kategori oluşturuldu");
    }

    @PutMapping("/admin/subcategories/{id}")
    public ApiResponse<SubcategoryResponse> updateSubcategory(@PathVariable Long id, @Valid @RequestBody SubcategoryRequest request) {
        return ApiResponse.success(subcategoryService.updateSubcategory(id, request), "Alt kategori güncellendi");
    }

    @DeleteMapping("/admin/subcategories/{id}")
    public ApiResponse<Void> deleteSubcategory(@PathVariable Long id) {
        subcategoryService.deleteSubcategory(id);
        return ApiResponse.success(null, "Alt kategori silindi");
    }

    @PatchMapping("/admin/subcategories/{id}/toggle")
    public ApiResponse<SubcategoryResponse> toggleActive(@PathVariable Long id) {
        return ApiResponse.success(subcategoryService.toggleActive(id), "Alt kategori durumu güncellendi");
    }
}
