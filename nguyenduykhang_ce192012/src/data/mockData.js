// MỤC ĐÍCH: Dữ liệu giả lập (mock data) thay thế cho database thật.
// Vì đây là assignment dùng React thuần (không có backend/API),
// toàn bộ dữ liệu được khai báo thủ công ở đây.
//
// Các mảng này được import vào App.jsx để khởi tạo useState.
// Refresh trang → dữ liệu reset về mặc định (không lưu localStorage).
//
// QUAN HỆ DỮ LIỆU (Relation):
//   News.categoryId  →  tham chiếu đến  Categories.id
//   News.createdBy   →  tham chiếu đến  Users.id
// (Giống Foreign Key trong database quan hệ)
// ============================================================

// Danh sách danh mục ban đầu
// status: 1 = Active (đang hoạt động), 0 = Inactive (tạm ngưng)
export const initialCategories = [
    {
        id: "c1",       // ID duy nhất để các bảng khác tham chiếu
        name: "Education",
        status: 1,      // 1 = Active
    },
    {
        id: "c2",
        name: "Technology",
        status: 1,
    },
    {
        id: "c3",
        name: "Sports",
        status: 0,      // 0 = Inactive
    },
];

// Danh sách người dùng ban đầu
// role: 1 = Admin (quản trị viên), 2 = Staff (nhân viên)
export const initialUsers = [
    {
        id: "u1",
        username: "Admin",
        role: 1,        // 1 = Admin
        status: 1,
    },
    {
        id: "u2",
        username: "Staff01",
        role: 2,        // 2 = Staff
        status: 1,
    },
];

// Danh sách bài viết tin tức ban đầu
// categoryId: ID của category mà bài viết thuộc về (quan hệ với initialCategories)
// createdBy:  ID của user đã tạo bài viết (quan hệ với initialUsers)
// News chỉ lưu ID của category và user. Khi hiển thị, ta dùng 
// categories.find(c => c.id === item.categoryId) để tra tên. 
// → Giống như database dùng Foreign Key.
export const initialNews = [
    {
        id: "n1",
        title: "Welcome to FUNews",
        content: "This is the first news article.",
        categoryId: "c1",  // thuộc category "Education" (id: c1)
        createdBy: "u1",   // tạo bởi "Admin" (id: u1)
        status: 1,
    },
    {
        id: "n2",
        title: "New Technology Event",
        content: "A new technology event is coming.",
        categoryId: "c2",  // thuộc category "Technology" (id: c2)
        createdBy: "u2",   // tạo bởi "Staff01" (id: u2)
        status: 1,
    },
];
