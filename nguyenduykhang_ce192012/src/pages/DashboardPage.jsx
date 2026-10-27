// MỤC ĐÍCH: Trang tổng quan — hiển thị các số liệu thống kê của hệ thống.
//
// Đây là "pure presentational component": không có state riêng,
// không thay đổi dữ liệu, chỉ nhận props và render thống kê.
// Khi dữ liệu ở App.jsx thay đổi → Dashboard tự cập nhật theo (vì re-render).
// ============================================================

// Props nhận từ App.jsx:
//   categories: mảng danh mục
//   news:       mảng bài viết tin tức
//   users:      mảng người dùng
function DashboardPage({ categories, news, users }) {
    // Đếm số bài viết đang Active (status === 1)
    // .filter() tạo mảng con chỉ chứa news có status = 1, .length đếm số phần tử
    const activeNews = news.filter(
        (item) => item.status === 1
    ).length;

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome to FUNews Management System.</p>

            {/* Lưới hiển thị 4 thẻ thống kê */}
            <div className="stats-grid">
                {/* Tổng số danh mục */}
                <div className="stat-card">
                    <h3>Categories</h3>
                    <p>{categories.length}</p>
                </div>

                {/* Tổng số bài viết (kể cả Inactive) */}
                <div className="stat-card">
                    <h3>News Articles</h3>
                    <p>{news.length}</p>
                </div>

                {/* Tổng số người dùng */}
                <div className="stat-card">
                    <h3>Users</h3>
                    <p>{users.length}</p>
                </div>

                {/* Chỉ đếm bài viết đang Active */}
                <div className="stat-card">
                    <h3>Active News</h3>
                    <p>{activeNews}</p>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;
