package com.funews.assignment2.entity;


import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.Set;

/**
 * Nguyễn Duy Khang - CE192012 - Assignment 2
 * Entity đại diện cho bảng NewsArticle trong cơ sở dữ liệu.
 * Lưu trữ toàn bộ thông tin bài viết tin tức bao gồm nội dung, danh mục,
 * trạng thái đăng (active/inactive), người tạo và danh sách tag.
 * Có quan hệ ManyToOne với Category và SystemAccount,
 * quan hệ ManyToMany với Tag thông qua bảng trung gian NewsTag.
 */
@Entity
@Table(name = "NewsArticle")
public class NewsArticle {

    // Khóa chính dạng String (ví dụ: "N" + UUID), độ dài tối đa 20 ký tự
    @Id
    @Column(name = "NewsArticleID", length = 20)
    private String newsArticleId;

    // Tiêu đề bài viết, tối đa 400 ký tự
    @Column(name = "NewsTitle", length = 400)
    private String newsTitle;

    // Tóm tắt/dòng tít bài viết, bắt buộc, tối đa 150 ký tự
    @Column(name = "Headline", length = 150, nullable = false)
    private String headline;

    // Thời điểm bài viết được tạo
    @Column(name = "CreatedDate")
    private LocalDateTime createdDate;

    // Nội dung chính của bài viết, tối đa 4000 ký tự
    @Column(name = "NewsContent", length = 4000)
    private String newsContent;

    // Nguồn tin tức tham khảo, tối đa 400 ký tự
    @Column(name = "NewsSource", length = 400)
    private String newsSource;

    // Quan hệ ManyToOne: nhiều bài viết thuộc một danh mục
    // LAZY = chỉ tải dữ liệu danh mục khi thực sự cần
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CategoryID")
    private Category category;

    // Trạng thái bài viết: true = active (đã đăng), false = inactive (ẩn)
    @Column(name = "NewsStatus")
    private Boolean newsStatus;

    // Quan hệ ManyToOne: nhiều bài viết được tạo bởi một tài khoản (Staff)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CreatedByID")
    private SystemAccount createdBy;

    // ID người cập nhật lần cuối (chỉ lưu ID, không join entity)
    @Column(name = "UpdatedByID")
    private Short updatedById;

    // Thời điểm bài viết được sửa đổi lần cuối
    @Column(name = "ModifiedDate")
    private LocalDateTime modifiedDate;

    // Quan hệ ManyToMany với Tag thông qua bảng trung gian NewsTag
    // LinkedHashSet đảm bảo thứ tự chèn vào được giữ nguyên
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "NewsTag",
            joinColumns = @JoinColumn(name = "NewsArticleID"),
            inverseJoinColumns = @JoinColumn(name = "TagID")
    )
    private Set<Tag> tags = new LinkedHashSet<>();

    // Constructor mặc định, bắt buộc có để JPA có thể tạo instance
    public NewsArticle() {
    }

    // Getter và Setter cho newsArticleId
    public String getNewsArticleId() {
        return newsArticleId;
    }

    public void setNewsArticleId(String newsArticleId) {
        this.newsArticleId = newsArticleId;
    }

    // Getter và Setter cho newsTitle
    public String getNewsTitle() {
        return newsTitle;
    }

    public void setNewsTitle(String newsTitle) {
        this.newsTitle = newsTitle;
    }

    // Getter và Setter cho headline (tóm tắt)
    public String getHeadline() {
        return headline;
    }

    public void setHeadline(String headline) {
        this.headline = headline;
    }

    // Getter và Setter cho createdDate (ngày tạo)
    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    // Getter và Setter cho newsContent (nội dung bài viết)
    public String getNewsContent() {
        return newsContent;
    }

    public void setNewsContent(String newsContent) {
        this.newsContent = newsContent;
    }

    // Getter và Setter cho newsSource (nguồn tin)
    public String getNewsSource() {
        return newsSource;
    }

    public void setNewsSource(String newsSource) {
        this.newsSource = newsSource;
    }

    // Getter và Setter cho category (danh mục của bài viết)
    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    // Getter và Setter cho newsStatus (true = hiển thị, false = ẩn)
    public Boolean getNewsStatus() {
        return newsStatus;
    }

    public void setNewsStatus(Boolean newsStatus) {
        this.newsStatus = newsStatus;
    }

    // Getter và Setter cho createdBy (tài khoản Staff tạo bài)
    public SystemAccount getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(SystemAccount createdBy) {
        this.createdBy = createdBy;
    }

    // Getter và Setter cho updatedById (ID người cập nhật lần cuối)
    public Short getUpdatedById() {
        return updatedById;
    }

    public void setUpdatedById(Short updatedById) {
        this.updatedById = updatedById;
    }

    // Getter và Setter cho modifiedDate (ngày sửa đổi lần cuối)
    public LocalDateTime getModifiedDate() {
        return modifiedDate;
    }

    public void setModifiedDate(LocalDateTime modifiedDate) {
        this.modifiedDate = modifiedDate;
    }

    // Getter và Setter cho tags (danh sách tag gắn với bài viết)
    public Set<Tag> getTags() {
        return tags;
    }

    public void setTags(Set<Tag> tags) {
        this.tags = tags;
    }
}
