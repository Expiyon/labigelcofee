package com.labigel.backend.service;

import com.labigel.backend.dto.response.DashboardResponse;
import com.labigel.backend.dto.response.ProductResponse;
import com.labigel.backend.entity.Product;
import com.labigel.backend.repository.CategoryRepository;
import com.labigel.backend.repository.ProductRepository;
import com.labigel.backend.repository.SubcategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SubcategoryRepository subcategoryRepository;

    @Transactional(readOnly = true)
    public DashboardResponse getStats() {
        long totalProducts = productRepository.count();
        long activeProducts = productRepository.countByIsActiveTrue();
        long totalCategories = categoryRepository.count();
        long totalSubcategories = subcategoryRepository.count();

        var recentProducts = productRepository.findAll(
                PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt"))
        ).getContent().stream()
                .map(p -> ProductResponse.builder()
                        .id(p.getId())
                        .name(p.getName())
                        .price(p.getPrice())
                        .imageUrl(p.getImageUrl())
                        .isActive(p.isActive())
                        .categoryName(resolveCategoryName(p))
                        .build())
                .collect(Collectors.toList());

        return DashboardResponse.builder()
                .totalProducts(totalProducts)
                .activeProducts(activeProducts)
                .totalCategories(totalCategories)
                .totalSubcategories(totalSubcategories)
                .recentProducts(recentProducts)
                .build();
    }

    private String resolveCategoryName(Product product) {
        if (product.getCategory() != null) {
            return product.getCategory().getName();
        }
        if (product.getSubcategory() != null && product.getSubcategory().getCategory() != null) {
            return product.getSubcategory().getCategory().getName();
        }
        return null;
    }
}
