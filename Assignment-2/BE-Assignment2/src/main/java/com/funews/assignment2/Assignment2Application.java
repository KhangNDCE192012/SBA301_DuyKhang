package com.funews.assignment2;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Nguyễn Duy Khang - CE192012 - Assignment 2
 * Đây là điểm khởi động (entry point) của toàn bộ ứng dụng Spring Boot.
 * Annotation @SpringBootApplication kích hoạt tự động cấu hình (auto-configuration),
 * quét toàn bộ package con và khởi tạo tất cả các Spring Bean cần thiết.
 */
@SpringBootApplication
public class Assignment2Application {

    /**
     * Phương thức main - điểm bắt đầu chạy ứng dụng.
     * Gọi SpringApplication.run() để khởi động embedded server (Tomcat)
     * và toàn bộ Spring Application Context.
     */
    public static void main(String[] args) {
        SpringApplication.run(Assignment2Application.class, args);
    }

}
