/**
 * Nguyễn Duy Khang - CE192012 - Assignment 2
 * Service xử lý các tác vụ CRUD liên quan đến tài khoản người dùng.
 * Giao tiếp với backend qua axiosClient.
 * Được sử dụng trong AccountManagement.jsx và MyProfile.jsx.
 */

import axiosClient from "../api/axiosClient";

const accountService = {

    /**
     * Lấy danh sách tất cả tài khoản, có thể lọc theo từ khóa tìm kiếm.
     * Được gọi từ AccountManagement khi trang load hoặc khi search thay đổi.
     * GET /api/accounts?search=...
     */
    getAll: async (search = "") => {
        const response = await axiosClient.get(
            "/accounts",
            { params: { search } }
        );

        return response.data;
    },

    /**
     * Lấy thông tin chi tiết một tài khoản theo ID.
     * GET /api/accounts/{id}
     */
    getById: async (id) => {
        const response = await axiosClient.get(
            `/accounts/${id}`
        );

        return response.data;
    },

    /**
     * Tạo mới một tài khoản.
     * Được gọi từ AccountManagement khi người dùng submit form tạo mới (modal Create).
     * POST /api/accounts với body chứa thông tin tài khoản mới.
     */
    create: async (data) => {
        const response = await axiosClient.post(
            "/accounts",
            data
        );

        return response.data;
    },

    /**
     * Cập nhật thông tin một tài khoản theo ID.
     * Được gọi từ AccountManagement khi người dùng submit form chỉnh sửa (modal Edit).
     * PUT /api/accounts/{id} với body chứa thông tin cập nhật.
     */
    update: async (id, data) => {
        const response = await axiosClient.put(
            `/accounts/${id}`,
            data
        );

        return response.data;
    },

    /**
     * Xóa một tài khoản theo ID.
     * Được gọi từ AccountManagement khi người dùng xác nhận xóa trong ConfirmDialog.
     * DELETE /api/accounts/{id}
     */
    delete: async (id) => {
        const response = await axiosClient.delete(
            `/accounts/${id}`
        );

        return response.data;
    },

    /**
     * Cập nhật thông tin hồ sơ của người dùng đang đăng nhập.
     * Được gọi từ MyProfile khi người dùng submit form "Save Changes".
     * PUT /api/accounts/profile với body chứa thông tin mới.
     */
    updateProfile: async (data) => {
        const response = await axiosClient.put(
            "/accounts/profile",
            data
        );

        return response.data;
    }

};

export default accountService;
