package com.funews.assignment2.repository;


import com.funews.assignment2.entity.NewsArticle;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NewsArticleRepository
        extends JpaRepository<NewsArticle, String> {

    boolean existsByCreatedBy_AccountId(Short accountId);

    boolean existsByCategory_CategoryId(Short categoryId);

    List<NewsArticle>
    findByCreatedBy_AccountIdOrderByCreatedDateDesc(Short accountId);

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
