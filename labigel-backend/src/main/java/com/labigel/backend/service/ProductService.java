package com.labigel.backend.service;

import com.labigel.backend.dto.request.ProductRequest;
import com.labigel.backend.dto.response.ProductResponse;
import com.labigel.backend.entity.Category;
import com.labigel.backend.entity.Product;
import com.labigel.backend.entity.Subcategory;
import com.labigel.backend.exception.DuplicateResourceException;
import com.labigel.backend.exception.ResourceNotFoundException;
import com.labigel.backend.repository.CategoryRepository;
import com.labigel.backend.repository.ProductRepository;
import com.labigel.backend.repository.SubcategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final SubcategoryRepository subcategoryRepository;
    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public Page<ProductResponse> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Ürün bulunamadı: " + slug));
        return mapToResponse(product);
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getFeaturedProducts() {
        return productRepository.findByIsFeaturedTrueAndIsActiveTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> searchProducts(String query) {
        return productRepository.findByNameContainingIgnoreCaseAndIsActiveTrue(query).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        Subcategory subcategory = resolveSubcategory(request);
        Category category = resolveCategory(request, subcategory);

        String slug = generateSlug(request.getName());

        if (productRepository.findBySlug(slug).isPresent()) {
            throw new DuplicateResourceException("Bu isimde bir ürün zaten mevcut");
        }

        Product product = Product.builder()
                .name(request.getName())
                .slug(slug)
                .description(request.getDescription())
                .ingredients(request.getIngredients())
                .price(request.getPrice())
                .imageUrl(request.getImageUrl())
                .calories(request.getCalories())
                .weightGrams(request.getWeightGrams())
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .isFeatured(request.getIsFeatured() != null ? request.getIsFeatured() : false)
                .subcategory(subcategory)
                .category(category)
                .build();

        Product savedProduct = productRepository.save(product);
        return mapToResponse(savedProduct);
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ürün bulunamadı: " + id));

        Subcategory subcategory = resolveSubcategory(request);
        Category category = resolveCategory(request, subcategory);

        String newSlug = generateSlug(request.getName());
        if (!product.getSlug().equals(newSlug) && productRepository.findBySlug(newSlug).isPresent()) {
            throw new DuplicateResourceException("Bu isimde bir ürün zaten mevcut");
        }

        product.setName(request.getName());
        product.setSlug(newSlug);
        product.setDescription(request.getDescription());
        product.setIngredients(request.getIngredients());
        product.setPrice(request.getPrice());
        product.setSubcategory(subcategory);
        product.setCategory(category);

        if (request.getImageUrl() != null) {
            product.setImageUrl(request.getImageUrl());
        }
        if (request.getCalories() != null) {
            product.setCalories(request.getCalories());
        }
        if (request.getWeightGrams() != null) {
            product.setWeightGrams(request.getWeightGrams());
        }
        if (request.getDisplayOrder() != null) {
            product.setDisplayOrder(request.getDisplayOrder());
        }
        if (request.getIsActive() != null) {
            product.setActive(request.getIsActive());
        }
        if (request.getIsFeatured() != null) {
            product.setFeatured(request.getIsFeatured());
        }

        Product updatedProduct = productRepository.save(product);
        return mapToResponse(updatedProduct);
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Ürün bulunamadı: " + id);
        }
        productRepository.deleteById(id);
    }

    @Transactional
    public ProductResponse toggleActive(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ürün bulunamadı: " + id));
        product.setActive(!product.isActive());
        return mapToResponse(productRepository.save(product));
    }

    private Subcategory resolveSubcategory(ProductRequest request) {
        if (request.getSubcategoryId() == null) {
            return null;
        }
        return subcategoryRepository.findById(request.getSubcategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Alt kategori bulunamadı: " + request.getSubcategoryId()));
    }

    private Category resolveCategory(ProductRequest request, Subcategory subcategory) {
        if (subcategory != null) {
            return subcategory.getCategory();
        }
        if (request.getCategoryId() == null) {
            throw new IllegalArgumentException("Kategori veya alt kategori seçimi zorunludur");
        }
        return categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Kategori bulunamadı: " + request.getCategoryId()));
    }

    private ProductResponse mapToResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .description(product.getDescription())
                .ingredients(product.getIngredients())
                .price(product.getPrice())
                .imageUrl(product.getImageUrl())
                .calories(product.getCalories())
                .weightGrams(product.getWeightGrams())
                .displayOrder(product.getDisplayOrder())
                .isActive(product.isActive())
                .isFeatured(product.isFeatured())
                .subcategoryName(product.getSubcategory() != null ? product.getSubcategory().getName() : null)
                .categoryName(product.getCategory() != null
                        ? product.getCategory().getName()
                        : (product.getSubcategory() != null && product.getSubcategory().getCategory() != null
                                ? product.getSubcategory().getCategory().getName() : null))
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
