package com.funews.assignment2.controller;

import com.funews.assignment2.dto.ApiDtos.*;
import com.funews.assignment2.entity.SystemAccount;
import com.funews.assignment2.security.CurrentUserService;
import com.funews.assignment2.service.CategoryService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Nguyễn Duy Khang - CE192012 - Assignment 2
 * Controller này expose các REST API quản lý danh mục tin tức (Category):
 * - Public & Admin: Xem danh sách các danh mục đang hoạt động (active)
 * - Staff (Role 2): Quản lý toàn bộ danh mục (CRUD, tìm kiếm, kiểm tra ràng buộc xóa)
 */
@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;
    private final CurrentUserService currentUserService;

    public CategoryController(
            CategoryService categoryService,
            CurrentUserService currentUserService
    ) {
        this.categoryService = categoryService;
        this.currentUserService = currentUserService;
    }

    /**
     * Lấy danh sách danh mục:
     * - Khách vãng lai và Admin: chỉ được lấy danh mục activeOnly = true.
     * - Staff: bắt buộc có role 2, được lấy tất cả danh mục (activeOnly = false).
     */
    @GetMapping
    public List<CategoryView> getAll(
            @RequestHeader(
                    value = "Authorization",
                    required = false
            ) String auth,

            @RequestParam(required = false) String search
    ) {
        SystemAccount user = currentUserService.optionalUser(auth);

        if (user == null || Integer.valueOf(1).equals(user.getAccountRole())) {
            return categoryService.getAll(search, true);
        }

        currentUserService.requireRole(auth, 2);
        return categoryService.getAll(search, false);
    }

    /**
     * STAFF: Thêm mới danh mục qua Popup Modal.
     */
    @PostMapping
    public CategoryView create(
            @RequestHeader("Authorization") String auth,
            @Valid @RequestBody CategoryRequest request
    ) {
        currentUserService.requireRole(auth, 2);
        return categoryService.create(request);
    }

    /**
     * STAFF: Cập nhật thông tin danh mục qua Popup Modal.
     */
    @PutMapping("/{id}")
    public CategoryView update(
            @RequestHeader("Authorization") String auth,
            @PathVariable Short id,
            @Valid @RequestBody CategoryRequest request
    ) {
        currentUserService.requireRole(auth, 2);
        return categoryService.update(id, request);
    }

    /**
     * STAFF: Xóa danh mục (Service sẽ chặn ném 409 nếu có bài báo hoặc có danh mục con).
     */
    @DeleteMapping("/{id}")
    public String delete(
            @RequestHeader("Authorization") String auth,
            @PathVariable Short id
    ) {
        currentUserService.requireRole(auth, 2);
        categoryService.delete(id);
        return "Category deleted successfully";
    }
}
