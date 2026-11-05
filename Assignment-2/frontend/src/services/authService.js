/**
 * Nguyễn Duy Khang - CE192012 - Assignment 2
 * Service xử lý các tác vụ xác thực người dùng (đăng nhập, đăng xuất).
 * Giao tiếp trực tiếp với backend qua axiosClient.
 * Được gọi từ AuthContext → các component cần đăng nhập/đăng xuất.
 */

import axiosClient from "../api/axiosClient";

const authService = {

    /**
     * Gửi request đăng nhập lên server.
     * Được gọi từ AuthContext.login() khi người dùng submit form Login.
     * POST /api/auth/login với body { email, password }
     * Trả về { token, account } nếu thành công.
     */
    login: async (data) => {
        const response = await axiosClient.post(
            "/auth/login",
            data
        );

        return response.data;
    },

    /**
     * Gửi request đăng xuất lên server (invalidate token phía server).
     * Được gọi từ AuthContext.logout() khi người dùng nhấn nút Logout.
     * POST /api/auth/logout
     */
    logout: async () => {
        const response = await axiosClient.post(
            "/auth/logout"
        );

        return response.data;
    }

};

export default authService;
