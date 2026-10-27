// MỤC ĐÍCH: Component gốc — "bộ não" của toàn bộ ứng dụng.
// Chịu trách nhiệm:
//   1. Giữ toàn bộ state dùng chung (categories, news, users)
//   2. Kiểm soát xác thực (auth): đã login hay chưa
//   3. Điều hướng (navigation): trang nào đang hiển thị
//
// Không có file này → không có nơi chia sẻ dữ liệu giữa các trang (→ Category, News, Users mỗi page tự giữ → không chia sẻ được),
// và không có cơ chế bảo vệ trang admin (Không có auth control → ai cũng vào được trang admin).
// ============================================================

import { useState } from "react";

// Import các trang (pages)
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CategoryPage from "./pages/CategoryPage";
import NewsPage from "./pages/NewsPage";
import UsersPage from "./pages/UsersPage";
import SettingsPage from "./pages/SettingsPage";

// Import layout bao bọc toàn bộ giao diện admin
import AdminLayout from "./components/AdminLayout";

// Import dữ liệu ban đầu từ file mock data
import {
  initialCategories,
  initialNews,
  initialUsers,
} from "./data/mockData";

function App() {
  // ── AUTH STATE ──────────────────────────────────────────────
  // currentUser: lưu thông tin người dùng đang đăng nhập.
  // null = chưa login → hiện LoginPage
  // object {...} = đã login → hiện trang admin
  const [currentUser, setCurrentUser] = useState(null);

  // ── NAVIGATION STATE ────────────────────────────────────────
  // activePage: tên trang đang hiển thị (thay thế cho React Router).
  // Khi activePage thay đổi → App re-render → renderPage() trả về component khác.
  const [activePage, setActivePage] = useState("Dashboard");

  // ── SHARED DATA (dữ liệu dùng chung cho nhiều trang) ────────
  // Đặt state ở App.jsx để các trang con có thể dùng chung.
  // Ví dụ: NewsPage cần categories để dropdown chọn danh mục.
  const [categories, setCategories] = useState(initialCategories);
  const [news, setNews] = useState(initialNews);
  const [users, setUsers] = useState(initialUsers);

  // ── HANDLE LOGIN ─────────────────────────────────────────────
  // Hàm này được truyền xuống LoginPage qua props (onLogin).
  // Kiểm tra username/password, nếu đúng thì cập nhật currentUser.
  // Trả về true/false để LoginPage biết login thành công hay không.
  function handleLogin(username, password) {
    // Mock authentication: chỉ chấp nhận Admin/Admin
    if (username === "Admin" && password === "Admin") {
      // Cập nhật state → App re-render → currentUser !== null → hiện admin
      setCurrentUser({
        id: "u1",
        username: "Admin",
        role: 1,
      });

      setActivePage("Dashboard"); // Sau login, luôn về trang Dashboard
      return true;                // Báo cho LoginPage biết: thành công
    }

    return false; // Báo cho LoginPage: sai thông tin/thất bại
  }

  // ── HANDLE LOGOUT ────────────────────────────────────────────
  // Set currentUser về null → App re-render → currentUser === null → hiện LoginPage
  function handleLogout() {
    setCurrentUser(null);
    setActivePage("Dashboard"); // Reset trang về mặc định
  }

  // ── AUTHENTICATION GATE (cổng bảo vệ) ───────────────────────
  // Nếu chưa login (currentUser === null), chỉ hiện LoginPage.
  // Toàn bộ phần admin bên dưới sẽ KHÔNG render.
  if (currentUser === null) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // ── PAGE ROUTER (điều hướng bằng state) ─────────────────────
  // Không dùng React Router — thay vào đó dùng switch-case.
  // Mỗi case trả về component tương ứng với trang đang active.
  // Props được truyền xuống để các trang đọc/cập nhật shared data.
  // Khi activePage thay đổi → React re-render → renderPage() trả về component khác → UI đổi trang.
  function renderPage() {
    switch (activePage) {
      case "Dashboard":
        // DashboardPage chỉ đọc dữ liệu → không cần truyền setter
        return (
            <DashboardPage
                categories={categories}
                news={news}
                users={users}
            />
        );

      case "Category":
        // CategoryPage cần đọc và GHI categories → truyền cả categories lẫn setCategories
        // Cần news để kiểm tra quan hệ khi xóa (không xóa category đang có news)
        return (
            <CategoryPage
                categories={categories}
                setCategories={setCategories}
                news={news}
            />
        );

      case "News":
        // NewsPage cần categories (dropdown chọn danh mục) và users (dropdown chọn tác giả)
        return (
            <NewsPage
                news={news}
                setNews={setNews}
                categories={categories}
                users={users}
            />
        );

      case "Users":
        // UsersPage cần news để kiểm tra quan hệ khi xóa (không xóa user đang là tác giả)
        return (
            <UsersPage
                users={users}
                setUsers={setUsers}
                news={news}
            />
        );

      case "Settings":
        // SettingsPage chỉ hiển thị thông tin người dùng hiện tại
        return <SettingsPage currentUser={currentUser} />;

      default:
        // Trường hợp activePage không khớp case nào → fallback về Dashboard
        return <DashboardPage
            categories={categories}
            news={news}
            users={users}
        />;
    }
  }

  // ── RENDER ADMIN LAYOUT ──────────────────────────────────────
  // Bọc nội dung trang hiện tại (renderPage()) trong khung layout chung.
  // AdminLayout nhận:
  //   - currentUser: để Header hiển thị tên người dùng
  //   - onLogout: để nút Logout trong Header gọi được
  //   - activePage + setActivePage: để Sidebar biết menu nào đang active
  //   - children (renderPage()): nội dung trang hiển thị trong vùng main
  return (
      <AdminLayout
          currentUser={currentUser}
          onLogout={handleLogout}
          activePage={activePage}
          setActivePage={setActivePage}
      >
        {renderPage()}
      </AdminLayout>
  );
}

export default App;
