package com.funews.assignment2.service;

import com.funews.assignment2.dto.ApiDtos.*;
import com.funews.assignment2.entity.Category;
import com.funews.assignment2.repository.CategoryRepository;
import com.funews.assignment2.repository.NewsArticleRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * Nguyễn Duy Khang - CE192012 - Assignment 2
 * Class này chứa nghiệp vụ quản lý danh mục bài viết (Category) dành cho Staff
 * và hỗ trợ truy vấn danh mục kích hoạt dành cho trang tin tức công khai.
 */
@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final NewsArticleRepository newsRepository;

    public CategoryService(
            CategoryRepository categoryRepository,
            NewsArticleRepository newsRepository
    ) {
        this.categoryRepository = categoryRepository;
        this.newsRepository = newsRepository;
    }

    // Chuyển đổi Entity Category sang DTO CategoryView
    private CategoryView toView(Category c) {
        return new CategoryView(
                c.getCategoryId(),
                c.getCategoryName(),
                c.getCategoryDescription(),
                c.getParentCategoryId(),
                c.getIsActive()
        );
    }

    /**
     * Lấy danh sách danh mục:
     * - activeOnly = true: Dành cho Public/Admin (chỉ xem các danh mục đang hoạt động).
     * - activeOnly = false: Dành cho Staff (xem tất cả để quản lý).
     * - Có hỗ trợ tìm kiếm theo tên hoặc mô tả.
     */
    public List<CategoryView> getAll(String search, boolean activeOnly) {
        List<Category> categories;

        if (search == null || search.isBlank()) {
            categories = categoryRepository.findAll();
        } else {
            categories = categoryRepository
                    .findByCategoryNameContainingIgnoreCaseOrCategoryDescriptionContainingIgnoreCase(
                            search, search
                    );
        }

        return categories.stream()
                .filter(c -> !activeOnly || Boolean.TRUE.equals(c.getIsActive()))
                .map(this::toView)
                .toList();
    }

    /**
     * Staff tạo mới một danh mục:
     * - Kiểm tra danh mục cha (parentCategoryId) nếu có phải tồn tại trong database.
     */
    @Transactional
    public CategoryView create(CategoryRequest request) {
        validateParent(request.parentCategoryId(), null);

        Category category = new Category();
        category.setCategoryName(request.categoryName());
        category.setCategoryDescription(request.categoryDescription());
        category.setParentCategoryId(request.parentCategoryId());
        category.setIsActive(request.isActive());

        return toView(categoryRepository.save(category));
    }

    /**
     * Staff cập nhật danh mục:
     * - Kiểm tra không cho phép chọn chính mình làm danh mục cha.
     */
    @Transactional
    public CategoryView update(Short id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Category not found"
                        )
                );

        validateParent(request.parentCategoryId(), id);

        category.setCategoryName(request.categoryName());
        category.setCategoryDescription(request.categoryDescription());
        category.setParentCategoryId(request.parentCategoryId());
        category.setIsActive(request.isActive());

        return toView(categoryRepository.save(category));
    }

    /**
     * Kiểm tra tính hợp lệ của danh mục cha:
     * 1. Không thể tự làm cha của chính mình (parentId == currentId).
     * 2. Danh mục cha phải thực sự tồn tại trong CSDL.
     */
    private void validateParent(Short parentId, Short currentId) {
        if (parentId == null) {
            return;
        }

        if (parentId.equals(currentId)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Category cannot be its own parent"
            );
        }

        if (!categoryRepository.existsById(parentId)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Parent category does not exist"
            );
        }
    }

    /**
     * Staff xóa danh mục:
     * - RÀNG BUỘC 1: Nếu danh mục đang có bài viết sử dụng (existsByCategory_CategoryId) -> ném 409 CONFLICT.
     * - RÀNG BUỘC 2: Nếu danh mục đang là cha của danh mục khác (existsByParentCategoryId) -> ném 409 CONFLICT.
     */
    @Transactional
    public void delete(Short id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Category not found"
                        )
                );

        if (newsRepository.existsByCategory_CategoryId(id)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Cannot delete category used by news articles"
            );
        }

        if (categoryRepository.existsByParentCategoryId(id)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Cannot delete category that has child categories"
            );
        }

        categoryRepository.delete(category);
    }
}
