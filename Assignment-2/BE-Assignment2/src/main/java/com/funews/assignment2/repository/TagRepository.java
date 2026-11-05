package com.funews.assignment2.repository;

import com.funews.assignment2.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Nguyễn Duy Khang - CE192012 - Assignment 2
 * Interface này tương tác với bảng Tag trong cơ sở dữ liệu.
 * Sử dụng các hàm mặc định của JpaRepository để lấy danh sách tag hoặc tìm kiếm tag theo ID.
 */
public interface TagRepository extends JpaRepository<Tag, Integer> {
}
