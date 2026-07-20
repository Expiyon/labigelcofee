package com.labigel.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class CategoryRequest {
    @NotBlank(message = "Kategori adı boş bırakılamaz")
    private String name;

    private String description;

    private String imageUrl;

    // "FOOD" or "DRINK" — drives the Yiyecekler / İçecekler split on the menu.
    @Pattern(regexp = "FOOD|DRINK", message = "Grup FOOD veya DRINK olmalıdır")
    private String group;

    private Integer displayOrder;

    private Boolean isActive;
}
