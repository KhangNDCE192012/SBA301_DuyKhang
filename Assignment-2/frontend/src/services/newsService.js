/**
 * Nguyễn Duy Khang - CE192012 - Assignment 2
 * Service xử lý các tác vụ CRUD liên quan đến bài viết tin tức.
 * Giao tiếp với backend qua axiosClient.
 * Được sử dụng trong NewsManagement.jsx, PublicNews.jsx và MyNewsHistory.jsx.
 */

import axiosClient from "../api/axiosClient";

const newsService = {

    /**
     * Lấy danh sách bài viết tin tức theo các tham số lọc.
     * params có thể chứa: { search, activeOnly, categoryId }
     * Được gọi từ PublicNews (activeOnly=true) và NewsManagement (activeOnly=false).
     * GET /api/news-articles?search=...&activeOnly=...
     */
    getAll: async (params = {}) => {
        const response = await axiosClient.get(
            "/news-articles",
            { params }
        );

        return response.data;
    },

    /**
     * Lấy thông tin chi tiết một bài viết theo ID.
     * GET /api/news-articles/{id}
     */
    getById: async (id) => {
        const response = await axiosClient.get(
            `/news-articles/${id}`
        );

        return response.data;
    },

    /**
     * Tạo mới một bài viết tin tức.
     * Được gọi từ NewsManagement khi người dùng submit form tạo mới (modal Create).
     * POST /api/news-articles với body chứa thông tin bài viết mới.
     */
    create: async (data) => {
        const response = await axiosClient.post(
            "/news-articles",
            data
        );

        return response.data;
    },

    /**
     * Cập nhật thông tin một bài viết theo ID.
     * Được gọi từ NewsManagement khi người dùng submit form chỉnh sửa (modal Edit).
     * PUT /api/news-articles/{id} với body chứa thông tin cập nhật.
     */
    update: async (id, data) => {
        const response = await axiosClient.put(
            `/news-articles/${id}`,
            data
        );

        return response.data;
    },

    /**
     * Xóa một bài viết theo ID.
     * Được gọi từ NewsManagement khi người dùng xác nhận xóa trong ConfirmDialog.
     * DELETE /api/news-articles/{id}
     */
    delete: async (id) => {
        const response = await axiosClient.delete(
            `/news-articles/${id}`
        );

        return response.data;
    },

    /**
     * Lấy lịch sử bài viết của người dùng đang đăng nhập.
     * Được gọi từ MyNewsHistory khi component mount.
     * GET /api/news-articles/my-history (backend tự lấy user từ token)
     */
    getMyHistory: async () => {
        const response = await axiosClient.get(
            "/news-articles/my-history"
        );

        return response.data;
    }

};

export default newsService;
