package com.funews.assignment2.controller;

import com.funews.assignment2.dto.ApiDtos.*;
import com.funews.assignment2.entity.SystemAccount;
import com.funews.assignment2.security.CurrentUserService;
import com.funews.assignment2.service.AccountService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    // ADMIN: GET ALL / SEARCH

    @GetMapping
    public List<AccountView> getAll(
            @RequestHeader("Authorization") String auth,
            @RequestParam(required = false) String search
    ) {

        currentUserService.requireRole(auth, 1);

        return accountService.getAll(search);
    }

    // ADMIN: GET BY ID

    @GetMapping("/{id}")
    public AccountView getById(
            @RequestHeader("Authorization") String auth,
            @PathVariable Short id
    ) {

        currentUserService.requireRole(auth, 1);

        return accountService.getById(id);
    }

    // ADMIN: CREATE

    @PostMapping
    public AccountView create(
            @RequestHeader("Authorization") String auth,
            @Valid @RequestBody AccountRequest request
    ) {

        currentUserService.requireRole(auth, 1);

        return accountService.create(request);
    }

    // ADMIN: UPDATE

    @PutMapping("/{id}")
    public AccountView update(
            @RequestHeader("Authorization") String auth,
            @PathVariable Short id,
            @Valid @RequestBody AccountRequest request
    ) {

        currentUserService.requireRole(auth, 1);

        return accountService.update(id, request);
    }

    // ADMIN: DELETE

    @DeleteMapping("/{id}")
    public String delete(
            @RequestHeader("Authorization") String auth,
            @PathVariable Short id
    ) {

        currentUserService.requireRole(auth, 1);

        accountService.delete(id);

        return "Account deleted successfully";
    }

    // STAFF: UPDATE OWN PROFILE

    @PutMapping("/profile")
    public AccountView updateProfile(
            @RequestHeader("Authorization") String auth,
            @Valid @RequestBody ProfileRequest request
    ) {

        SystemAccount staff =
                currentUserService.requireRole(auth, 2);

        return accountService.updateProfile(staff, request);
    }
}
