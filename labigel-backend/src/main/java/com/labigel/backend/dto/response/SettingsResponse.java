package com.labigel.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SettingsResponse {
    private Long id;
    private String siteName;
    private String logoUrl;
    private String primaryColor;
    private String secondaryColor;
    private String fontFamily;
    private String instagramUrl;
    private String phone;
    private String address;
    private String aboutText;
}
