package com.funews.assignment2.security;

import com.funews.assignment2.entity.SystemAccount;
import com.funews.assignment2.repository.AccountRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/**
 * Nguyễn Duy Khang - CE192012 - Assignment 2
 * Class này đóng vai trò xác thực (Authentication) và phân quyền (Authorization) ở tầng Service.
 * Chịu trách nhiệm bóc tách Bearer token từ Request Header, tra cứu thông tin tài khoản và kiểm tra quyền hạn (Role).
 */
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

    /**
     * Lấy thông tin user nếu có gửi kèm token hợp lệ; nếu không gửi token thì trả về null (dành cho Public API).
     */
    public SystemAccount optionalUser(String authorization) {
        if (authorization == null || authorization.isBlank()) {
            return null;
        }
        return requireUser(authorization);
    }

    /**
     * Bắt buộc request phải có token đăng nhập hợp lệ.
     * Cắt bỏ tiền tố "Bearer " để lấy token, tra cứu accountId trong SessionService,
     * sau đó lấy thông tin SystemAccount từ database.
     * Ném mã lỗi 401 UNAUTHORIZED nếu chưa đăng nhập hoặc token sai.
     */
    public SystemAccount requireUser(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
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

    /**
     * Bắt buộc người dùng phải có Role cụ thể (Role 1 = Admin, Role 2 = Staff).
     * Nếu sai Role, ném mã lỗi 403 FORBIDDEN.
     */
    public SystemAccount requireRole(String authorization, int role) {
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
