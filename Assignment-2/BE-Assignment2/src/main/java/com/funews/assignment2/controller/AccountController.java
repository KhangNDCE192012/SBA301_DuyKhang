package com.funews.assignment2.controller;

import com.funews.assignment2.dto.ApiDtos.*;
import com.funews.assignment2.entity.SystemAccount;
import com.funews.assignment2.security.CurrentUserService;
import com.funews.assignment2.service.AccountService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Nguyễn Duy Khang - CE192012 - Assignment 2
 * Controller này expose các REST API quản lý tài khoản người dùng:
 * - Admin (Role 1): CRUD tài khoản và tìm kiếm (/api/accounts)
 * - Staff (Role 2): Tự cập nhật hồ sơ cá nhân của mình (/api/accounts/profile)
 */
@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService accountService;
    private final CurrentUserService currentUserService;

    public AccountController(
            AccountService accountService,
            CurrentUserService currentUserService
    ) {
        this.accountService = accountService;
        this.currentUserService = currentUserService;
    }

    /**
     * ADMIN: Lấy danh sách tài khoản hoặc tìm kiếm theo từ khóa.
     * Kiểm tra quyền Admin (Role = 1), sau đó gọi AccountService.getAll().
     */
    @GetMapping
    public List<AccountView> getAll(
            @RequestHeader("Authorization") String auth,
            @RequestParam(required = false) String search
    ) {
        currentUserService.requireRole(auth, 1);
        return accountService.getAll(search);
    }

    /**
     * ADMIN: Lấy thông tin chi tiết một tài khoản theo ID.
     */
    @GetMapping("/{id}")
    public AccountView getById(
            @RequestHeader("Authorization") String auth,
            @PathVariable Short id
    ) {
        currentUserService.requireRole(auth, 1);
        return accountService.getById(id);
    }

    /**
     * ADMIN: Tạo mới một tài khoản hệ thống từ Popup Modal.
     * Validate dữ liệu đầu vào qua @Valid AccountRequest.
     */
    @PostMapping
    public AccountView create(
            @RequestHeader("Authorization") String auth,
            @Valid @RequestBody AccountRequest request
    ) {
        currentUserService.requireRole(auth, 1);
        return accountService.create(request);
    }

    /**
     * ADMIN: Cập nhật thông tin tài khoản qua Popup Modal.
     */
    @PutMapping("/{id}")
    public AccountView update(
            @RequestHeader("Authorization") String auth,
            @PathVariable Short id,
            @Valid @RequestBody AccountRequest request
    ) {
        currentUserService.requireRole(auth, 1);
        return accountService.update(id, request);
    }

    /**
     * ADMIN: Xóa tài khoản theo ID (kèm kiểm tra ràng buộc không được xóa nếu đã tạo bài báo).
     */
    @DeleteMapping("/{id}")
    public String delete(
            @RequestHeader("Authorization") String auth,
            @PathVariable Short id
    ) {
        currentUserService.requireRole(auth, 1);
        accountService.delete(id);
        return "Account deleted successfully";
    }

    /**
     * STAFF: Tự cập nhật hồ sơ cá nhân (My Profile).
     * Bắt buộc quyền Staff (Role = 2), cập nhật thông tin cho chính Staff đang gửi request.
     */
    @PutMapping("/profile")
    public AccountView updateProfile(
            @RequestHeader("Authorization") String auth,
            @Valid @RequestBody ProfileRequest request
    ) {
        SystemAccount staff = currentUserService.requireRole(auth, 2);
        return accountService.updateProfile(staff, request);
    }
}
