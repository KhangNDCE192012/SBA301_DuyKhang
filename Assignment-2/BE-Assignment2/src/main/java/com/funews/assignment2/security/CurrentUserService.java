package com.funews.assignment2.security;

import com.funews.assignment2.entity.SystemAccount;
import com.funews.assignment2.repository.AccountRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CurrentUserService {

    private final SessionService sessionService;
    private final AccountRepository accountRepository;

    public CurrentUserService(
            SessionService sessionService,
            AccountRepository accountRepository
    ) {
        this.sessionService = sessionService;
        this.accountRepository = accountRepository;
    }

    public SystemAccount optionalUser(String authorization) {

        if (authorization == null || authorization.isBlank()) {
            return null;
        }

        return requireUser(authorization);
    }

    public SystemAccount requireUser(String authorization) {

        if (authorization == null ||
                !authorization.startsWith("Bearer ")) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Please login first"
            );
        }

        String token = authorization.substring(7);

        Short accountId = sessionService.getAccountId(token);

        if (accountId == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid or expired session"
            );
        }

        return accountRepository.findById(accountId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.UNAUTHORIZED,
                                "Account not found"
                        )
                );
    }

    public SystemAccount requireRole(
            String authorization,
            int role
    ) {

        SystemAccount account = requireUser(authorization);

        if (!account.getAccountRole().equals(role)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You do not have permission"
            );
        }

        return account;
    }
}