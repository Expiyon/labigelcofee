package com.labigel.backend.controller;

import com.labigel.backend.dto.request.ProductRequest;
import com.labigel.backend.dto.response.ApiResponse;
import com.labigel.backend.dto.response.ProductResponse;
import com.labigel.backend.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    // Admin Endpoints
    @GetMapping("/admin/products")
    public ApiResponse<Page<ProductResponse>> getAllProducts(Pageable pageable) {
        return ApiResponse.success(productService.getAllProducts(pageable), "Tüm ürünler getirildi");
    }

    @PostMapping("/admin/products")
    public ApiResponse<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request) {
        return ApiResponse.success(productService.createProduct(request), "Ürün oluşturuldu");
    }

    @PutMapping("/admin/products/{id}")
    public ApiResponse<ProductResponse> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        return ApiResponse.success(productService.updateProduct(id, request), "Ürün güncellendi");
    }

    @DeleteMapping("/admin/products/{id}")
    public ApiResponse<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ApiResponse.success(null, "Ürün silindi");
    }

    @PatchMapping("/admin/products/{id}/toggle")
    public ApiResponse<ProductResponse> toggleActive(@PathVariable Long id) {
        return ApiResponse.success(productService.toggleActive(id), "Ürün durumu güncellendi");
    }
}
