package com.funews.assignment2.controller;

import com.funews.assignment2.dto.ApiDtos.TagView;
import com.funews.assignment2.security.CurrentUserService;
import com.funews.assignment2.service.TagService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Nguyễn Duy Khang - CE192012 - Assignment 2
 * Controller này expose REST API truy vấn danh sách thẻ Tag (/api/tags) cho Staff khi tạo/sửa bài viết.
 */
@RestController
@RequestMapping("/api/tags")
public class TagController {

    private final TagService tagService;
    private final CurrentUserService currentUserService;

    public TagController(
            TagService tagService,
            CurrentUserService currentUserService
    ) {
        this.tagService = tagService;
        this.currentUserService = currentUserService;
    }

    /**
     * STAFF: Lấy danh sách toàn bộ Tag để hiển thị chọn Tag trong Modal bài báo.
     * Bắt buộc quyền Staff (Role = 2).
     */
    @GetMapping
    public List<TagView> getAll(
            @RequestHeader("Authorization") String auth
    ) {
        currentUserService.requireRole(auth, 2);
        return tagService.getAll();
    }
}
