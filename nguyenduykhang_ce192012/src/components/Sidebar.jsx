// Nguyễn Duy Khang - CE192012 - Assignment 1

// MỤC ĐÍCH: Menu điều hướng bên trái — cho phép chuyển giữa các trang
// bằng cách cập nhật state activePage trong App.jsx.
//
// Cơ chế hoạt động (không dùng React Router):
//   Click menu item → setActivePage("Category") → state đổi ở App.jsx
//   → App re-render → renderPage() trả về <CategoryPage> → UI đổi trang
// ============================================================

// Props nhận từ AdminLayout:
//   activePage:    tên trang đang hiển thị — dùng để highlight menu item tương ứng
//   setActivePage: hàm setter từ App.jsx — dùng để đổi trang khi click menu
function Sidebar({ activePage, setActivePage }) {
    // Danh sách các mục menu — mỗi string phải KHỚP CHÍNH XÁC với case trong renderPage() (App.jsx)
    const menuItems = [
        "Dashboard",
        "Category",
        "News",
        "Users",
        "Settings",
    ];

    return (
        <aside className="sidebar">
            <h3>ADMIN MENU</h3>

            {/*
                Render danh sách menu bằng .map():
                - key={item}: React cần key duy nhất để theo dõi từng phần tử trong list
                - className: nếu item là trang đang active → thêm class "active" để highlight
                - onClick: khi click → gọi setActivePage với tên trang tương ứng
                           → App.jsx cập nhật activePage → re-render → đổi trang
            */}
            {menuItems.map((item) => (
                <button
                    key={item}
                    className={activePage === item ? "active" : ""}
                    onClick={() => setActivePage(item)}
                >
                    {item}
                </button>
            ))}
        </aside>
    );
}

export default Sidebar;
