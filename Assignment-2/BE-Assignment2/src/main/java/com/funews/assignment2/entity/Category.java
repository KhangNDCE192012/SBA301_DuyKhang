package com.funews.assignment2.entity;

import jakarta.persistence.*;

/**
 * Nguyễn Duy Khang - CE192012 - Assignment 2
 * Entity đại diện cho bảng Category trong cơ sở dữ liệu.
 * Mỗi danh mục có thể có danh mục cha (parentCategoryId) để tạo cây phân cấp.
 * Trường isActive kiểm soát việc hiển thị danh mục với người dùng công khai.
 */
@Entity
@Table(name = "Category")
public class Category {

    // Khóa chính - tự động tăng (IDENTITY trong SQL Server)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CategoryID")
    private Short categoryId;

    // Tên danh mục, bắt buộc nhập, tối đa 100 ký tự
    @Column(name = "CategoryName", length = 100, nullable = false)
    private String categoryName;

    // Giữ đúng tên cột trong SQL script (lỗi đánh máy "Desciption" thay vì "Description")
    @Column(name = "CategoryDesciption", length = 250, nullable = false)
    private String categoryDescription;

    // ID của danh mục cha - null nếu là danh mục gốc
    @Column(name = "ParentCategoryID")
    private Short parentCategoryId;

    // Trạng thái hoạt động: true = hiện thị, false = ẩn với public user và Admin
    @Column(name = "IsActive")
    private Boolean isActive;

    // Constructor mặc định, bắt buộc có để JPA có thể tạo instance
    public Category() {
    }

    // Getter và Setter cho categoryId
    public Short getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Short categoryId) {
        this.categoryId = categoryId;
    }

    // Getter và Setter cho categoryName
    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    // Getter và Setter cho categoryDescription
    public String getCategoryDescription() {
        return categoryDescription;
    }

    public void setCategoryDescription(String categoryDescription) {
        this.categoryDescription = categoryDescription;
    }

    // Getter và Setter cho parentCategoryId (ID danh mục cha)
    public Short getParentCategoryId() {
        return parentCategoryId;
    }

    public void setParentCategoryId(Short parentCategoryId) {
        this.parentCategoryId = parentCategoryId;
    }

    // Getter và Setter cho isActive (trạng thái hoạt động)
    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean active) {
        isActive = active;
    }
}
