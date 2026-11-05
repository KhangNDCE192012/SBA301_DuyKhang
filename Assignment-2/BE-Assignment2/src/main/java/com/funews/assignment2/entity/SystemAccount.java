package com.funews.assignment2.entity;

import jakarta.persistence.*;

/**
 * Nguyễn Duy Khang - CE192012 - Assignment 2
 * Entity đại diện cho bảng SystemAccount trong cơ sở dữ liệu.
 * Lưu trữ thông tin tài khoản hệ thống bao gồm Admin (role=1) và Staff (role=2).
 * Được JPA/Hibernate ánh xạ tự động với bảng "SystemAccount" trong SQL Server.
 */
@Entity
@Table(name = "SystemAccount")
public class SystemAccount {

    // Khóa chính - ID tài khoản, kiểu Short (smallint trong SQL)
    @Id
    @Column(name = "AccountID")
    private Short accountId;

    // Tên hiển thị của tài khoản, tối đa 100 ký tự
    @Column(name = "AccountName", length = 100)
    private String accountName;

    // Địa chỉ email dùng để đăng nhập, tối đa 70 ký tự
    @Column(name = "AccountEmail", length = 70)
    private String accountEmail;

    // Vai trò tài khoản: 1 = Admin, 2 = Staff
    @Column(name = "AccountRole")
    private Integer accountRole;

    // Mật khẩu tài khoản (lưu plain text theo yêu cầu bài tập), tối đa 70 ký tự
    @Column(name = "AccountPassword", length = 70)
    private String accountPassword;

    // Constructor mặc định, bắt buộc có để JPA có thể tạo instance
    public SystemAccount() {
    }

    // Getter và Setter cho accountId
    public Short getAccountId() {
        return accountId;
    }

    public void setAccountId(Short accountId) {
        this.accountId = accountId;
    }

    // Getter và Setter cho accountName
    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    // Getter và Setter cho accountEmail
    public String getAccountEmail() {
        return accountEmail;
    }

    public void setAccountEmail(String accountEmail) {
        this.accountEmail = accountEmail;
    }

    // Getter và Setter cho accountRole (1=Admin, 2=Staff)
    public Integer getAccountRole() {
        return accountRole;
    }

    public void setAccountRole(Integer accountRole) {
        this.accountRole = accountRole;
    }

    // Getter và Setter cho accountPassword
    public String getAccountPassword() {
        return accountPassword;
    }

    public void setAccountPassword(String accountPassword) {
        this.accountPassword = accountPassword;
    }
}
