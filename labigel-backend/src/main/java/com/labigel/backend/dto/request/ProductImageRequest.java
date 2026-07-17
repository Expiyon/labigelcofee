package com.labigel.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProductImageRequest {
    @NotBlank(message = "Görsel URL'si boş bırakılamaz")
    private String imageUrl;
}
