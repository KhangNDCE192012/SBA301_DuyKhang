package com.funews.assignment2.controller;

import com.funews.assignment2.dto.ApiDtos.*;
import com.funews.assignment2.service.AuthService;
import org.springframework.web.bind.annotation.*;

/**
 * Nguyễn Duy Khang - CE192012 - Assignment 2
 * Controller này tiếp nhận các yêu cầu HTTP liên quan đến xác thực (Authentication):
 * - POST /api/auth/login : Tiếp nhận email, password từ màn hình Login.jsx để đăng nhập
 * - POST /api/auth/logout: Hủy phiên đăng nhập khi nhấn nút Logout trên Header.jsx
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Endpoint xử lý đăng nhập cho Admin và Staff.
     * Nhận LoginRequest từ body, validate (@Valid) và chuyển tiếp đến AuthService.
     */
    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody @jakarta.validation.Valid LoginRequest request
    ) {
        return authService.login(request);
    }

    /**
     * Endpoint xử lý đăng xuất.
     * Nhận token từ header Authorization và xóa session trên server.
     */
    @PostMapping("/logout")
    public String logout(
            @RequestHeader(
                    value = "Authorization",
                    required = false
            ) String authorization
    ) {
        authService.logout(authorization);
        return "Logout successful";
    }
}
