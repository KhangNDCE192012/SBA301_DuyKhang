# SBA301 - ASSIGNMENT 01: FUNews Management System

> **Sinh viên thực hiện:** Nguyễn Duy Khang  
> **Mã số sinh viên (MSSV):** CE192012  
> **Môn học:** SBA301 - Working with ReactJS Application  

---

## 🔑 1. Credential Test (Tài khoản đăng nhập)

Hệ thống sử dụng cơ chế **Mock Authentication**. Sử dụng tài khoản dưới đây để đăng nhập vào trang quản trị:

| Mục | Thông tin đăng nhập |
| :--- | :--- |
| **Username** | `Admin` |
| **Password** | `Admin` |
| **Vai trò (Role)** | Administrator (role: 1) |

> 💡 *Lưu ý: Nếu nhập sai username hoặc password, hoặc để trống, hệ thống sẽ hiển thị thông báo lỗi tương ứng.*

---

## 🚀 2. Hướng dẫn cài đặt và chạy project

### Yêu cầu môi trường
* Đã cài đặt **Node.js** (khuyến nghị phiên bản LTS 18.x trở lên).

### Các bước thực hiện:

1. **Mở terminal** tại thư mục gốc của dự án (`nguyenduykhang_ce192012`).

2. **Cài đặt các gói thư viện phụ thuộc (dependencies):**
   ```bash
   npm install
   ```

3. **Khởi chạy máy chủ phát triển (Dev server):**
   ```bash
   npm run dev
   ```

4. **Truy cập ứng dụng:**  
   Mở trình duyệt web và truy cập vào đường dẫn local hiển thị trên terminal (thường là: `http://localhost:5173`).

---

## 📌 3. Các chức năng chính (Core Features)

### 3.1. Authentication (Xác thực người dùng)
* Đăng nhập với tài khoản hợp lệ (`Admin`/`Admin`).
* Validate bắt lỗi khi để trống username/password hoặc nhập sai thông tin.
* Đăng xuất (Logout) xóa phiên làm việc và quay về màn hình đăng nhập.

### 3.2. Dashboard (Tổng quan thống kê)
* Thống kê tổng số lượng **Danh mục (Categories)**.
* Thống kê tổng số lượng **Bài viết (News Articles)**.
* Thống kê tổng số lượng **Người dùng (Users)**.
* Thống kê số lượng bài viết đang ở trạng thái hoạt động (**Active News**).

### 3.3. Quản lý Danh mục (Category Management)
* **Xem & Tìm kiếm**: Hiển thị danh sách danh mục, tìm kiếm theo tên tức thì (real-time).
* **Tạo mới (Create)**: Validate tên không được rỗng, không được trùng lặp.
* **Chỉnh sửa (Update)**: Sử dụng chung Modal linh hoạt (`editingId`), điền sẵn dữ liệu cũ.
* **Xóa (Delete)**: Kiểm tra ràng buộc toàn vẹn dữ liệu — **không cho phép xóa danh mục nếu đang có bài viết tin tức tham chiếu đến**.

### 3.4. Quản lý Tin tức (News Management)
* **Quan hệ dữ liệu (Data Relations)**:
  * Mỗi bài viết liên kết với Danh mục thông qua `categoryId`.
  * Mỗi bài viết liên kết với Tác giả thông qua `createdBy`.
* **Form & Validation**: Kiểm tra tiêu đề, nội dung, bắt buộc chọn danh mục và tác giả hợp lệ.
* **CRUD & Tìm kiếm**: Tìm kiếm theo cả tiêu đề (title) và nội dung (content).

### 3.5. Quản lý Người dùng (User Management)
* Hiển thị danh sách tài khoản, ánh xạ Role hiển thị trực quan (`1` = Admin, `2` = Staff).
* Thêm/Sửa người dùng với kiểm tra trùng lặp `username`.
* **Ràng buộc an toàn khi xóa**: Không cho phép xóa người dùng nếu người đó đang là tác giả của một bài viết hiện có.

---

## 🛠️ 4. Công nghệ & Kiến trúc áp dụng

