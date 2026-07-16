package com.labigel.backend.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductRequest {
    @NotBlank(message = "Ürün adı boş bırakılamaz")
    private String name;

    private Long subcategoryId;

    private Long categoryId;

    private String description;

    private String ingredients;

    @NotNull(message = "Fiyat boş bırakılamaz")
    @DecimalMin(value = "0.0", inclusive = true, message = "Fiyat 0'dan küçük olamaz")
    private BigDecimal price;

    private String imageUrl;

    private Integer calories;

    private Integer weightGrams;

    private Integer displayOrder;
    
    private Boolean isActive;

    private Boolean isFeatured;
}
