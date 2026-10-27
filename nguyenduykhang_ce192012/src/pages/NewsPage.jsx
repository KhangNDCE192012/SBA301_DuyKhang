// ============================================================
// FILE: NewsPage.jsx
// MỤC ĐÍCH: Trang quản lý bài viết tin tức — CRUD đầy đủ.
//
// Điểm khác biệt so với CategoryPage:
//   - Dùng object `form` (thay vì nhiều useState rời) vì News có nhiều trường hơn
//   - Có quan hệ với Categories và Users (dùng dropdown để chọn)
//   - Khi hiển thị: tra tên category/author từ ID bằng .find()
// ============================================================

import { useState } from "react";

// Props nhận từ App.jsx:
//   news:       mảng bài viết hiện tại
//   setNews:    hàm cập nhật mảng news trong App.jsx
//   categories: mảng danh mục (dùng cho dropdown + validation)
//   users:      mảng người dùng (dùng cho dropdown + validation)
function NewsPage({ news, setNews, categories, users }) {
    // ── STATE SEARCH ───────────────────────────────────────────
    const [keyword, setKeyword] = useState("");

    // ── STATE MODAL ────────────────────────────────────────────
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null); // null = Create, id = Update

    // ── STATE FORM ─────────────────────────────────────────────
    const [error, setError] = useState("");

    // News có nhiều trường → gom vào 1 object form thay vì nhiều useState riêng lẻ
    // emptyForm: trạng thái form khi tạo mới (tất cả rỗng / mặc định)
    const emptyForm = {
        title: "",
        content: "",
        categoryId: "", // sẽ được chọn từ dropdown
        createdBy: "",  // sẽ được chọn từ dropdown
        status: 1,
    };

    const [form, setForm] = useState(emptyForm);

    // ── SEARCH / FILTER ────────────────────────────────────────
    // Tìm kiếm trong cả title lẫn content của bài viết
    const filteredNews = news.filter((item) => {
        const text = keyword.trim().toLowerCase();

        return (
            item.title.toLowerCase().includes(text) ||
            item.content.toLowerCase().includes(text)
        );
    });

    // ── CREATE: Mở modal ở chế độ tạo mới ─────────────────────
    function handleAdd() {
        setEditingId(null);
        setForm({ ...emptyForm }); // spread để tạo object mới (tránh tham chiếu cũ)
        setError("");
        setShowModal(true);
    }

    // ── UPDATE: Mở modal ở chế độ chỉnh sửa ───────────────────
    function handleEdit(item) {
        setEditingId(item.id);
        setForm({ ...item }); // điền sẵn toàn bộ dữ liệu của item vào form
        setError("");
        setShowModal(true);
    }

    // ── SAVE ───────────────────────────────────────────────────
    function handleSave(e) {
        e.preventDefault(); // ngăn reload trang

        // Validate: title và content bắt buộc
        if (!form.title.trim() || !form.content.trim()) {
            setError("Title and content are required");
            return;
        }

        // Validate: categoryId phải tồn tại trong danh sách categories
        // .some() kiểm tra xem có category nào có id khớp không
        const validCategory = categories.some(
            (item) => item.id === form.categoryId
        );

        // Validate: createdBy phải tồn tại trong danh sách users
        const validAuthor = users.some(
            (item) => item.id === form.createdBy
        );

        if (!validCategory || !validAuthor) {
            setError("Please select a valid category and author");
            return;
        }

        // Chuẩn hóa dữ liệu trước khi lưu (trim whitespace)
        const newsData = {
            ...form,
            title: form.title.trim(),
            content: form.content.trim(),
        };

        if (editingId === null) {
            // CREATE: thêm bài viết mới vào cuối mảng
            // IMMUTABLE: tạo mảng mới với spread operator
            setNews((prev) => [
                ...prev,
                {
                    ...newsData,
                    id: crypto.randomUUID(), // tạo ID duy nhất
                },
            ]);
        } else {
            // UPDATE: thay thế đúng bài viết có id khớp
            // .map() duyệt mảng, trả về object mới tại vị trí cần update
            setNews((prev) =>
                prev.map((item) =>
                    item.id === editingId
                        ? { ...newsData, id: editingId } // giữ nguyên id cũ
                        : item
                )
            );
        }

        setShowModal(false);
    }

    // ── DELETE ─────────────────────────────────────────────────
    function handleDelete(item) {
        // News không có quan hệ bị phụ thuộc → có thể xóa trực tiếp
        const confirmed = window.confirm(
            `Delete news "${item.title}"?`
        );

        if (confirmed) {
            // .filter() tạo mảng mới loại bỏ phần tử bị xóa
            setNews((prev) =>
                prev.filter((article) => article.id !== item.id)
            );
        }
    }

    return (
        <div>
            <h1>News Management</h1>

            <div className="toolbar">
                <input
                    placeholder="Search news..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <button onClick={handleAdd}>+ Add News</button>
            </div>

            <div className="table-wrapper">
                <table>
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Author</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {filteredNews.map((item) => {
                        // Tra tên category từ categoryId (quan hệ dữ liệu)
                        // News chỉ lưu ID, cần .find() để lấy tên hiển thị
                        const category = categories.find(
                            (c) => c.id === item.categoryId
                        );

                        // Tra tên author từ createdBy (quan hệ dữ liệu)
                        const author = users.find(
                            (u) => u.id === item.createdBy
                        );

                        return (
                            <tr key={item.id}>
                                <td>{item.title}</td>
                                {/*
                                    category?.name: optional chaining
                                    - Nếu category = undefined (không tìm thấy) → trả về undefined (không crash)
                                    - || "Unknown": nếu undefined thì hiển thị "Unknown"
                                */}
                                <td>{category?.name || "Unknown"}</td>
                                <td>{author?.username || "Unknown"}</td>
                                <td>
                                    {item.status === 1 ? "Active" : "Inactive"}
                                </td>
                                <td>
                                    <button onClick={() => handleEdit(item)}>
                                        Edit
                                    </button>

                                    <button
                                        className="danger"
                                        onClick={() => handleDelete(item)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        );
                    })}

                    {/* Empty state: không có kết quả nào */}
                    {filteredNews.length === 0 && (
                        <tr>
                            <td colSpan="5">No news found</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* MODAL: tạo mới / chỉnh sửa bài viết */}
            {showModal && (
                <div className="modal-overlay">
                    <div
                        className="modal"
                        role="dialog"
                        aria-modal="true"
                        aria-label="News form"
                    >
                        <h2>
                            {editingId === null ? "Add News" : "Edit News"}
                        </h2>

                        <form onSubmit={handleSave}>
                            <label htmlFor="news-title">Title</label>
                            {/*
                                Cập nhật từng field trong object form bằng spread:
                                setForm({ ...form, title: e.target.value })
                                = copy toàn bộ form cũ, chỉ ghi đè field title
                                Không làm vậy → các field khác bị mất!
                            */}
                            <input
                                id="news-title"
                                value={form.title}
                                onChange={(e) =>
                                    setForm({ ...form, title: e.target.value })
                                }
                            />

                            <label htmlFor="news-content">Content</label>
                            <textarea
                                id="news-content"
                                value={form.content}
                                onChange={(e) =>
                                    setForm({ ...form, content: e.target.value })
                                }
                            />

                            <label htmlFor="news-category">Category</label>
                            {/* Dropdown: render danh sách categories từ props */}
                            <select
                                id="news-category"
                                value={form.categoryId}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        categoryId: e.target.value,
                                    })
                                }
                            >
                                <option value="">Select Category</option>
                                {/* Mỗi option lưu id làm value, hiển thị tên */}
                                {categories.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>

                            <label htmlFor="news-author">Author</label>
                            {/* Dropdown: render danh sách users từ props */}
                            <select
                                id="news-author"
                                value={form.createdBy}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        createdBy: e.target.value,
                                    })
                                }
                            >
                                <option value="">Select Author</option>
                                {users.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.username}
                                    </option>
                                ))}
                            </select>

                            <label htmlFor="news-status">Status</label>
                            <select
                                id="news-status"
                                value={form.status}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        status: Number(e.target.value), // chuyển string → number
                                    })
                                }
                            >
                                <option value={1}>Active</option>
                                <option value={0}>Inactive</option>
                            </select>

                            {error && <p className="error">{error}</p>}

                            <div className="modal-actions">
                                <button type="submit">Save</button>
                                <button
                                    type="button"
                                    className="secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NewsPage;
