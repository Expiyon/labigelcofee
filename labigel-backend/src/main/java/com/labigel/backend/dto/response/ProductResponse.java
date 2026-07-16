package com.labigel.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String ingredients;
    private BigDecimal price;
    private String imageUrl;
    private Integer calories;
    private Integer weightGrams;
    private Integer displayOrder;

    @JsonProperty("isActive")
    private boolean isActive;

    @JsonProperty("isFeatured")
    private boolean isFeatured;

    private String subcategoryName;
    private String categoryName;
}
