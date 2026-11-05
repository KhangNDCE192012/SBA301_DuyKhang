package com.funews.assignment2.exception;

import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

/**
 * Nguyễn Duy Khang - CE192012 - Assignment 2
 * Class này bắt và xử lý ngoại lệ tập trung (Global Exception Handler) cho toàn bộ Controller trong dự án.
 * Đảm bảo mọi lỗi phát sinh (Validation, nghiệp vụ, hệ thống) đều trả về format JSON đồng nhất cho Client.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Bắt các ngoại lệ do Service chủ động ném ra thông qua ResponseStatusException
     * (ví dụ: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict).
     */
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> handleStatus(
            ResponseStatusException ex
    ) {
        Map<String, Object> body = new HashMap<>();
        body.put("status", ex.getStatusCode().value());
        body.put("message", ex.getReason());

        return ResponseEntity
                .status(ex.getStatusCode())
                .body(body);
    }

    /**
     * Bắt các lỗi validation khi dữ liệu gửi lên không thỏa mãn các annotation @Valid, @NotBlank, @Size,...
     * Thu thập danh sách lỗi theo từng field và trả về mã 400 kèm chi tiết từng trường bị lỗi.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(
            MethodArgumentNotValidException ex
    ) {
        Map<String, Object> errors = new LinkedHashMap<>();

        ex.getBindingResult().getFieldErrors()
                .forEach(error ->
                        errors.put(
                                error.getField(),
                                error.getDefaultMessage()
                        )
                );

        Map<String, Object> body = new HashMap<>();
        body.put("status", 400);
        body.put("message", "Validation failed");
        body.put("errors", errors);

        return ResponseEntity
                .badRequest()
                .body(body);
    }

    /**
     * Bắt các lỗi ngoại lệ chưa xác định khác (Internal Server Error 500).
     * In stack trace ra console để lập trình viên tiện debug và trả về thông báo an toàn cho client.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleOther(
            Exception ex
    ) {
        ex.printStackTrace();

        Map<String, Object> body = new HashMap<>();
        body.put("status", 500);
        body.put("message", "Internal server error");

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(body);
    }
}
