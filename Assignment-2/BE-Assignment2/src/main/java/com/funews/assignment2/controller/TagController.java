package com.funews.assignment2.controller;


import com.funews.assignment2.dto.ApiDtos.TagView;
import com.funews.assignment2.security.CurrentUserService;
import com.funews.assignment2.service.TagService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping
    public List<TagView> getAll(
            @RequestHeader("Authorization") String auth
    ) {

        currentUserService.requireRole(auth, 2);

        return tagService.getAll();
    }
}
