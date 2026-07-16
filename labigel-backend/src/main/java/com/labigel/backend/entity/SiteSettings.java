package com.labigel.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "site_settings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SiteSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Builder.Default
    private String siteName = "Labigel Cafe";

    private String logoUrl;

    @Builder.Default
    private String primaryColor = "#E31E24";

    @Builder.Default
    private String secondaryColor = "#0D0D0D";

    @Builder.Default
    private String fontFamily = "Poppins";

    private String instagramUrl;

    private String phone;

    private String address;

    @Column(columnDefinition = "TEXT")
    private String aboutText;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
