package com.labigel.backend.service;

import com.labigel.backend.dto.request.SubcategoryRequest;
import com.labigel.backend.dto.response.ProductResponse;
import com.labigel.backend.dto.response.SubcategoryResponse;
import com.labigel.backend.entity.Category;
import com.labigel.backend.entity.Subcategory;
import com.labigel.backend.exception.DuplicateResourceException;
import com.labigel.backend.exception.ResourceNotFoundException;
import com.labigel.backend.repository.CategoryRepository;
import com.labigel.backend.repository.SubcategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubcategoryService {

    private final SubcategoryRepository subcategoryRepository;
    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<SubcategoryResponse> getAllSubcategories() {
        return subcategoryRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SubcategoryResponse getSubcategoryBySlug(String slug) {
        Subcategory subcategory = subcategoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Alt kategori bulunamadı: " + slug));
        return mapToResponse(subcategory);
    }

    @Transactional
    public SubcategoryResponse createSubcategory(SubcategoryRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Kategori bulunamadı: " + request.getCategoryId()));

        String slug = generateSlug(request.getName());
        
        if (subcategoryRepository.findBySlug(slug).isPresent()) {
            throw new DuplicateResourceException("Bu isimde bir alt kategori zaten mevcut");
        }

        Subcategory subcategory = Subcategory.builder()
                .name(request.getName())
                .slug(slug)
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .category(category)
                .build();

        Subcategory savedSubcategory = subcategoryRepository.save(subcategory);
        return mapToResponse(savedSubcategory);
    }

    @Transactional
    public SubcategoryResponse updateSubcategory(Long id, SubcategoryRequest request) {
        Subcategory subcategory = subcategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alt kategori bulunamadı: " + id));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Kategori bulunamadı: " + request.getCategoryId()));

        String newSlug = generateSlug(request.getName());
        if (!subcategory.getSlug().equals(newSlug) && subcategoryRepository.findBySlug(newSlug).isPresent()) {
            throw new DuplicateResourceException("Bu isimde bir alt kategori zaten mevcut");
        }

        subcategory.setName(request.getName());
        subcategory.setSlug(newSlug);
        subcategory.setDescription(request.getDescription());
        subcategory.setCategory(category);
        
        if (request.getImageUrl() != null) {
            subcategory.setImageUrl(request.getImageUrl());
        }
        
        if (request.getDisplayOrder() != null) {
            subcategory.setDisplayOrder(request.getDisplayOrder());
        }
        
        if (request.getIsActive() != null) {
            subcategory.setActive(request.getIsActive());
        }

        Subcategory updatedSubcategory = subcategoryRepository.save(subcategory);
        return mapToResponse(updatedSubcategory);
    }

    @Transactional
    public void deleteSubcategory(Long id) {
        if (!subcategoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Alt kategori bulunamadı: " + id);
        }
        subcategoryRepository.deleteById(id);
    }

    @Transactional
    public SubcategoryResponse toggleActive(Long id) {
        Subcategory subcategory = subcategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alt kategori bulunamadı: " + id));
        subcategory.setActive(!subcategory.isActive());
        return mapToResponse(subcategoryRepository.save(subcategory));
    }

    private SubcategoryResponse mapToResponse(Subcategory subcategory) {
        List<ProductResponse> products = null;
        if (subcategory.getProducts() != null) {
            products = subcategory.getProducts().stream()
                    .map(p -> ProductResponse.builder()
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
                            .subcategoryName(subcategory.getName())
                            .categoryName(subcategory.getCategory().getName())
                            .build())
                    .collect(Collectors.toList());
        }

        return SubcategoryResponse.builder()
                .id(subcategory.getId())
                .name(subcategory.getName())
                .slug(subcategory.getSlug())
                .description(subcategory.getDescription())
                .imageUrl(subcategory.getImageUrl())
                .displayOrder(subcategory.getDisplayOrder())
                .isActive(subcategory.isActive())
                .categoryName(subcategory.getCategory().getName())
                .productCount(subcategory.getProducts() != null ? subcategory.getProducts().size() : 0)
                .products(products)
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
