/**
 * Nguyễn Duy Khang - CE192012 - Assignment 2
 * File này cấu hình instance Axios dùng chung cho toàn bộ ứng dụng.
 * Mọi request HTTP đều đi qua file này trước khi gửi lên server.
 * Tự động đính kèm JWT token vào header Authorization của mỗi request.
 */

import axios from "axios";

// Tạo instance Axios với URL gốc trỏ đến backend Spring Boot
const axiosClient = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json"
    }
});

// Interceptor: tự động thêm token vào header trước khi gửi mỗi request
axiosClient.interceptors.request.use(
    (config) => {

        // Lấy token JWT đã lưu trong localStorage sau khi đăng nhập
        const token = localStorage.getItem("token");

        // Nếu có token thì đính kèm vào header Authorization dạng Bearer
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },

    // Nếu có lỗi khi tạo request thì reject promise
    (error) => Promise.reject(error)
);

export default axiosClient;
