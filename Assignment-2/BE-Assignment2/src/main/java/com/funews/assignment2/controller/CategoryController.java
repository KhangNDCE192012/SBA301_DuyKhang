
package com.funews.assignment2.controller;

import com.funews.assignment2.dto.ApiDtos.*;
import com.funews.assignment2.entity.SystemAccount;
import com.funews.assignment2.security.CurrentUserService;
import com.funews.assignment2.service.CategoryService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    // PUBLIC AND ADMIN: VIEW ACTIVE CATEGORIES
    // STAFF: VIEW ALL CATEGORIES

    @GetMapping
    public List<CategoryView> getAll(
            @RequestHeader(
                    value = "Authorization",
                    required = false
            ) String auth,

            @RequestParam(required = false) String search
    ) {

        SystemAccount user =
                currentUserService.optionalUser(auth);

        // Public users and Admin can only view active categories
        if (user == null ||
                Integer.valueOf(1).equals(user.getAccountRole())) {

            return categoryService.getAll(search, true);
        }

        // Staff can view all categories
        currentUserService.requireRole(auth, 2);

        return categoryService.getAll(search, false);
    }

    // STAFF: CREATE CATEGORY

    @PostMapping
    public CategoryView create(
            @RequestHeader("Authorization") String auth,
            @Valid @RequestBody CategoryRequest request
    ) {

        currentUserService.requireRole(auth, 2);

        return categoryService.create(request);
    }

    // STAFF: UPDATE CATEGORY

    @PutMapping("/{id}")
    public CategoryView update(
            @RequestHeader("Authorization") String auth,
            @PathVariable Short id,
            @Valid @RequestBody CategoryRequest request
    ) {

        currentUserService.requireRole(auth, 2);

        return categoryService.update(id, request);
    }

    // STAFF: DELETE CATEGORY

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
