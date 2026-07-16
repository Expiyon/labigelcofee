package com.labigel.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SubcategoryRequest {
    @NotBlank(message = "Alt kategori adı boş bırakılamaz")
    private String name;

    @NotNull(message = "Kategori seçimi zorunludur")
    private Long categoryId;

    private String description;
    
    private String imageUrl;

    private Integer displayOrder;
    
    private Boolean isActive;
}
