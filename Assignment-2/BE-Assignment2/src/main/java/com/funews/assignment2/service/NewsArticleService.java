package com.funews.assignment2.service;

import com.funews.assignment2.dto.ApiDtos.*;
import com.funews.assignment2.entity.*;
import com.funews.assignment2.repository.*;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.*;

/**
 * Nguyễn Duy Khang - CE192012 - Assignment 2
 * Class này chứa toàn bộ nghiệp vụ quản lý bài viết tin tức (NewsArticle):
 * - Tìm kiếm, lọc theo danh mục, trạng thái active/inactive
 * - Tạo bài viết kèm mã UUID và gán quan hệ nhiều-nhiều với Tag
 * - Cập nhật, xóa bài viết
 * - Truy vấn lịch sử tạo bài viết của chính Staff đang đăng nhập (My History)
 */
@Service
public class NewsArticleService {

    private final NewsArticleRepository newsRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;

    public NewsArticleService(
            NewsArticleRepository newsRepository,
            CategoryRepository categoryRepository,
            TagRepository tagRepository
    ) {
        this.newsRepository = newsRepository;
        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
    }

    // Chuyển Entity NewsArticle sang DTO NewsView (bao gồm cả danh sách TagView)
    private NewsView toView(NewsArticle n) {
        List<TagView> tags = n.getTags()
                .stream()
                .map(t -> new TagView(
                        t.getTagId(),
                        t.getTagName(),
                        t.getNote()
                ))
                .toList();

        return new NewsView(
                n.getNewsArticleId(),
                n.getNewsTitle(),
                n.getHeadline(),
                n.getCreatedDate(),
                n.getNewsContent(),
                n.getNewsSource(),
                n.getCategory() == null ? null : n.getCategory().getCategoryId(),
                n.getCategory() == null ? null : n.getCategory().getCategoryName(),
                n.getNewsStatus(),
                n.getCreatedBy() == null ? null : n.getCreatedBy().getAccountId(),
                n.getCreatedBy() == null ? null : n.getCreatedBy().getAccountName(),
                n.getModifiedDate(),
                tags
        );
    }

    /** ======================================================================
     * LẤY DANH SÁCH BÀI VIẾT đa tiêu chí:
     * - Khách vãng lai (currentUser == null) hoặc Admin (Role 1): CHỈ được xem bài active (newsStatus = true).
     * - Staff (Role 2): Được xem toàn bộ bài viết (kể cả inactive) để quản lý.
     */
    @Transactional(readOnly = true)
    public List<NewsView> getAll(
            String search,
            Short categoryId,
            Boolean activeOnly,
            SystemAccount currentUser
    ) {
        boolean publicUser =
                currentUser == null ||
                        Integer.valueOf(1).equals(currentUser.getAccountRole());

        if (currentUser != null &&
                !publicUser &&
                !Integer.valueOf(2).equals(currentUser.getAccountRole())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Invalid role"
            );
        }

        boolean filterActive = publicUser || Boolean.TRUE.equals(activeOnly);

        return newsRepository
                .searchArticles(search, categoryId, filterActive, null)
                .stream()
                .map(this::toView)
                .toList();
    }

    /** ==========================================
     * LẤY CHI TIẾT MỘT BÀI VIẾT THEO ID:
     * Khách vãng lai không được phép xem các bài viết có trạng thái inactive.
     */
    @Transactional(readOnly = true)
    public NewsView getById(String id, SystemAccount currentUser) {
        NewsArticle article = newsRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "News article not found"
                        )
                );

        boolean publicUser =
                currentUser == null ||
                        Integer.valueOf(1).equals(currentUser.getAccountRole());

        if (publicUser && !Boolean.TRUE.equals(article.getNewsStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "News article not found"
            );
        }

        return toView(article);
    }

    /** ===============================================================
     * STAFF TẠO BÀI VIẾT MỚI:
     * 1. Kiểm tra danh mục có tồn tại không.
     * 2. Sinh mã ID ngẫu nhiên: "N" + 19 ký tự UUID (ví dụ: N4a8f2b3c9d1e5f6a7b).
     * 3. Gán thời gian tạo hiện tại và người tạo là Staff đang đăng nhập.
     * 4. Gán danh sách Tag (quan hệ nhiều - nhiều).
     */
    @Transactional
    public NewsView create(NewsRequest request, SystemAccount currentUser) {
        Category category = categoryRepository.findById(
                request.categoryId()
        ).orElseThrow(() ->
                new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Category does not exist"
                )
        );

        NewsArticle article = new NewsArticle();

        article.setNewsArticleId(
                "N" + UUID.randomUUID()
                        .toString()
                        .replace("-", "")
                        .substring(0, 19)
        );

        article.setNewsTitle(request.newsTitle());
        article.setHeadline(request.headline());
        article.setNewsContent(request.newsContent());
        article.setNewsSource(request.newsSource());
        article.setCategory(category);
        article.setNewsStatus(request.newsStatus());

        article.setCreatedDate(LocalDateTime.now());
        article.setCreatedBy(currentUser);
        article.setUpdatedById(currentUser.getAccountId());

        article.setTags(getTags(request.tagIds()));

        return toView(newsRepository.save(article));
    }

    /** ========================================================================
     * STAFF UPDATE BÀI VIẾT:
     * Cập nhật thông tin nội dung, danh mục, trạng thái, ngày sửa (ModifiedDate) và danh sách tags.
     */
    @Transactional
    public NewsView update(
            String id,
            NewsRequest request,
            SystemAccount currentUser
    ) {
        NewsArticle article = newsRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "News article not found"
                        )
                );

        Category category = categoryRepository.findById(
                request.categoryId()
        ).orElseThrow(() ->
                new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Category does not exist"
                )
        );

        article.setNewsTitle(request.newsTitle());
        article.setHeadline(request.headline());
        article.setNewsContent(request.newsContent());
        article.setNewsSource(request.newsSource());
        article.setCategory(category);
        article.setNewsStatus(request.newsStatus());

        article.setUpdatedById(currentUser.getAccountId());
        article.setModifiedDate(LocalDateTime.now());

        article.setTags(getTags(request.tagIds()));

        return toView(newsRepository.save(article));
    }

    // Tra cứu danh sách Tag từ CSDL theo Set ID truyền lên
    private Set<Tag> getTags(Set<Integer> tagIds) {
        if (tagIds == null || tagIds.isEmpty()) {
            return new HashSet<>();
        }

        List<Tag> found = tagRepository.findAllById(tagIds);

        if (found.size() != tagIds.size()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "One or more tags do not exist"
            );
        }

        return new HashSet<>(found);
    }

    /** ===================================================================
     * STAFF XÓA BÀI VIẾT:
     * Xóa các liên kết trong bảng trung gian NewsTag trước, sau đó xóa bài viết khỏi bảng NewsArticle.
     */
    @Transactional
    public void delete(String id) {
        NewsArticle article = newsRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "News article not found"
                        )
                );

        article.getTags().clear();
        newsRepository.delete(article);
    }

    /** ============================================
     * Lấy lịch sử tất cả bài viết do chính Staff đang đăng nhập tạo ra, sắp xếp giảm dần theo ngày tạo.
     */
    @Transactional(readOnly = true)
    public List<NewsView> getMyHistory(SystemAccount currentUser) {
        return newsRepository
                .findByCreatedBy_AccountIdOrderByCreatedDateDesc(
                        currentUser.getAccountId()
                )
                .stream()
                .map(this::toView)
                .toList();
    }
}
