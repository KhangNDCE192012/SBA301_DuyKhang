package com.funews.assignment2.service;

import com.funews.assignment2.dto.ApiDtos.*;
import com.funews.assignment2.entity.SystemAccount;
import com.funews.assignment2.repository.AccountRepository;
import com.funews.assignment2.security.SessionService;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/**
 * Nguyễn Duy Khang - CE192012 - Assignment 2
 * Class này chứa nghiệp vụ xác thực người dùng bao gồm đăng nhập (Login) và đăng xuất (Logout).
 */
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

    /** =========================================================
     * Xử lý LOGIN:
     * 1. Tìm tài khoản theo email (không phân biệt hoa thường).
     * 2. Đối chiếu mật khẩu (plain text).
     * 3. Kiểm tra Role hợp lệ (1: Admin, 2: Staff).
     * 4. Tạo token session và trả về LoginResponse (gồm token và AccountView - ẩn mật khẩu).
     */
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

        // Tạo token phiên đăng nhập
        String token = sessionService.createSession(account.getAccountId());

        // Chuyển đổi sang DTO AccountView để che giấu mật khẩu
        AccountView view = new AccountView(
                account.getAccountId(),
                account.getAccountName(),
                account.getAccountEmail(),
                account.getAccountRole()
        );

        return new LoginResponse(token, view);
    }

    /** =======================================================
     * Xử lý LOGOUT:
     * Lấy token từ header Authorization và xóa khỏi SessionService để kết thúc phiên làm việc.
     */
    public void logout(String authorization) {
        if (authorization != null && authorization.startsWith("Bearer ")) {
            String token = authorization.substring(7);
            sessionService.removeSession(token);
        }
    }
}
