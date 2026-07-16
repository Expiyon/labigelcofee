package com.labigel.backend.controller;

import com.labigel.backend.dto.request.LoginRequest;
import com.labigel.backend.dto.request.PasswordChangeRequest;
import com.labigel.backend.dto.response.ApiResponse;
import com.labigel.backend.dto.response.AuthResponse;
import com.labigel.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.success(authService.login(request), "Giriş başarılı");
    }

    @GetMapping("/me")
    public ApiResponse<AuthResponse> getMe() {
        return ApiResponse.success(authService.getMe(), "Kullanıcı bilgileri getirildi");
    }

    @PutMapping("/password")
    public ApiResponse<Void> changePassword(@Valid @RequestBody PasswordChangeRequest request) {
        authService.changePassword(request);
        return ApiResponse.success("Şifre başarıyla güncellendi");
    }
}
