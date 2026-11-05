package com.funews.assignment2.entity;


import jakarta.persistence.*;

/**
 * Nguyễn Duy Khang - CE192012 - Assignment 2
 * Entity đại diện cho bảng Tag trong cơ sở dữ liệu.
 * Tag được gắn vào bài viết (NewsArticle) thông qua bảng trung gian NewsTag.
 * Quan hệ ManyToMany: một bài viết có nhiều tag, một tag thuộc nhiều bài viết.
 */
@Entity
@Table(name = "Tag")
public class Tag {

    // Khóa chính - ID của tag (không tự tăng, lấy từ dữ liệu có sẵn)
    @Id
    @Column(name = "TagID")
    private Integer tagId;

    // Tên tag hiển thị, tối đa 50 ký tự
    @Column(name = "TagName", length = 50)
    private String tagName;

    // Ghi chú bổ sung về tag, tối đa 400 ký tự
    @Column(name = "Note", length = 400)
    private String note;

    // Constructor mặc định, bắt buộc có để JPA có thể tạo instance
    public Tag() {
    }

    // Getter và Setter cho tagId
    public Integer getTagId() {
        return tagId;
    }

    public void setTagId(Integer tagId) {
        this.tagId = tagId;
    }

    // Getter và Setter cho tagName
    public String getTagName() {
        return tagName;
    }

    public void setTagName(String tagName) {
        this.tagName = tagName;
    }

    // Getter và Setter cho note (ghi chú)
    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
