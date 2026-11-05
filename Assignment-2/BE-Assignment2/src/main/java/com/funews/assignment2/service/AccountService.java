package com.funews.assignment2.service;


import com.funews.assignment2.dto.ApiDtos.*;
import com.funews.assignment2.entity.SystemAccount;
import com.funews.assignment2.repository.AccountRepository;
import com.funews.assignment2.repository.NewsArticleRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final NewsArticleRepository newsRepository;

    public AccountService(
            AccountRepository accountRepository,
            NewsArticleRepository newsRepository
    ) {
        this.accountRepository = accountRepository;
        this.newsRepository = newsRepository;
    }

    private AccountView toView(SystemAccount a) {
        return new AccountView(
                a.getAccountId(),
                a.getAccountName(),
                a.getAccountEmail(),
                a.getAccountRole()
        );
    }

    public List<AccountView> getAll(String search) {

        List<SystemAccount> accounts;

        if (search == null || search.isBlank()) {
            accounts = accountRepository.findAll();
        } else {
            accounts = accountRepository
                    .findByAccountNameContainingIgnoreCaseOrAccountEmailContainingIgnoreCase(
                            search, search
                    );
        }

        return accounts.stream()
                .map(this::toView)
                .toList();
    }

    public AccountView getById(Short id) {

        SystemAccount account = accountRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Account not found"
                        )
                );

        return toView(account);
    }

    @Transactional
    public AccountView create(AccountRequest request) {

        if (request.accountPassword() == null ||
                request.accountPassword().isBlank()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Password is required"
            );
        }

        if (accountRepository.existsByAccountEmailIgnoreCase(
                request.accountEmail())) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email already exists"
            );
        }

        short nextId = (short) (
                accountRepository.findTopByOrderByAccountIdDesc()
                        .map(a -> a.getAccountId())
                        .orElse((short) 0) + 1
        );

        SystemAccount account = new SystemAccount();

        account.setAccountId(nextId);
        account.setAccountName(request.accountName());
        account.setAccountEmail(request.accountEmail());
        account.setAccountRole(request.accountRole());
        account.setAccountPassword(request.accountPassword());

        return toView(accountRepository.save(account));
    }

    @Transactional
    public AccountView update(
            Short id,
            AccountRequest request
    ) {

        SystemAccount account = accountRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Account not found"
                        )
                );

        if (accountRepository
                .existsByAccountEmailIgnoreCaseAndAccountIdNot(
                        request.accountEmail(), id
                )) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email already exists"
            );
        }

        account.setAccountName(request.accountName());
        account.setAccountEmail(request.accountEmail());
        account.setAccountRole(request.accountRole());

        if (request.accountPassword() != null &&
                !request.accountPassword().isBlank()) {

            account.setAccountPassword(request.accountPassword());
        }

        return toView(accountRepository.save(account));
    }

    @Transactional
    public void delete(Short id) {

        SystemAccount account = accountRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Account not found"
                        )
                );

        if (newsRepository.existsByCreatedBy_AccountId(id)) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Cannot delete account because it created news articles"
            );
        }

        accountRepository.delete(account);
    }

    @Transactional
    public AccountView updateProfile(
            SystemAccount currentUser,
            ProfileRequest request
    ) {

        if (accountRepository
                .existsByAccountEmailIgnoreCaseAndAccountIdNot(
                        request.accountEmail(),
                        currentUser.getAccountId()
                )) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email already exists"
            );
        }

        currentUser.setAccountName(request.accountName());
        currentUser.setAccountEmail(request.accountEmail());

        if (request.accountPassword() != null &&
                !request.accountPassword().isBlank()) {

            currentUser.setAccountPassword(request.accountPassword());
        }

        return toView(accountRepository.save(currentUser));
    }
}
