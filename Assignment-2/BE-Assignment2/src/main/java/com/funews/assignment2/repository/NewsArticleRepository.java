package com.funews.assignment2.repository;

import com.funews.assignment2.entity.NewsArticle;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Nguyễn Duy Khang - CE192012 - Assignment 2
 * Interface này xử lý các thao tác dữ liệu liên quan đến bài viết (NewsArticle).
 * Cung cấp các câu lệnh kiểm tra ràng buộc khóa ngoại và câu truy vấn tìm kiếm tổng hợp (JPQL).
 */
public interface NewsArticleRepository extends JpaRepository<NewsArticle, String> {

    // Kiểm tra xem tài khoản có ID này đã từng tạo bài báo nào chưa
    // Ràng buộc nghiệp vụ: Admin không thể xóa tài khoản nếu đã từng tạo bài báo
    boolean existsByCreatedBy_AccountId(Short accountId);

    // Kiểm tra xem danh mục có ID này đang được bài báo nào sử dụng hay không
    // Ràng buộc nghiệp vụ: Staff không thể xóa danh mục nếu đang có bài báo tham chiếu
    boolean existsByCategory_CategoryId(Short categoryId);

    // Lấy toàn bộ danh sách bài báo do một Staff cụ thể tạo ra, sắp xếp theo ngày tạo mới nhất (My News History)
    List<NewsArticle> findByCreatedBy_AccountIdOrderByCreatedDateDesc(Short accountId);

    // Câu truy vấn tùy biến (JPQL) tìm kiếm đa tiêu chí:
    // - Từ khóa xuất hiện trong Tiêu đề (newsTitle), Headline hoặc Nội dung (newsContent)
    // - Lọc theo danh mục nếu có categoryId
    // - Lọc theo trạng thái active (activeOnly = true cho khách vãng lai và admin)
    // - Lọc theo người tạo nếu có createdById
    @Query("""
        SELECT DISTINCT n
        FROM NewsArticle n
        LEFT JOIN n.category c
        LEFT JOIN n.createdBy a
        WHERE
        (
            :keyword IS NULL
            OR LOWER(COALESCE(n.newsTitle, ''))
                LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(n.headline)
                LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(COALESCE(n.newsContent, ''))
                LIKE LOWER(CONCAT('%', :keyword, '%'))
        )
        AND (:categoryId IS NULL OR c.categoryId = :categoryId)
        AND (:activeOnly = FALSE OR n.newsStatus = TRUE)
        AND (:createdById IS NULL OR a.accountId = :createdById)
        ORDER BY n.createdDate DESC
    """)
    List<NewsArticle> searchArticles(
            @Param("keyword") String keyword,
            @Param("categoryId") Short categoryId,
            @Param("activeOnly") boolean activeOnly,
            @Param("createdById") Short createdById
    );
}
