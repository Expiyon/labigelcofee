package com.labigel.backend.controller;

import com.labigel.backend.dto.request.SettingsRequest;
import com.labigel.backend.dto.response.ApiResponse;
import com.labigel.backend.dto.response.SettingsResponse;
import com.labigel.backend.service.SettingsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class SettingsController {

    private final SettingsService settingsService;

    // ==================== PUBLIC ENDPOINTS ====================

    // Get public site settings (no auth required)
    @GetMapping("/api/public/settings")
    public ResponseEntity<ApiResponse<SettingsResponse>> getPublicSettings() {
        SettingsResponse settings = settingsService.getSettings();
        return ResponseEntity.ok(ApiResponse.success(settings));
    }

    // ==================== ADMIN ENDPOINTS ====================

    // Get site settings (admin)
    @GetMapping("/api/admin/settings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SettingsResponse>> getSettings() {
        SettingsResponse settings = settingsService.getSettings();
        return ResponseEntity.ok(ApiResponse.success(settings));
    }

    // Update site settings (admin)
    @PutMapping("/api/admin/settings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SettingsResponse>> updateSettings(
            @Valid @RequestBody SettingsRequest request) {
        SettingsResponse settings = settingsService.updateSettings(request);
        return ResponseEntity.ok(ApiResponse.success(settings, "Ayarlar başarıyla güncellendi"));
    }
}
