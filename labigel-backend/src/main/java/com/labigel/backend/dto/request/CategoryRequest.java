package com.labigel.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoryRequest {
    @NotBlank(message = "Kategori adı boş bırakılamaz")
    private String name;

    private String description;
    
    private String imageUrl;

    private Integer displayOrder;
    
    private Boolean isActive;
}
