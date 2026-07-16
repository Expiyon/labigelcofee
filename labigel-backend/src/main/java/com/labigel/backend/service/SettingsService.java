package com.labigel.backend.service;

import com.labigel.backend.dto.request.SettingsRequest;
import com.labigel.backend.dto.response.SettingsResponse;
import com.labigel.backend.entity.SiteSettings;
import com.labigel.backend.exception.ResourceNotFoundException;
import com.labigel.backend.repository.SiteSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SettingsService {

    private final SiteSettingsRepository siteSettingsRepository;

    /** Map entity → DTO */
    private SettingsResponse toResponse(SiteSettings s) {
        return SettingsResponse.builder()
                .siteName(s.getSiteName())
                .logoUrl(s.getLogoUrl())
                .primaryColor(s.getPrimaryColor())
                .secondaryColor(s.getSecondaryColor())
                .fontFamily(s.getFontFamily())
                .instagramUrl(s.getInstagramUrl())
                .phone(s.getPhone())
                .address(s.getAddress())
                .aboutText(s.getAboutText())
                .build();
    }

    @Transactional(readOnly = true)
    public SettingsResponse getSettings() {
        SiteSettings settings = siteSettingsRepository.findFirstByOrderByIdAsc()
                .orElseThrow(() -> new ResourceNotFoundException("Site ayarları bulunamadı"));
        return toResponse(settings);
    }

    @Transactional
    public SettingsResponse updateSettings(SettingsRequest request) {
        SiteSettings settings = siteSettingsRepository.findFirstByOrderByIdAsc()
                .orElse(new SiteSettings());

        if (request.getSiteName() != null) settings.setSiteName(request.getSiteName());
        if (request.getLogoUrl() != null) settings.setLogoUrl(request.getLogoUrl());
        if (request.getPrimaryColor() != null) settings.setPrimaryColor(request.getPrimaryColor());
        if (request.getSecondaryColor() != null) settings.setSecondaryColor(request.getSecondaryColor());
        if (request.getFontFamily() != null) settings.setFontFamily(request.getFontFamily());
        if (request.getInstagramUrl() != null) settings.setInstagramUrl(request.getInstagramUrl());
        if (request.getPhone() != null) settings.setPhone(request.getPhone());
        if (request.getAddress() != null) settings.setAddress(request.getAddress());
        if (request.getAboutText() != null) settings.setAboutText(request.getAboutText());

        return toResponse(siteSettingsRepository.save(settings));
    }
}
