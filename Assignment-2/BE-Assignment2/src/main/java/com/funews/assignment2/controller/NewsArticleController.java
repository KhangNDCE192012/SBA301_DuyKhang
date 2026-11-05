package com.funews.assignment2.controller;

import com.funews.assignment2.dto.ApiDtos.*;
import com.funews.assignment2.entity.SystemAccount;
import com.funews.assignment2.security.CurrentUserService;
import com.funews.assignment2.service.NewsArticleService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Nguyễn Duy Khang - CE192012 - Assignment 2
 * Controller này expose các REST API quản lý bài viết tin tức (NewsArticle):
 * - Public: Xem danh sách bài viết active, chi tiết bài viết, tìm kiếm, lọc theo danh mục
 * - Staff (Role 2): Quản lý toàn bộ bài viết (CRUD, gán Tags) và xem lịch sử bài viết của chính mình (/my-history)
 */
@RestController
@RequestMapping("/api/news-articles")
public class NewsArticleController {

    private final NewsArticleService newsService;
    private final CurrentUserService currentUserService;

    public NewsArticleController(
            NewsArticleService newsService,
            CurrentUserService currentUserService
    ) {
        this.newsService = newsService;
        this.currentUserService = currentUserService;
    }

    /**
     * Lấy danh sách bài viết:
     * - Public / Admin: chỉ xem bài viết active.
     * - Staff: xem tất cả để quản trị.
     * - Hỗ trợ lọc theo từ khóa search, theo categoryId và cờ activeOnly.
     */
    @GetMapping
    public List<NewsView> getAll(
            @RequestHeader(
                    value = "Authorization",
                    required = false
            ) String auth,

            @RequestParam(required = false) String search,

            @RequestParam(required = false) Short categoryId,

            @RequestParam(required = false) Boolean activeOnly
    ) {
        SystemAccount user = currentUserService.optionalUser(auth);

        return newsService.getAll(
                search,
                categoryId,
                activeOnly,
                user
        );
    }

    /**
     * STAFF: Xem lịch sử các bài báo do chính Staff đang đăng nhập tạo ra (My History).
     */
    @GetMapping("/my-history")
    public List<NewsView> getMyHistory(
            @RequestHeader("Authorization") String auth
    ) {
        SystemAccount staff = currentUserService.requireRole(auth, 2);
        return newsService.getMyHistory(staff);
    }

    /**
     * Lấy chi tiết một bài viết theo ID.
     */
    @GetMapping("/{id}")
    public NewsView getById(
            @RequestHeader(
                    value = "Authorization",
                    required = false
            ) String auth,

            @PathVariable String id
    ) {
        SystemAccount user = currentUserService.optionalUser(auth);
        return newsService.getById(id, user);
    }

    /**
     * STAFF: Tạo mới bài viết tin tức kèm danh sách Tags qua Popup Modal.
     */
    @PostMapping
    public NewsView create(
            @RequestHeader("Authorization") String auth,
            @Valid @RequestBody NewsRequest request
    ) {
        SystemAccount staff = currentUserService.requireRole(auth, 2);
        return newsService.create(request, staff);
    }

    /**
     * STAFF: Cập nhật thông tin bài viết và Tags qua Popup Modal.
     */
    @PutMapping("/{id}")
    public NewsView update(
            @RequestHeader("Authorization") String auth,
            @PathVariable String id,
            @Valid @RequestBody NewsRequest request
    ) {
        SystemAccount staff = currentUserService.requireRole(auth, 2);
        return newsService.update(id, request, staff);
    }

    /**
     * STAFF: Xóa bài viết theo ID.
     */
    @DeleteMapping("/{id}")
    public String delete(
            @RequestHeader("Authorization") String auth,
            @PathVariable String id
    ) {
        currentUserService.requireRole(auth, 2);
        newsService.delete(id);
        return "News article deleted successfully";
    }
}
