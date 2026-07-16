package com.labigel.backend.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${app.upload.dir}")
    private String uploadDir;

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(Paths.get(uploadDir));
        } catch (IOException e) {
            throw new RuntimeException("Yükleme dizini oluşturulamadı: " + e.getMessage());
        }
    }

    public String upload(MultipartFile file) {
        try {
            String originalName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "";
            String extension = "";
            int dotIndex = originalName.lastIndexOf('.');
            if (dotIndex >= 0) {
                extension = originalName.substring(dotIndex);
            }
            String filename = "labigel_" + UUID.randomUUID() + extension;

            Path target = Paths.get(uploadDir).resolve(filename);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            String basePath = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/" + filename)
                    .toUriString();
            return basePath;
        } catch (IOException e) {
            throw new RuntimeException("Dosya yüklenirken hata oluştu: " + e.getMessage());
        }
    }

    public void delete(String filename) {
        try {
            Path target = Paths.get(uploadDir).resolve(filename);
            Files.deleteIfExists(target);
        } catch (IOException e) {
            throw new RuntimeException("Dosya silinirken hata oluştu: " + e.getMessage());
        }
    }
}
