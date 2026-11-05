/**
 * Nguyễn Duy Khang - CE192012 - Assignment 2
 * Service xử lý các tác vụ CRUD liên quan đến danh mục tin tức.
 * Giao tiếp với backend qua axiosClient.
 * Được sử dụng trong CategoryManagement.jsx, PublicNews.jsx và NewsManagement.jsx.
 */

import axiosClient from "../api/axiosClient";

const categoryService = {

    /** ===============================================================================
     * Lấy danh sách tất cả danh mục, có thể lọc theo từ khóa tìm kiếm.
     * Được gọi khi trang CategoryManagement load hoặc khi search thay đổi.
     * GET /api/categories?search=...
     */
    getAll: async (search = "") => {
        const response = await axiosClient.get(
            "/categories",
            { params: { search } }
        );

        return response.data;
    },

    /** ===============================================================================
     * ADD CATEGORY
     * Được gọi từ CategoryManagement khi người dùng submit form tạo mới (modal Create).
     * POST /api/categories với body chứa thông tin danh mục mới.
     */
    create: async (data) => {
        const response = await axiosClient.post(
            "/categories",
            data
        );

        return response.data;
    },

    /** ================================================================================
     * UPDATE CATEGORY theo ID.
     * Được gọi từ CategoryManagement khi người dùng submit form chỉnh sửa (modal Edit).
     * PUT /api/categories/{id} với body chứa thông tin cập nhật.
     */
    update: async (id, data) => {
        const response = await axiosClient.put(
            `/categories/${id}`,
            data
        );

        return response.data;
    },

    /** ============================================================================
     * DELETE CATEGORY theo ID.
     * Được gọi từ CategoryManagement khi người dùng xác nhận xóa trong ConfirmDialog.
     * DELETE /api/categories/{id}
     */
    delete: async (id) => {
        const response = await axiosClient.delete(
            `/categories/${id}`
        );

        return response.data;
    }

};

export default categoryService;
