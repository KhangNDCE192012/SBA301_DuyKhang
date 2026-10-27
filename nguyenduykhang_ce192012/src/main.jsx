// ============================================================
// FILE: main.jsx
// MỤC ĐÍCH: Điểm khởi động (entry point) của toàn bộ ứng dụng React.
// Đây là file chạy đầu tiên — nó gắn component <App /> vào thẻ
// <div id="root"> trong file index.html.
// Không có file này → trình duyệt chỉ thấy trang HTML trống.
// ============================================================

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css"; // CSS toàn cục cho toàn bộ app

// ReactDOM.createRoot: tạo "vùng quản lý" của React trong DOM
// document.getElementById("root"): tìm thẻ <div id="root"> trong index.html
// .render(...): vẽ component <App /> vào trong thẻ đó
ReactDOM.createRoot(document.getElementById("root")).render(
    // React.StrictMode: chế độ kiểm tra lỗi — KHÔNG ảnh hưởng giao diện,
    // chỉ giúp phát hiện lỗi tiềm ẩn trong quá trình phát triển.
    // (Nó render 2 lần trong môi trường dev để kiểm tra side effects)
    <React.StrictMode>
        <App />
    </React.StrictMode>
);