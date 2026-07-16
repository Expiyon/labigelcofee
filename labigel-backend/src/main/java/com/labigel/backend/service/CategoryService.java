package com.labigel.backend.service;

import com.labigel.backend.dto.request.CategoryRequest;
import com.labigel.backend.dto.response.CategoryResponse;
import com.labigel.backend.dto.response.ProductResponse;
import com.labigel.backend.dto.response.SubcategoryResponse;
import com.labigel.backend.entity.Category;
import com.labigel.backend.exception.DuplicateResourceException;
import com.labigel.backend.exception.ResourceNotFoundException;
import com.labigel.backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllActiveCategories() {
        return categoryRepository.findAllByIsActiveTrueOrderByDisplayOrderAsc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoryResponse getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Kategori bulunamadı: " + slug));
        return mapToResponse(category);
    }

    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        String slug = generateSlug(request.getName());
        
        if (categoryRepository.findBySlug(slug).isPresent()) {
            throw new DuplicateResourceException("Bu isimde bir kategori zaten mevcut");
        }

        Category category = Category.builder()
                .name(request.getName())
                .slug(slug)
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();

        Category savedCategory = categoryRepository.save(category);
        return mapToResponse(savedCategory);
    }

    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kategori bulunamadı: " + id));

        String newSlug = generateSlug(request.getName());
        if (!category.getSlug().equals(newSlug) && categoryRepository.findBySlug(newSlug).isPresent()) {
            throw new DuplicateResourceException("Bu isimde bir kategori zaten mevcut");
        }

        category.setName(request.getName());
        category.setSlug(newSlug);
        category.setDescription(request.getDescription());
        
        if (request.getImageUrl() != null) {
            category.setImageUrl(request.getImageUrl());
        }
        
        if (request.getDisplayOrder() != null) {
            category.setDisplayOrder(request.getDisplayOrder());
        }
        
        if (request.getIsActive() != null) {
            category.setActive(request.getIsActive());
        }

        Category updatedCategory = categoryRepository.save(category);
        return mapToResponse(updatedCategory);
    }

    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Kategori bulunamadı: " + id);
        }
        categoryRepository.deleteById(id);
    }

    @Transactional
    public CategoryResponse toggleActive(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kategori bulunamadı: " + id));
        category.setActive(!category.isActive());
        return mapToResponse(categoryRepository.save(category));
    }

    private ProductResponse mapProductToResponse(com.labigel.backend.entity.Product p) {
        return ProductResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .slug(p.getSlug())
                .description(p.getDescription())
                .ingredients(p.getIngredients())
                .price(p.getPrice())
                .imageUrl(p.getImageUrl())
                .calories(p.getCalories())
                .weightGrams(p.getWeightGrams())
                .displayOrder(p.getDisplayOrder())
                .isActive(p.isActive())
                .isFeatured(p.isFeatured())
                .subcategoryName(p.getSubcategory() != null ? p.getSubcategory().getName() : null)
                .categoryName(p.getCategory() != null
                        ? p.getCategory().getName()
                        : (p.getSubcategory() != null && p.getSubcategory().getCategory() != null
                                ? p.getSubcategory().getCategory().getName() : null))
                .build();
    }

    private CategoryResponse mapToResponse(Category category) {
        List<SubcategoryResponse> subcategories = null;
        if (category.getSubcategories() != null) {
            subcategories = category.getSubcategories().stream()
                    .map(sub -> {
                        // Map active products under each subcategory
                        List<ProductResponse> products = sub.getProducts() != null
                                ? sub.getProducts().stream()
                                        .filter(p -> p.isActive())
                                        .sorted((a, b) -> Integer.compare(a.getDisplayOrder(), b.getDisplayOrder()))
                                        .map(this::mapProductToResponse)
                                        .collect(Collectors.toList())
                                : Collections.emptyList();

                        return SubcategoryResponse.builder()
                                .id(sub.getId())
                                .name(sub.getName())
                                .slug(sub.getSlug())
                                .description(sub.getDescription())
                                .imageUrl(sub.getImageUrl())
                                .displayOrder(sub.getDisplayOrder())
                                .isActive(sub.isActive())
                                .categoryName(category.getName())
                                .productCount(products.size())
                                .products(products)
                                .build();
                    })
                    .collect(Collectors.toList());
        }

        // Products directly attached to the category (no subcategory)
        List<ProductResponse> directProducts = category.getProducts() != null
                ? category.getProducts().stream()
                        .filter(p -> p.getSubcategory() == null && p.isActive())
                        .sorted((a, b) -> Integer.compare(a.getDisplayOrder(), b.getDisplayOrder()))
                        .map(this::mapProductToResponse)
                        .collect(Collectors.toList())
                : Collections.emptyList();

        int totalProductCount = (subcategories != null
                ? subcategories.stream().mapToInt(s -> s.getProductCount()).sum() : 0)
                + directProducts.size();

        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .description(category.getDescription())
                .imageUrl(category.getImageUrl())
                .displayOrder(category.getDisplayOrder())
                .isActive(category.isActive())
                .subcategoryCount(subcategories != null ? subcategories.size() : 0)
                .productCount(totalProductCount)
                .subcategories(subcategories)
                .products(directProducts)
                .build();
    }

    private String generateSlug(String input) {
        String slug = input.toLowerCase();
        slug = slug.replace("ş", "s")
                .replace("ç", "c")
                .replace("ğ", "g")
                .replace("ü", "u")
                .replace("ö", "o")
                .replace("ı", "i");
        
        slug = Normalizer.normalize(slug, Normalizer.Form.NFD);
        slug = slug.replaceAll("[\\p{InCombiningDiacriticalMarks}]", "");
        slug = slug.replaceAll("[^a-z0-9\\s-]", "");
        slug = slug.trim().replaceAll("\\s+", "-");
        
        return slug;
    }
}
