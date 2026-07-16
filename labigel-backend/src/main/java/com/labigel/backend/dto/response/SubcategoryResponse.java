package com.labigel.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubcategoryResponse {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String imageUrl;
    private Integer displayOrder;

    @JsonProperty("isActive")
    private boolean isActive;

    private String categoryName;
    private int productCount;
    private List<ProductResponse> products;
}
