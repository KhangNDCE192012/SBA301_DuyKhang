// Nguyễn Duy Khang - CE192012 - Assignment 1

// MỤC ĐÍCH: Trang đăng nhập — thu thập username/password từ người dùng,
// validate đầu vào, sau đó gọi hàm onLogin từ App.jsx để xác thực.
//
// Đây là "controlled form": React kiểm soát hoàn toàn giá trị trong input
// thông qua state (username, password). Mỗi lần gõ phím → state thay đổi
// → React re-render → input hiển thị giá trị mới từ state.
// ============================================================

import { useState } from "react";

// Props:
//   onLogin: nhận hàm handleLogin từ App.jsx, được truyền xuống để LoginPage gọi
function LoginPage({ onLogin }) {  //onLogin là props → đến từ bên ngoài (App.jsx truyền vào), LoginPage không tự thay đổi được
    // State lưu giá trị người dùng đang gõ trong form / Khởi tạo các state cục bộ:
    const [username, setUsername] = useState(""); // giá trị ô input username
    const [password, setPassword] = useState(""); // giá trị ô input password
    const [error, setError] = useState("");       // thông báo lỗi (rỗng = không hiện)

    // ── HANDLE SUBMIT ──────────────────────────────────────────
    // Được gọi khi người dùng bấm nút "Login" (sự kiện onSubmit của <form>)
    function handleSubmit(e) {
        // Ngăn hành vi mặc định của trình duyệt: reload trang khi submit form.
        // Không có dòng này → trang bị tải lại và mất toàn bộ state.
        e.preventDefault();

        // Validate: kiểm tra input không được rỗng (trim() loại bỏ khoảng trắng thừa)
        if (!username.trim() || !password.trim()) {
            setError("Please enter username and password");
            return; // Dừng hàm, không tiếp tục
        }

        // Gọi hàm xác thực từ App.jsx, truyền vào username và password
        // App.jsx trả về true (thành công) hoặc false (thất bại)
        const success = onLogin(username, password);

        // Nếu App.jsx báo thất bại → hiện thông báo lỗi
        if (!success) {
            setError("Invalid username or password");
        }
        // Nếu thành công: App.jsx tự cập nhật currentUser → App re-render
        // → LoginPage tự biến mất (vì currentUser !== null)
    }

    return (
        <div className="login-container">
            {/* onSubmit={handleSubmit}: khi bấm nút submit, gọi hàm handleSubmit */}
            <form className="login-box" onSubmit={handleSubmit}>
                <h1>FUNews Management System</h1>
                <h2>Login</h2>

                <label htmlFor="login-username">Username</label>
                {/*
                    Controlled input:
                    - value={username}: giá trị hiển thị do React kiểm soát (lấy từ state)
                    - onChange: mỗi lần người dùng gõ → cập nhật state username
                    e.target.value: giá trị hiện tại của ô input
                */}
                <input
                    id="login-username"
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <label htmlFor="login-password">Password</label>
                {/* type="password": trình duyệt tự ẩn ký tự thành dấu chấm */}
                <input
                    id="login-password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {/*
                    Conditional rendering:
                    - Nếu error = "" (falsy) → không render gì
                    - Nếu error có nội dung (truthy) → render thẻ <p> hiện lỗi
                */}
                {error && <p className="error">{error}</p>}

                {/* type="submit": bấm nút này sẽ kích hoạt sự kiện onSubmit của <form> */}
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default LoginPage;
