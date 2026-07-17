package com.labigel.backend.controller;

import com.labigel.backend.dto.response.ApiResponse;
import com.labigel.backend.dto.response.DashboardResponse;
import com.labigel.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    // Get dashboard statistics
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DashboardResponse>> getStats() {
        DashboardResponse stats = dashboardService.getStats();
        return ResponseEntity.ok(ApiResponse.success(stats, "İstatistikler getirildi"));
    }
}
