package com.labigel.backend.config;

import com.labigel.backend.entity.SiteSettings;
import com.labigel.backend.entity.User;
import com.labigel.backend.repository.SiteSettingsRepository;
import com.labigel.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final SiteSettingsRepository siteSettingsRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        // Create default admin user if not exists
        if (userRepository.count() == 0) {
            User admin = User.builder()
                    .email("admin@labigel.com")
                    .password(passwordEncoder.encode("Labigel2024!"))
                    .fullName("Labigel Admin")
                    .role("ADMIN")
                    .isActive(true)
                    .build();
            userRepository.save(admin);
            System.out.println("[DataInitializer] Admin kullanıcısı oluşturuldu.");
        }

        // Create default site settings if not exists
        if (siteSettingsRepository.count() == 0) {
            SiteSettings settings = SiteSettings.builder()
                    .siteName("Labigel Cafe")
                    .primaryColor("#E31E24")
                    .secondaryColor("#0D0D0D")
                    .fontFamily("Poppins")
                    .instagramUrl("")
                    .phone("")
                    .address("")
                    .aboutText("")
                    .build();
            siteSettingsRepository.save(settings);
            System.out.println("[DataInitializer] Site ayarları oluşturuldu.");
        }
    }
}
