package com.funews.assignment2.config;

/**
 * Nguyễn Duy Khang - CE192012 - Assignment 2
 * Lớp cấu hình CORS (Cross-Origin Resource Sharing) cho ứng dụng.
 * Cho phép frontend React (chạy tại http://localhost:5173) gọi API backend
 * mà không bị trình duyệt chặn do chính sách same-origin.
 */

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    /**
     * Cấu hình các quy tắc CORS cho toàn bộ API.
     * Phương thức này được Spring gọi tự động khi khởi động để đăng ký cấu hình CORS.
     * - Áp dụng cho tất cả các endpoint bắt đầu bằng /api/**
     * - Cho phép origin từ React dev server (http://localhost:5173)
     * - Cho phép các HTTP method: GET, POST, PUT, DELETE, OPTIONS
     * - Cho phép tất cả các header (bao gồm Authorization)
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {

        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
                .allowedHeaders("*");
    }
}
