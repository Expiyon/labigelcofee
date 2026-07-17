package com.labigel.backend.controller;

import com.labigel.backend.dto.request.UserCreateRequest;
import com.labigel.backend.dto.request.UserUpdateRequest;
import com.labigel.backend.dto.response.ApiResponse;
import com.labigel.backend.dto.response.UserResponse;
import com.labigel.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Managing admin-panel users (e.g. creating the limited "EDITOR" account) is
// restricted to ADMIN — everything here is gated at the class level.
@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserService userService;

    @GetMapping
    public ApiResponse<List<UserResponse>> getAllUsers() {
        return ApiResponse.success(userService.getAllUsers(), "Kullanıcılar getirildi");
    }

    @PostMapping
    public ApiResponse<UserResponse> createUser(@Valid @RequestBody UserCreateRequest request) {
        return ApiResponse.success(userService.createUser(request), "Kullanıcı oluşturuldu");
    }

    @PutMapping("/{id}")
    public ApiResponse<UserResponse> updateUser(@PathVariable Long id, @Valid @RequestBody UserUpdateRequest request) {
        return ApiResponse.success(userService.updateUser(id, request), "Kullanıcı güncellendi");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ApiResponse.success(null, "Kullanıcı silindi");
    }
}
