package com.funews.assignment2.controller;


import com.funews.assignment2.dto.ApiDtos.*;
import com.funews.assignment2.entity.SystemAccount;
import com.funews.assignment2.security.CurrentUserService;
import com.funews.assignment2.service.NewsArticleService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    // PUBLIC: ACTIVE NEWS
    // STAFF: NEWS MANAGEMENT

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

        SystemAccount user =
                currentUserService.optionalUser(auth);

        return newsService.getAll(
                search,
                categoryId,
                activeOnly,
                user
        );
    }

    // STAFF: MY HISTORY

    @GetMapping("/my-history")
    public List<NewsView> getMyHistory(
            @RequestHeader("Authorization") String auth
    ) {

        SystemAccount staff =
                currentUserService.requireRole(auth, 2);

        return newsService.getMyHistory(staff);
    }

    // GET ARTICLE DETAIL

    @GetMapping("/{id}")
    public NewsView getById(
            @RequestHeader(
                    value = "Authorization",
                    required = false
            ) String auth,

            @PathVariable String id
    ) {

        SystemAccount user =
                currentUserService.optionalUser(auth);

        return newsService.getById(id, user);
    }

    // STAFF: CREATE

    @PostMapping
    public NewsView create(
            @RequestHeader("Authorization") String auth,
            @Valid @RequestBody NewsRequest request
    ) {

        SystemAccount staff =
                currentUserService.requireRole(auth, 2);

        return newsService.create(request, staff);
    }

    // STAFF: UPDATE

    @PutMapping("/{id}")
    public NewsView update(
            @RequestHeader("Authorization") String auth,
            @PathVariable String id,
            @Valid @RequestBody NewsRequest request
    ) {

        SystemAccount staff =
                currentUserService.requireRole(auth, 2);

        return newsService.update(id, request, staff);
    }

    // STAFF: DELETE

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
