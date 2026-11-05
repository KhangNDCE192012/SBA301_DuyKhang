/**
 * Nguyễn Duy Khang - CE192012 - Assignment 2
 * Component bảo vệ route, kiểm tra xem người dùng có quyền truy cập trang không.
 * Nếu chưa đăng nhập → chuyển hướng về /login.
 * Nếu không có role phù hợp → chuyển hướng về trang chủ /.
 * Được sử dụng trong App.jsx để bọc các trang cần phân quyền.
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute: component bảo vệ route theo vai trò người dùng.
 * @param {ReactNode} children - component con cần được bảo vệ
 * @param {number[]} allowedRoles - mảng các role được phép truy cập (vd: [1], [2])
 */
export default function ProtectedRoute({
                                           children,
                                           allowedRoles
                                       }) {

    // Lấy thông tin user đang đăng nhập từ AuthContext
    const { user } = useAuth();

    // Nếu chưa đăng nhập → chuyển về trang /login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Nếu có danh sách role giới hạn và role của user không nằm trong đó → về trang chủ
    if (
        allowedRoles &&
        !allowedRoles.includes(user.accountRole)
    ) {
        return <Navigate to="/" replace />;
    }

    // Người dùng hợp lệ → render component con
    return children;
}
