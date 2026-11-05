package com.funews.assignment2.repository;

import com.funews.assignment2.entity.SystemAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * Nguyễn Duy Khang - CE192012 - Assignment 2
 * Interface này chịu trách nhiệm tương tác trực tiếp với bảng SystemAccount trong MS SQL Server.
 * Kế thừa JpaRepository để thừa hưởng sẵn các phương thức CRUD chuẩn (save, findById, delete,...)
 * và định nghĩa thêm các phương thức truy vấn dẫn xuất (derived query methods).
 */
public interface AccountRepository extends JpaRepository<SystemAccount, Short> {

    // Tìm kiếm tài khoản theo email chính xác (không phân biệt chữ hoa/thường) - phục vụ đăng nhập
    Optional<SystemAccount> findByAccountEmailIgnoreCase(String email);

    // Kiểm tra email đã tồn tại hay chưa (dùng khi tạo mới tài khoản để chống trùng lặp)
    boolean existsByAccountEmailIgnoreCase(String email);

    // Kiểm tra email có trùng với tài khoản khác không (dùng khi cập nhật, trừ chính tài khoản hiện tại)
    boolean existsByAccountEmailIgnoreCaseAndAccountIdNot(String email, Short id);

    // Tìm tài khoản có AccountID lớn nhất để tính toán tạo mã ID kế tiếp (ID tự tăng thủ công)
    Optional<SystemAccount> findTopByOrderByAccountIdDesc();

    // Tìm kiếm danh sách tài khoản theo tên hoặc email chứa từ khóa tìm kiếm (search gần đúng)
    List<SystemAccount> findByAccountNameContainingIgnoreCaseOrAccountEmailContainingIgnoreCase(
            String name, String email
    );
}
