package com.labigel.backend.controller;

import com.labigel.backend.dto.response.ApiResponse;
import com.labigel.backend.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/upload")
@RequiredArgsConstructor
public class FileUploadController {

    private final FileStorageService fileStorageService;

    // Upload file to local storage — returns the absolute URL as a String
    @PostMapping
    public ResponseEntity<ApiResponse<String>> uploadFile(
            @RequestParam("file") MultipartFile file) {
        String url = fileStorageService.upload(file);
        return ResponseEntity.ok(ApiResponse.success(url, "Dosya başarıyla yüklendi"));
    }

    // Delete file from local storage by filename
    @DeleteMapping("/{filename}")
    public ResponseEntity<ApiResponse<Void>> deleteFile(@PathVariable String filename) {
        fileStorageService.delete(filename);
        return ResponseEntity.ok(ApiResponse.<Void>success("Dosya başarıyla silindi"));
    }
}
