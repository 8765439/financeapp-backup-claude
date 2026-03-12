package com.financeapp.controller;

import com.financeapp.dto.DashboardDto;
import com.financeapp.entity.User;
import com.financeapp.repository.UserRepository;
import com.financeapp.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<DashboardDto> getDashboard(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "2025-26") String fy) {
        Long userId = ((User) userDetails).getId();
        return ResponseEntity.ok(dashboardService.getDashboard(userId, fy));
    }
}
