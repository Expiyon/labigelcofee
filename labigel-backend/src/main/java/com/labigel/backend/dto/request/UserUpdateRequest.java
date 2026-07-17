package com.labigel.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserUpdateRequest {
    @NotBlank(message = "Ad Soyad alanı boş bırakılamaz")
    private String fullName;

    @NotBlank(message = "Rol alanı boş bırakılamaz")
    @Pattern(regexp = "ADMIN|EDITOR", message = "Rol ADMIN veya EDITOR olmalıdır")
    private String role;

    private Boolean isActive;

    // Optional — only updated when a non-blank value is provided.
    @Size(min = 6, message = "Şifre en az 6 karakter olmalıdır")
    private String password;
}
