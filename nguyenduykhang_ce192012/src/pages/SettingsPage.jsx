// ============================================================
// FILE: SettingsPage.jsx
// MỤC ĐÍCH: Trang cài đặt — hiển thị thông tin profile của người dùng
// đang đăng nhập và thông tin chung của ứng dụng.
//
// Đây là component đơn giản nhất trong project:
// không có state, không có form, không có CRUD.
// Chỉ nhận props và render thông tin tĩnh.
// ============================================================

// Props nhận từ App.jsx:
//   currentUser: object { id, username, role } — thông tin người dùng đang login
function SettingsPage({ currentUser }) {
    return (
        <div>
            <h1>Settings</h1>

            {/* Panel thông tin cá nhân của người dùng đang đăng nhập */}
            <div className="panel">
                <h3>Profile Information</h3>
                {/* Hiển thị username từ props currentUser */}
                <p>Username: {currentUser.username}</p>
                {/* Hiển thị role cố định là Admin vì chỉ Admin mới đăng nhập được */}
                <p>Role: Admin</p>
            </div>

            {/* Panel thông tin ứng dụng (thông tin tĩnh, không thay đổi) */}
            <div className="panel">
                <h3>Application Information</h3>
                <p>System: FUNewsManagementSystem</p>
                <p>Version: Assignment 01</p>
                <p>Data Source: Mock Data</p>
            </div>
        </div>
    );
}

export default SettingsPage;
