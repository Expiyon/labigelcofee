package com.labigel.backend.dto.request;

import lombok.Data;

@Data
public class SettingsRequest {
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
