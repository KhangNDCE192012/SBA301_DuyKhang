package com.funews.assignment2.controller;


import com.funews.assignment2.dto.ApiDtos.*;
import com.funews.assignment2.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody @jakarta.validation.Valid LoginRequest request
    ) {
        return authService.login(request);
    }

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
