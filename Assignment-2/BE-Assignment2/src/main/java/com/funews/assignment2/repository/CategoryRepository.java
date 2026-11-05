package com.funews.assignment2.repository;

import com.funews.assignment2.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Nguyễn Duy Khang - CE192012 - Assignment 2
 * Interface này tương tác với bảng Category trong cơ sở dữ liệu.
 * Cung cấp các thao tác truy vấn, kiểm tra ràng buộc danh mục cha - con và tìm kiếm danh mục.
 */
public interface CategoryRepository extends JpaRepository<Category, Short> {

    // Tìm kiếm danh mục theo tên hoặc mô tả chứa từ khóa (không phân biệt hoa/thường)
    List<Category> findByCategoryNameContainingIgnoreCaseOrCategoryDescriptionContainingIgnoreCase(
            String name, String description
    );

    // Kiểm tra xem danh mục này có đang là cha của bất kỳ danh mục nào khác không
    // Ràng buộc nghiệp vụ: nếu có danh mục con thì KHÔNG được phép xóa
    boolean existsByParentCategoryId(Short parentId);
}
