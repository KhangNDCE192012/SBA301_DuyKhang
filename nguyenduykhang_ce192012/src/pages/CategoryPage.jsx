// MỤC ĐÍCH: Trang quản lý danh mục — cung cấp đầy đủ chức năng CRUD:
//
// Sử dụng 1 modal duy nhất cho cả Create lẫn Update,
// phân biệt bằng biến editingId (null = Create, có id = Update).
// ============================================================

import { useState } from "react";

// Props nhận từ App.jsx:
//   categories:    mảng danh mục hiện tại (đọc để hiển thị)
//   setCategories: hàm cập nhật mảng categories trong App.jsx
//   news:          mảng tin tức (dùng để kiểm tra quan hệ khi xóa)
function CategoryPage({ categories, setCategories, news }) {
    // ── STATE QUẢN LÝ SEARCH ───────────────────────────────────
    const [keyword, setKeyword] = useState(""); // từ khóa tìm kiếm hiện tại

    // ── STATE QUẢN LÝ MODAL ────────────────────────────────────
    const [showModal, setShowModal] = useState(false); // true = modal đang mở
    const [editingId, setEditingId] = useState(null);  // null = Create mode, id = Update mode

    // ── STATE QUẢN LÝ FORM (trong modal) ──────────────────────
    const [name, setName]     = useState("");  // giá trị input Name trong form
    const [status, setStatus] = useState(1);  // giá trị select Status (mặc định Active)
    const [error, setError]   = useState(""); // thông báo lỗi validation

    // ── SEARCH / FILTER ────────────────────────────────────────
    // filteredCategories = "displayed list" (danh sách hiển thị)
    // categories         = "source list"    (dữ liệu gốc, không bị ảnh hưởng bởi search)
    //
    // Mỗi lần keyword thay đổi → component re-render → filteredCategories tính lại tự động
    const filteredCategories = categories.filter((item) =>
        item.name
            .toLowerCase()
            .includes(keyword.trim().toLowerCase())
    );

    // ── CREATE: Mở modal ở chế độ "tạo mới" ───────────────────
    function handleAdd() {
        setEditingId(null); // null = chế độ Create
        setName("");        // reset form về rỗng
        setStatus(1);       // mặc định Active
        setError("");       // xóa thông báo lỗi cũ
        setShowModal(true); // hiện modal
    }

    // ── UPDATE: Mở modal ở chế độ "chỉnh sửa" ─────────────────
    // Điền sẵn dữ liệu của item được chọn vào form
    function handleEdit(item) {
        setEditingId(item.id); // lưu id của item đang sửa → xác định chế độ Update
        setName(item.name);    // điền tên hiện tại vào form
        setStatus(item.status);// điền trạng thái hiện tại vào form
        setError("");
        setShowModal(true);
    }

    // ── SAVE: Xử lý khi bấm nút Save trong modal ──────────────
    function handleSave(e) {
        // Ngăn form reload trang
        e.preventDefault();

        const newName = name.trim(); // loại bỏ khoảng trắng đầu/cuối

        // Validate: tên không được rỗng
        if (!newName) {
            setError("Category name is required");
            return;
        }

        // Validate: không trùng tên với category khác
        // .some() trả về true nếu có ÍT NHẤT 1 phần tử thỏa điều kiện
        const duplicated = categories.some(
            (item) =>
                item.name.toLowerCase() === newName.toLowerCase() &&
                item.id !== editingId // loại trừ chính item đang sửa
        );

        if (duplicated) {
            setError("Category name already exists");
            return;
        }

        if (editingId === null) {
            // ── CREATE: Thêm phần tử mới vào cuối mảng ──────────
            const newCategory = {
                id: crypto.randomUUID(), // tạo ID ngẫu nhiên duy nhất
                name: newName,
                status: status,
            };

            // IMMUTABLE UPDATE: tạo mảng MỚI thay vì sửa mảng cũ
            // [...prev, newCategory] = copy toàn bộ mảng cũ + thêm phần tử mới
            // Nếu dùng prev.push() → React không phát hiện thay đổi → UI không cập nhật!
            setCategories((prev) => [...prev, newCategory]);
        } else {
            // ── UPDATE: Thay thế đúng phần tử có id khớp ─────────
            // .map() duyệt qua từng phần tử, trả về mảng mới:
            //   - Nếu id khớp → trả về object MỚI với dữ liệu đã cập nhật
            //   - Nếu id không khớp → giữ nguyên object cũ
            setCategories((prev) =>
                prev.map((item) =>
                    item.id === editingId
                        ? { ...item, name: newName, status: status } // tạo object mới
                        : item
                )
            );
        }

        setShowModal(false); // đóng modal sau khi lưu thành công
    }

    // ── DELETE: Xóa danh mục ──────────────────────────────────
    function handleDelete(item) {
        // Kiểm tra quan hệ: category này có đang được dùng bởi bài viết News nào không?
        // .some() trả về true nếu tìm thấy ít nhất 1 news có categoryId trùng
        const isUsed = news.some(
            (article) => article.categoryId === item.id
        );

        // Nếu đang có news dùng → KHÔNG cho xóa (để tránh mất quan hệ dữ liệu)
        if (isUsed) {
            alert("This category is being used by news.");
            return;
        }

        // Hỏi xác nhận trước khi xóa
        const confirmed = window.confirm(
            `Delete category "${item.name}"?`
        );

        if (confirmed) {
            // IMMUTABLE UPDATE: .filter() tạo mảng mới chỉ chứa các phần tử KHÔNG bị xóa
            setCategories((prev) =>
                prev.filter((category) => category.id !== item.id)
            );
        }
    }

    return (
        <div>
            <h1>Category Management</h1>

            {/* Thanh công cụ: ô tìm kiếm + nút thêm mới */}
            <div className="toolbar">
                {/*
                    Controlled input cho search:
                    - value={keyword}: React kiểm soát giá trị
                    - onChange: mỗi lần gõ → setKeyword → re-render → filteredCategories cập nhật
                */}
                <input
                    placeholder="Search category..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />

                {/* Bấm nút này → handleAdd() mở modal ở chế độ Create */}
                <button onClick={handleAdd}>+ Add Category</button>
            </div>

            {/* Bảng hiển thị danh sách danh mục */}
            <div className="table-wrapper">
                <table>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {/*
                        Render từng dòng trong bảng bằng .map():
                        - key={item.id}: bắt buộc phải có, dùng id duy nhất để React tracking
                        - Hiển thị theo filteredCategories (kết quả search), không phải categories gốc
                    */}
                    {filteredCategories.map((item) => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>
                                {/* Conditional rendering: hiện text dựa theo giá trị status */}
                                {item.status === 1 ? "Active" : "Inactive"}
                            </td>
                            <td>
                                {/* Nút Edit: truyền item vào để form điền sẵn dữ liệu */}
                                <button onClick={() => handleEdit(item)}>
                                    Edit
                                </button>

                                {/* Nút Delete: truyền item vào để biết xóa cái nào */}
                                <button
                                    className="danger"
                                    onClick={() => handleDelete(item)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}

                    {/* Empty state: hiện thông báo khi không có kết quả nào (search hoặc list rỗng) */}
                    {filteredCategories.length === 0 && (
                        <tr>
                            <td colSpan="3">No categories found</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/*
                MODAL: chỉ render khi showModal === true
                Dùng cho cả Create và Update — phân biệt bằng editingId
            */}
            {showModal && (
                <div className="modal-overlay">
                    <div
                        className="modal"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Category form"
                    >
                        {/* Tiêu đề modal thay đổi theo chế độ */}
                        <h2>
                            {editingId === null
                                ? "Add Category"   // editingId = null → Create
                                : "Edit Category"} // editingId = id  → Update
                        </h2>

                        {/* Form trong modal: onSubmit gọi handleSave */}
                        <form onSubmit={handleSave}>
                            <label htmlFor="category-name">Name</label>
                            {/* Controlled input: value gắn với state name */}
                            <input
                                id="category-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />

                            <label htmlFor="category-status">Status</label>
                            {/*
                                Controlled select: value gắn với state status
                                Number(e.target.value): chuyển string "1"/"0" thành số 1/0
                                vì select luôn trả về string
                            */}
                            <select
                                id="category-status"
                                value={status}
                                onChange={(e) =>
                                    setStatus(Number(e.target.value))
                                }
                            >
                                <option value={1}>Active</option>
                                <option value={0}>Inactive</option>
                            </select>

                            {/* Hiện thông báo lỗi nếu có */}
                            {error && <p className="error">{error}</p>}

                            <div className="modal-actions">
                                {/* type="submit" → kích hoạt onSubmit của form → gọi handleSave */}
                                <button type="submit">Save</button>

                                {/*
                                    type="button" → KHÔNG kích hoạt onSubmit
                                    Bấm Cancel → chỉ đóng modal, không lưu gì
                                */}
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

export default CategoryPage;
