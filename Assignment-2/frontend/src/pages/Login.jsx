/**
 * Nguyễn Duy Khang - CE192012 - Assignment 2
 * Màn hình Đăng nhập (Login.jsx):
 * Cho phép Admin (Role 1) và Staff (Role 2) nhập Email và Mật khẩu để xác thực vào hệ thống.
 * Sau khi đăng nhập thành công, điều hướng tự động:
 * - Admin -> /admin/accounts
 * - Staff -> /staff/news
 */

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Login() {

    // Lấy hàm login và trạng thái loading từ AuthContext
    const { login, loading } = useAuth();
    const navigate = useNavigate();

    // State lưu giá trị nhập từ Form
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // State hiển thị thông báo lỗi khi đăng nhập thất bại
    const [error, setError] = useState("");

    /**
     * Xử lý sự kiện khi người dùng nhấn nút "Sign in":
     * 1. Kiểm tra validation cơ bản (không để trống).
     * 2. Gọi hàm login() từ AuthContext (hàm này sẽ gọi authService.login -> axiosClient -> API /api/auth/login).
     * 3. Nhận về thông tin tài khoản và điều hướng trang dựa theo role.
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Ngăn trình duyệt reload trang
        setError("");

        if (!email.trim() || !password) {
            setError("Please enter email and password.");
            return;
        }

        try {
            // Gọi AuthContext.login() -> thực thi quy trình đăng nhập
            const account = await login(email, password);

            // Điều hướng theo phân quyền: Role 1 = Admin, Role 2 = Staff
            if (account.accountRole === 1) {
                navigate("/admin/accounts");
            } else if (account.accountRole === 2) {
                navigate("/staff/news");
            }

        } catch (err) {
            // Lấy thông báo lỗi trả về từ Backend hoặc hiển thị lỗi mặc định
            setError(
                err.response?.data?.message ||
                "Login failed. Please try again."
            );
        }
    };

    return (
        <main className="login-page">

            {/* Cột giới thiệu thương hiệu FUNews bên trái */}
            <div className="login-decoration">
                <span>FU</span>
                <h1>Stories that<br />move knowledge.</h1>
                <p>
                    University news, research and
                    campus stories in one place.
                </p>
            </div>

            {/* Form đăng nhập bên phải */}
            <div className="login-card">

                <span className="eyebrow">
                    STAFF PORTAL
                </span>

                <h2>Welcome back</h2>

                <p className="muted">
                    Sign in to manage university news.
                </p>

                {/* Form bắt sự kiện onSubmit gọi hàm handleSubmit */}
                <form onSubmit={handleSubmit}>

                    <label>Email address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />

                    {/* Hiển thị lỗi nếu có */}
                    {error && (
                        <p className="error-text">
                            {error}
                        </p>
                    )}

                    {/* Nút bấm Sign In */}
                    <button
                        type="submit"
                        className="btn-primary full-width"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>

                </form>

                {/* Link quay về trang tin tức công khai */}
                <Link to="/" className="back-link">
                    ← Back to public news
                </Link>

            </div>

        </main>
    );
}
