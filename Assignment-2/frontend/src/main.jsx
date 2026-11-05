/**
 * Nguyễn Duy Khang - CE192012 - Assignment 2
 * File khởi động ứng dụng React.
 * Render component gốc App vào thẻ #root trong index.html,
 * đồng thời bọc toàn bộ ứng dụng bằng BrowserRouter (định tuyến)
 * và AuthProvider (quản lý trạng thái đăng nhập).
 */

import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";

import "./index.css";

// Tạo React root gắn vào phần tử có id="root" trong index.html
ReactDOM.createRoot(
    document.getElementById("root")
).render(

    // StrictMode giúp phát hiện các lỗi tiềm ẩn trong quá trình phát triển
    <React.StrictMode>

        {/* BrowserRouter cung cấp hệ thống định tuyến cho toàn ứng dụng */}
        <BrowserRouter>

            {/* AuthProvider cung cấp context xác thực (user, login, logout) cho toàn ứng dụng */}
            <AuthProvider>
                <App />
            </AuthProvider>

        </BrowserRouter>

    </React.StrictMode>

);
