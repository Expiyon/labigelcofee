package com.labigel.backend.controller;

import com.labigel.backend.dto.request.ProductImageRequest;
import com.labigel.backend.dto.request.ProductRequest;
import com.labigel.backend.dto.response.ApiResponse;
import com.labigel.backend.dto.response.ProductResponse;
import com.labigel.backend.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // Public Endpoints
    @GetMapping("/public/products/{slug}")
    public ApiResponse<ProductResponse> getProductBySlug(@PathVariable String slug) {
        return ApiResponse.success(productService.getProductBySlug(slug), "Ürün detayı getirildi");
    }

    @GetMapping("/public/products/featured")
    public ApiResponse<List<ProductResponse>> getFeaturedProducts() {
        return ApiResponse.success(productService.getFeaturedProducts(), "Öne çıkan ürünler getirildi");
    }

    @GetMapping("/public/search")
    public ApiResponse<List<ProductResponse>> searchProducts(@RequestParam String q) {
        return ApiResponse.success(productService.searchProducts(q), "Arama sonuçları getirildi");
    }

    // Admin Endpoints — full management is ADMIN-only.
    @GetMapping("/admin/products")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    public ApiResponse<Page<ProductResponse>> getAllProducts(Pageable pageable) {
        return ApiResponse.success(productService.getAllProducts(pageable), "Tüm ürünler getirildi");
    }

    @PostMapping("/admin/products")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request) {
        return ApiResponse.success(productService.createProduct(request), "Ürün oluşturuldu");
    }

    @PutMapping("/admin/products/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<ProductResponse> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        return ApiResponse.success(productService.updateProduct(id, request), "Ürün güncellendi");
    }

    // EDITOR role is restricted to just swapping a product's image.
    @PatchMapping("/admin/products/{id}/image")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    public ApiResponse<ProductResponse> updateProductImage(@PathVariable Long id, @Valid @RequestBody ProductImageRequest request) {
        return ApiResponse.success(productService.updateProductImage(id, request.getImageUrl()), "Ürün görseli güncellendi");
    }

    @DeleteMapping("/admin/products/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ApiResponse.success(null, "Ürün silindi");
    }

    @PatchMapping("/admin/products/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<ProductResponse> toggleActive(@PathVariable Long id) {
        return ApiResponse.success(productService.toggleActive(id), "Ürün durumu güncellendi");
    }
}
