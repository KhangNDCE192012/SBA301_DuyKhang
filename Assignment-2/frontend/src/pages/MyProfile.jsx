/**
 * Nguyễn Duy Khang - CE192012 - Assignment 2
 * Màn hình Cập nhật hồ sơ cá nhân (MyProfile.jsx) dành cho Staff (Role 2):
 * Cho phép nhân viên cập nhật thông tin của chính mình (Họ tên, Email, Mật khẩu mới).
 * Khi cập nhật thành công, đồng bộ dữ liệu vào AuthContext và localStorage.
 */

import { useState } from "react";

import { useAuth } from "../context/AuthContext";
import accountService from "../services/accountService";

export default function MyProfile() {

    // Lấy thông tin user hiện tại và hàm cập nhật updateUser từ AuthContext
    const { user, updateUser } = useAuth();

    // State lưu trữ dữ liệu form chỉnh sửa profile
    const [form, setForm] = useState({
        accountName: user?.accountName || "",
        accountEmail: user?.accountEmail || "",
        accountPassword: "" // Để trống, nếu muốn đổi mật khẩu mới thì nhập
    });

    // Thông báo thành công hoặc lỗi
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    /**
     * Nút "Save Changes" click (Form onSubmit):
     * 1. Gọi accountService.updateProfile(form) -> PUT /api/accounts/profile
     * 2. Nhận thông tin AccountView mới từ backend.
     * 3. Gọi updateUser() để cập nhật lại AuthContext và localStorage (giúp Header hiển thị tên mới ngay lập tức).
     * 4. Hiển thị thông báo "Profile updated successfully."
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const updated = await accountService.updateProfile(form);

            // Đồng bộ dữ liệu mới vào AuthContext
            updateUser(updated);

            setForm({
                accountName: updated.accountName,
                accountEmail: updated.accountEmail,
                accountPassword: ""
            });

            setMessage("Profile updated successfully.");

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to update profile"
            );
        }
    };

    return (
        <main className="page-container">

            {/* Tiêu đề trang */}
            <div className="page-heading">
                <div>
                    <span className="eyebrow">PERSONAL SETTINGS</span>
                    <h1>My Profile</h1>
                    <p className="muted">Update your personal account information.</p>
                </div>
            </div>

            {/* Thẻ Card Profile */}
            <div className="profile-card">

                {/* Avatar hiển thị chữ cái đầu tiên của tên */}
                <div className="profile-avatar">
                    {user?.accountName?.charAt(0).toUpperCase()}
                </div>

                <h2>{user?.accountName}</h2>

                <span className="status-badge">
                    Staff Account
                </span>

                {/* Form chỉnh sửa thông tin */}
                <form onSubmit={handleSubmit}>

                    <label>Full Name</label>
                    <input
                        required
                        maxLength={100}
                        value={form.accountName}
                        onChange={e => setForm({
                            ...form,
                            accountName: e.target.value
                        })}
                    />

                    <label>Email</label>
                    <input
                        type="email"
                        required
                        maxLength={70}
                        value={form.accountEmail}
                        onChange={e => setForm({
                            ...form,
                            accountEmail: e.target.value
                        })}
                    />

                    <label>New Password</label>
                    <input
                        type="password"
                        maxLength={70}
                        placeholder="Leave blank to keep current password"
                        value={form.accountPassword}
                        onChange={e => setForm({
                            ...form,
                            accountPassword: e.target.value
                        })}
                    />

                    {/* Thông báo cập nhật thành công */}
                    {message && (
                        <p className="success-text">
                            {message}
                        </p>
                    )}

                    {/* Thông báo lỗi nếu có */}
                    {error && (
                        <p className="error-text">
                            {error}
                        </p>
                    )}

                    {/* NÚT LƯU THAY ĐỔI */}
                    <button
                        type="submit"
                        className="btn-primary full-width"
                    >
                        Save Changes
                    </button>

                </form>

            </div>

        </main>
    );
}
