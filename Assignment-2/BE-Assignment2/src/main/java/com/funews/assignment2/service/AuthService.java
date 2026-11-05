package com.funews.assignment2.service;

import com.funews.assignment2.dto.ApiDtos.*;
import com.funews.assignment2.entity.SystemAccount;
import com.funews.assignment2.repository.AccountRepository;
import com.funews.assignment2.security.SessionService;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final AccountRepository accountRepository;
    private final SessionService sessionService;

    public AuthService(
            AccountRepository accountRepository,
            SessionService sessionService
    ) {
        this.accountRepository = accountRepository;
        this.sessionService = sessionService;
    }

    public LoginResponse login(LoginRequest request) {

        SystemAccount account = accountRepository
                .findByAccountEmailIgnoreCase(request.email())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.UNAUTHORIZED,
                                "Email or password is incorrect"
                        )
                );

        if (!account.getAccountPassword().equals(request.password())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Email or password is incorrect"
            );
        }

        if (account.getAccountRole() == null ||
                (account.getAccountRole() != 1 &&
                        account.getAccountRole() != 2)) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Invalid account role"
            );
        }

        String token = sessionService.createSession(
                account.getAccountId()
        );

        AccountView view = new AccountView(
                account.getAccountId(),
                account.getAccountName(),
                account.getAccountEmail(),
                account.getAccountRole()
        );

        return new LoginResponse(token, view);
    }

    public void logout(String authorization) {

        if (authorization != null &&
                authorization.startsWith("Bearer ")) {

            String token = authorization.substring(7);

            sessionService.removeSession(token);
        }
    }
}
