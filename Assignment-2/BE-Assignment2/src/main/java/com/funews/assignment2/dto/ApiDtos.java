package com.funews.assignment2.dto;

import jakarta.validation.constraints.*;
import java.util.Set;
import java.util.List;
import java.time.LocalDateTime;

/**
 * Nguyễn Duy Khang - CE192012 - Assignment 2
 * Lớp chứa tất cả các DTO (Data Transfer Object) dùng cho API.
 * Sử dụng Java Record để định nghĩa các DTO bất biến (immutable),
 * giúp truyền dữ liệu giữa Controller và Service một cách gọn gàng.
 * Tất cả các record đều có validation annotation để kiểm tra dữ liệu đầu vào.
 */
public class ApiDtos {

    /**
     * DTO nhận thông tin đăng nhập từ client.
     * Dùng tại: POST /api/auth/login
     * Controller gọi: AuthController.login() -> AuthService.login()
     */
    public record LoginRequest(
            @NotBlank @Email String email,       // Email phải đúng định dạng và không rỗng
            @NotBlank String password             // Mật khẩu không được rỗng
    ) {}

    /**
     * DTO hiển thị thông tin tài khoản (không bao gồm mật khẩu).
     * Trả về trong response khi đăng nhập hoặc quản lý tài khoản.
     */
    public record AccountView(
            Short accountId,       // ID tài khoản
            String accountName,    // Tên tài khoản
            String accountEmail,   // Email tài khoản
            Integer accountRole    // Vai trò: 1=Admin, 2=Staff
    ) {}

    /**
     * DTO trả về sau khi đăng nhập thành công.
     * Chứa token phiên làm việc và thông tin tài khoản.
     * Client lưu token này vào localStorage và gửi kèm trong header Authorization.
     */
    public record LoginResponse(
            String token,          // Token phiên (UUID), dùng trong header "Bearer <token>"
            AccountView account    // Thông tin tài khoản vừa đăng nhập
    ) {}

    /**
     * DTO nhận dữ liệu khi Admin tạo hoặc cập nhật tài khoản.
     * Dùng tại: POST /api/accounts, PUT /api/accounts/{id}
     * Khi tạo mới: accountPassword bắt buộc. Khi cập nhật: có thể để trống.
     */
    public record AccountRequest(
            @NotBlank
            @Size(max = 100)
            String accountName,     // Tên tài khoản, tối đa 100 ký tự

            @NotBlank
            @Email
            @Size(max = 70)
            String accountEmail,    // Email, phải đúng định dạng, tối đa 70 ký tự

            @NotNull
            @Min(1)
            @Max(2)
            Integer accountRole,    // Vai trò: chỉ chấp nhận 1 (Admin) hoặc 2 (Staff)

            @Size(max = 70)
            String accountPassword  // Mật khẩu, tối đa 70 ký tự (tùy chọn khi cập nhật)
    ) {}

    /**
     * DTO nhận dữ liệu khi Staff cập nhật thông tin cá nhân (profile).
     * Dùng tại: PUT /api/accounts/profile
     * Không cho phép thay đổi vai trò (role) của chính mình.
     */
    public record ProfileRequest(
            @NotBlank
            @Size(max = 100)
            String accountName,    // Tên mới của tài khoản

            @NotBlank
            @Email
            @Size(max = 70)
            String accountEmail,   // Email mới (phải chưa được dùng bởi tài khoản khác)

            @Size(max = 70)
            String accountPassword // Mật khẩu mới (tùy chọn, để trống = không đổi mật khẩu)
    ) {}

    /**
     * DTO nhận dữ liệu khi Staff tạo hoặc cập nhật danh mục.
     * Dùng tại: POST /api/categories, PUT /api/categories/{id}
     */
    public record CategoryRequest(
            @NotBlank
            @Size(max = 100)
            String categoryName,          // Tên danh mục, tối đa 100 ký tự

            @NotBlank
            @Size(max = 250)
            String categoryDescription,   // Mô tả danh mục, tối đa 250 ký tự

            Short parentCategoryId,       // ID danh mục cha (null nếu là danh mục gốc)

            @NotNull
            Boolean isActive              // Trạng thái: true=hiện, false=ẩn
    ) {}

    /**
     * DTO hiển thị thông tin danh mục trong response.
     * Trả về tại: GET /api/categories
     */
    public record CategoryView(
            Short categoryId,            // ID danh mục
            String categoryName,         // Tên danh mục
            String categoryDescription,  // Mô tả
            Short parentCategoryId,      // ID danh mục cha (null nếu là gốc)
            Boolean isActive             // Trạng thái hoạt động
    ) {}

    /**
     * DTO hiển thị thông tin tag trong response.
     * Trả về tại: GET /api/tags và nhúng trong NewsView.
     */
    public record TagView(
            Integer tagId,    // ID tag
            String tagName,   // Tên tag
            String note       // Ghi chú về tag
    ) {}

    /**
     * DTO nhận dữ liệu khi Staff tạo hoặc cập nhật bài viết.
     * Dùng tại: POST /api/news-articles, PUT /api/news-articles/{id}
     */
    public record NewsRequest(
            @NotBlank
            @Size(max = 400)
            String newsTitle,     // Tiêu đề bài viết, tối đa 400 ký tự

            @NotBlank
            @Size(max = 150)
            String headline,      // Tóm tắt/dòng tít, tối đa 150 ký tự

            @NotBlank
            @Size(max = 4000)
            String newsContent,   // Nội dung chính, tối đa 4000 ký tự

            @Size(max = 400)
            String newsSource,    // Nguồn tin (tùy chọn), tối đa 400 ký tự

            @NotNull
            Short categoryId,     // ID danh mục bắt buộc chọn

            @NotNull
            Boolean newsStatus,   // Trạng thái: true=active/đăng, false=inactive/ẩn

            Set<Integer> tagIds   // Danh sách ID các tag (có thể rỗng hoặc null)
    ) {}

    /**
     * DTO hiển thị thông tin đầy đủ của một bài viết trong response.
     * Trả về tại: GET /api/news-articles, GET /api/news-articles/{id}
     * Bao gồm cả thông tin danh mục và danh sách tag đầy đủ.
     */
    public record NewsView(
            String newsArticleId,        // ID bài viết (dạng "N" + UUID)
            String newsTitle,            // Tiêu đề bài viết
            String headline,             // Tóm tắt/dòng tít
            LocalDateTime createdDate,   // Ngày tạo bài viết
            String newsContent,          // Nội dung bài viết
            String newsSource,           // Nguồn tin
            Short categoryId,            // ID danh mục
            String categoryName,         // Tên danh mục (để frontend hiển thị, không cần gọi thêm API)
            Boolean newsStatus,          // Trạng thái bài viết
            Short createdById,           // ID tài khoản Staff tạo bài
            String createdByName,        // Tên Staff tạo bài (để frontend hiển thị)
            LocalDateTime modifiedDate,  // Ngày sửa đổi lần cuối
            List<TagView> tags           // Danh sách tag của bài viết
    ) {}
}
