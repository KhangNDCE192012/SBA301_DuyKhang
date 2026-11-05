/**
 * Nguyễn Duy Khang - CE192012 - Assignment 2
 * Service xử lý việc lấy danh sách tag (nhãn) dùng cho bài viết tin tức.
 * Giao tiếp với backend qua axiosClient.
 * Được sử dụng trong NewsManagement.jsx để hiển thị danh sách tag cho người dùng chọn.
 */

import axiosClient from "../api/axiosClient";

const tagService = {

    /**
     * Lấy toàn bộ danh sách tag từ server.
     * Được gọi từ NewsManagement khi trang load để render danh sách checkbox tag.
     * GET /api/tags
     */
    getAll: async () => {
        const response = await axiosClient.get("/tags");

        return response.data;
    }

};

export default tagService;