* **Nền tảng:** ReactJS (Functional Components, React Hooks: `useState`).
* **Công cụ đóng gói (Bundler):** Vite.
* **Mô hình kiến trúc:** Single Page Application (SPA), điều hướng các trang qua State nội bộ mà không cần tải lại trang.
* **Quản lý dữ liệu:** Lưu trữ tập trung tại component cha (`App.jsx`), truyền qua `props`, đảm bảo nguyên tắc **Immutable State Update** (dùng Spread operator `...`, `.map()`, `.filter()`).
* **Dữ liệu mẫu (Data source):** Quản lý qua file `src/data/mockData.js`.

## 🚀 2. Hướng dẫn cài đặt và chạy project

### Yêu cầu môi trường
* Đã cài đặt **Node.js** (khuyến nghị phiên bản LTS 18.x trở lên).

### Các bước thực hiện:

1. **Mở terminal** tại thư mục gốc của dự án (`nguyenduykhang_ce192012`).

2. **Cài đặt các gói thư viện phụ thuộc (dependencies):**
   ```bash
   npm install
   ```

3. **Khởi chạy máy chủ phát triển (Dev server):**
   ```bash
   npm run dev
   ```

4. **Truy cập ứng dụng:**  
   Mở trình duyệt web và truy cập vào đường dẫn local hiển thị trên terminal (thường là: `http://localhost:5173`).

---

## 📌 3. Các chức năng chính (Core Features)

### 3.1. Authentication (Xác thực người dùng)
* Đăng nhập với tài khoản hợp lệ (`Admin`/`Admin`).
* Validate bắt lỗi khi để trống username/password hoặc nhập sai thông tin.
* Đăng xuất (Logout) xóa phiên làm việc và quay về màn hình đăng nhập.

### 3.2. Dashboard (Tổng quan thống kê)
* Thống kê tổng số lượng **Danh mục (Categories)**.
* Thống kê tổng số lượng **Bài viết (News Articles)**.
* Thống kê tổng số lượng **Người dùng (Users)**.
* Thống kê số lượng bài viết đang ở trạng thái hoạt động (**Active News**).

### 3.3. Quản lý Danh mục (Category Management)
* **Xem & Tìm kiếm**: Hiển thị danh sách danh mục, tìm kiếm theo tên tức thì (real-time).
* **Tạo mới (Create)**: Validate tên không được rỗng, không được trùng lặp.
* **Chỉnh sửa (Update)**: Sử dụng chung Modal linh hoạt (`editingId`), điền sẵn dữ liệu cũ.
* **Xóa (Delete)**: Kiểm tra ràng buộc toàn vẹn dữ liệu — **không cho phép xóa danh mục nếu đang có bài viết tin tức tham chiếu đến**.

### 3.4. Quản lý Tin tức (News Management)
* **Quan hệ dữ liệu (Data Relations)**:
  * Mỗi bài viết liên kết với Danh mục thông qua `categoryId`.
  * Mỗi bài viết liên kết với Tác giả thông qua `createdBy`.
* **Form & Validation**: Kiểm tra tiêu đề, nội dung, bắt buộc chọn danh mục và tác giả hợp lệ.
* **CRUD & Tìm kiếm**: Tìm kiếm theo cả tiêu đề (title) và nội dung (content).

### 3.5. Quản lý Người dùng (User Management)
* Hiển thị danh sách tài khoản, ánh xạ Role hiển thị trực quan (`1` = Admin, `2` = Staff).
* Thêm/Sửa người dùng với kiểm tra trùng lặp `username`.
* **Ràng buộc an toàn khi xóa**: Không cho phép xóa người dùng nếu người đó đang là tác giả của một bài viết hiện có.

---

## 🛠️ 4. Công nghệ & Kiến trúc áp dụng

* **Nền tảng:** ReactJS (Functional Components, React Hooks: `useState`).
* **Công cụ đóng gói (Bundler):** Vite.
* **Mô hình kiến trúc:** Single Page Application (SPA), điều hướng các trang qua State nội bộ mà không cần tải lại trang.
* **Quản lý dữ liệu:** Lưu trữ tập trung tại component cha (`App.jsx`), truyền qua `props`, đảm bảo nguyên tắc **Immutable State Update** (dùng Spread operator `...`, `.map()`, `.filter()`).
* **Dữ liệu mẫu (Data source):** Quản lý qua file `src/data/mockData.js`.

