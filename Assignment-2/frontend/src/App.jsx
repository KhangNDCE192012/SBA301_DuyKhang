/**
 * Nguyễn Duy Khang - CE192012 - Assignment 2
 * Component gốc của ứng dụng, chịu trách nhiệm định nghĩa toàn bộ
 * các route (đường dẫn) và điều hướng người dùng đến đúng trang.
 * Sử dụng ProtectedRoute để bảo vệ các trang cần đăng nhập/phân quyền.
 */

import {
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import { useAuth } from "./context/AuthContext";

import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

import PublicNews from "./pages/PublicNews";
import Login from "./pages/Login";
import AccountManagement from "./pages/AccountManagement";
import CategoryManagement from "./pages/CategoryManagement";
import NewsManagement from "./pages/NewsManagement";
import MyNewsHistory from "./pages/MyNewsHistory";
import MyProfile from "./pages/MyProfile";

export default function App() {

    // Lấy thông tin người dùng hiện tại từ AuthContext
    const { user } = useAuth();

    return (

        <>
            {/* Header*/}
            <Header />

            <Routes>

                {/* Trang chủ */}
                <Route
                    path="/"
                    element={<PublicNews />}
                />

                {/* Trang đăng nhập */}
                <Route
                    path="/login"
                    element={
                        user
                            ? <Navigate to="/" />
                            : <Login />
                    }
                />

                {/* Trang quản lý tài khoản: chỉ dành cho Admin (role = 1) */}
                <Route
                    path="/admin/accounts"
                    element={
                        <ProtectedRoute allowedRoles={[1]}>
                            <AccountManagement />
                        </ProtectedRoute>
                    }
                />

                {/* Trang quản lý danh mục: chỉ dành cho Staff (role = 2) */}
                <Route
                    path="/staff/categories"
                    element={
                        <ProtectedRoute allowedRoles={[2]}>
                            <CategoryManagement />
                        </ProtectedRoute>
                    }
                />

                {/* Trang quản lý tin tức: chỉ dành cho Staff (role = 2) */}
                <Route
                    path="/staff/news"
                    element={
                        <ProtectedRoute allowedRoles={[2]}>
                            <NewsManagement />
                        </ProtectedRoute>
                    }
                />

                {/* Trang lịch sử tin tức cá nhân: chỉ dành cho Staff (role = 2) */}
                <Route
                    path="/staff/history"
                    element={
                        <ProtectedRoute allowedRoles={[2]}>
                            <MyNewsHistory />
                        </ProtectedRoute>
                    }
                />

                {/* Trang hồ sơ cá nhân: chỉ dành cho Staff (role = 2) */}
                <Route
                    path="/staff/profile"
                    element={
                        <ProtectedRoute allowedRoles={[2]}>
                            <MyProfile />
                        </ProtectedRoute>
                    }
                />

                {/* Mọi đường dẫn không khớp đều chuyển về trang chủ */}
                <Route
                    path="*"
                    element={<Navigate to="/" />}
                />

            </Routes>

        </>
    );
}
