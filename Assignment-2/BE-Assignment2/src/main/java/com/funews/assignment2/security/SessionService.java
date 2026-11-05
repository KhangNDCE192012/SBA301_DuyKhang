package com.funews.assignment2.security;

import org.springframework.stereotype.Service;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Nguyễn Duy Khang - CE192012 - Assignment 2
 * Class này quản lý session token đăng nhập của người dùng trong bộ nhớ RAM.
 * Sử dụng cấu trúc ConcurrentHashMap (Thread-safe) để ánh xạ token (UUID) với ID tài khoản (accountId).
 */
@Service
public class SessionService {

    // Map lưu trữ: key là token chuỗi UUID, value là accountId của người dùng
    private final ConcurrentHashMap<String, Short> sessions = new ConcurrentHashMap<>();

    /**
     * Tạo một phiên đăng nhập mới khi user xác thực thành công.
     * Sinh mã UUID ngẫu nhiên duy nhất làm token và lưu vào map.
     */
    public String createSession(Short accountId) {
        String token = UUID.randomUUID().toString();
        sessions.put(token, accountId);
        return token;
    }

    /**
     * Lấy accountId từ token truyền vào. Trả về null nếu token không hợp lệ hoặc đã hết hạn.
     */
    public Short getAccountId(String token) {
        return sessions.get(token);
    }

    /**
     * Hủy phiên đăng nhập khi user bấm Đăng xuất (Logout).
     * Xóa token khỏi map để vô hiệu hóa các request tiếp theo.
     */
    public void removeSession(String token) {
        sessions.remove(token);
    }
}
