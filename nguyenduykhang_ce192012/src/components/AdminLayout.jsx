// MỤC ĐÍCH: Bộ khung bố cục (layout) dùng chung cho toàn bộ trang admin.
// Gồm 3 vùng:
//   - Header: thanh trên cùng (tên app + thông tin user + Logout)
//   - Sidebar: menu điều hướng bên trái
//   - Main: vùng nội dung chính, hiển thị trang đang active
//
// Không có file này → mỗi trang phải tự vẽ lại Header và Sidebar,
// dẫn đến trùng lặp code và khó bảo trì.
// ============================================================

import Header from "./Header";
import Sidebar from "./Sidebar";

// Props nhận từ App.jsx:
//   currentUser:   thông tin người dùng đang đăng nhập (để Header hiển thị)
//   onLogout:      hàm xử lý đăng xuất (truyền vào Header cho nút Logout)
//   activePage:    tên trang đang active (truyền vào Sidebar để highlight menu)
//   setActivePage: hàm đổi trang (truyền vào Sidebar để click menu hoạt động)
//   children:      nội dung trang hiện tại (được đặt vào vùng <main>)
function AdminLayout({
                         currentUser,
                         onLogout,
                         activePage,
                         setActivePage,
                         children,     // JSX được đặt bên trong tag <AdminLayout>...</AdminLayout>
                     }) {
    return (
        <div className="admin-layout">
            {/* Header: thanh trên cùng — biết ai đang login và có nút logout */}
            <Header
                currentUser={currentUser}
                onLogout={onLogout}
            />

            <div className="admin-body">
                {/* Sidebar: menu bên trái — biết trang nào active để highlight */}
                <Sidebar
                    activePage={activePage}
                    setActivePage={setActivePage}
                />

                {/*
                    Vùng nội dung chính: hiển thị bất kỳ component nào được
                    truyền vào giữa tag <AdminLayout>...</AdminLayout> (tức là children).
                    Ví dụ: <AdminLayout>{renderPage()}</AdminLayout>
                    → children = kết quả của renderPage()
                */}
                <main className="main-content">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;
