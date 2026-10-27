// ============================================================
// FILE: Header.jsx
// MỤC ĐÍCH: Thanh điều hướng trên cùng của trang admin.
// Hiển thị: tên ứng dụng (brand) + tên người dùng đang login + nút Logout.
//
// Đây là "presentational component" (component trình bày thuần túy):
// không có state riêng, chỉ nhận props và render UI.
// ============================================================

// Props nhận từ AdminLayout:
//   currentUser: object { id, username, role } — thông tin user đang login
//   onLogout:    hàm handleLogout từ App.jsx — gọi khi bấm nút Logout
function Header({ currentUser, onLogout }) {
    return (
        <header className="header">
            {/* Vùng bên trái: tên thương hiệu / ứng dụng */}
            <div className="brand">
                <span className="brand-icon">📰</span>
                <strong>FUNews Management</strong>
            </div>

            {/* Vùng bên phải: chào mừng user + nút đăng xuất */}
            <div className="header-right">
                {/* Hiển thị tên người dùng từ props currentUser */}
                <span>Hello, {currentUser.username}</span>

                {/*
                    onClick={onLogout}: khi bấm nút này gọi hàm handleLogout trong App.jsx
                    → App.jsx set currentUser = null → App re-render → hiện LoginPage
                */}
                <button onClick={onLogout}>Logout</button>
            </div>
        </header>
    );
}

export default Header;
