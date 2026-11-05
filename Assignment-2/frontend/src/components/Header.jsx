/**
 * Nguyễn Duy Khang - CE192012 - Assignment 2
 * Component Header hiển thị thanh điều hướng chung của ứng dụng:
 * - Logo / Brand FU Newsroom dẫn về trang chủ "/"
 * - Menu động theo vai trò: Admin thấy "Accounts", Staff thấy "Categories", "Articles", "My History", "My Profile"
 * - Nút Login dẫn tới "/login" nếu chưa đăng nhập, hoặc hiển thị tên user kèm nút "Logout" nếu đã đăng nhập
 */

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {

    // Lấy thông tin user hiện tại và hàm logout từ AuthContext
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Xử lý đăng xuất: gọi logout() từ AuthContext rồi chuyển hướng về trang chủ "/"
    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (

        <header className="site-header">

            {/* Logo và tên trang báo */}
            <Link to="/" className="brand">
                <span className="brand-icon">F</span>

                <span>
                    <strong>FU NEWSROOM</strong>
                    <small>UNIVERSITY MEDIA</small>
                </span>
            </Link>

            {/* Menu điều hướng chính */}
            <nav className="main-nav">

                <Link to="/">News</Link>

                {/* Menu dành riêng cho Admin (Role = 1): Quản lý tài khoản */}
                {user?.accountRole === 1 && (
                    <Link to="/admin/accounts">
                        Accounts
                    </Link>
                )}

                {/* Menu dành riêng cho Staff (Role = 2): Quản lý danh mục, bài viết, lịch sử, profile */}
                {user?.accountRole === 2 && (
                    <>
                        <Link to="/staff/categories">
                            Categories
                        </Link>

                        <Link to="/staff/news">
                            Articles
                        </Link>

                        <Link to="/staff/history">
                            My History
                        </Link>

                        <Link to="/staff/profile">
                            My Profile
                        </Link>
                    </>
                )}

            </nav>

            {/* Khu vực bên phải header: hiển thị tên user + nút Logout hoặc nút Login */}
            <div className="header-right">

                {user ? (

                    <>
                        {/* Hiển thị tên người dùng đang đăng nhập */}
                        <span className="user-label">
                            {user.accountName}
                        </span>

                        {/* Nút Logout: click -> handleLogout() -> logout() -> về trang chủ */}
                        <button
                            className="btn-secondary"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>

                ) : (

                    /* Nếu chưa đăng nhập, hiển thị nút Staff Login dẫn đến /login */
                    <Link
                        to="/login"
                        className="btn-primary"
                    >
                        Staff Login
                    </Link>

                )}

            </div>

        </header>
    );
}
