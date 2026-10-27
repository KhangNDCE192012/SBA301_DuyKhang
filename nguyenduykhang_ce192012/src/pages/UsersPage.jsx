// MỤC ĐÍCH: Trang quản lý người dùng — CRUD đầy đủ.
//
// Tương tự CategoryPage và NewsPage về cấu trúc,
// với các điểm đặc trưng:
//   - Role mapping: số 1 → "Admin", số 2 → "Staff"
//   - Không xóa được user nếu họ đang là tác giả của bài viết nào đó
//   - Không xóa được user trùng username
// ============================================================

import { useState } from "react";

// Props nhận từ App.jsx:
//   users:    mảng người dùng hiện tại
//   setUsers: hàm cập nhật mảng users trong App.jsx
//   news:     mảng bài viết (dùng để kiểm tra quan hệ khi xóa)
function UsersPage({ users, setUsers, news }) {
    // ── STATE SEARCH ───────────────────────────────────────────
    const [keyword, setKeyword] = useState("");

    // ── STATE MODAL ────────────────────────────────────────────
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null); // null = Create, id = Update

    // ── STATE FORM ─────────────────────────────────────────────
    const [error, setError] = useState("");

    // emptyForm: giá trị mặc định khi tạo mới (Staff, Active)
    const emptyForm = {
        username: "",
        role: 2,    // mặc định là Staff (2), không phải Admin (1)
        status: 1,  // mặc định Active
    };

    const [form, setForm] = useState(emptyForm);

    // ── SEARCH / FILTER ────────────────────────────────────────
    // Tìm kiếm theo username
    const filteredUsers = users.filter((item) =>
        item.username
            .toLowerCase()
            .includes(keyword.trim().toLowerCase())
    );

    // ── CREATE ─────────────────────────────────────────────────
    function handleAdd() {
        setEditingId(null);
        setForm({ ...emptyForm }); // reset form về trạng thái mặc định
        setError("");
        setShowModal(true);
    }

    // ── UPDATE ─────────────────────────────────────────────────
    function handleEdit(item) {
        setEditingId(item.id);
        setForm({ ...item }); // spread để tránh mutation object gốc
        setError("");
        setShowModal(true);
    }

    // ── SAVE ───────────────────────────────────────────────────
    function handleSave(e) {
        e.preventDefault();

        const username = form.username.trim();

        // Validate: username không được rỗng
        if (!username) {
            setError("Username is required");
            return;
        }

        // Validate: không trùng username với user khác
        const duplicated = users.some(
            (item) =>
                item.username.toLowerCase() ===
                username.toLowerCase() &&
                item.id !== editingId // loại trừ chính user đang sửa
        );

        if (duplicated) {
            setError("Username already exists");
            return;
        }

        // Chuẩn hóa dữ liệu (trim username)
        const userData = {
            ...form,
            username: username,
        };

        if (editingId === null) {
            // CREATE: IMMUTABLE — tạo mảng mới với spread operator
            setUsers((prev) => [
                ...prev,
                {
                    ...userData,
                    id: crypto.randomUUID(), // ID duy nhất tự động
                },
            ]);
        } else {
            // UPDATE: IMMUTABLE — .map() tạo mảng mới, thay thế đúng phần tử
            setUsers((prev) =>
                prev.map((item) =>
                    item.id === editingId
                        ? { ...userData, id: editingId } // giữ id cũ
                        : item
                )
            );
        }

        setShowModal(false);
    }

    // ── DELETE ─────────────────────────────────────────────────
    function handleDelete(item) {
        // Kiểm tra quan hệ: user này có đang là tác giả của bài viết nào không?
        // News.createdBy = user.id → không được xóa nếu còn quan hệ
        const isUsed = news.some(
            (article) => article.createdBy === item.id
        );

        if (isUsed) {
            alert("This user is the author of an existing news article.");
            return; // dừng, không xóa
        }

        const confirmed = window.confirm(
            `Delete user "${item.username}"?`
        );

        if (confirmed) {
            // .filter() IMMUTABLE: tạo mảng mới loại trừ user bị xóa
            setUsers((prev) =>
                prev.filter((user) => user.id !== item.id)
            );
        }
    }

    return (
        <div>
            <h1>User Management</h1>

            <div className="toolbar">
                <input
                    placeholder="Search username..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <button onClick={handleAdd}>+ Add User</button>
            </div>

            <div className="table-wrapper">
                <table>
                    <thead>
                    <tr>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {filteredUsers.map((item) => (
                        <tr key={item.id}>
                            <td>{item.username}</td>
                            <td>
                                {/* Role mapping: số → text dễ đọc */}
                                {/* role 1 = Admin, role 2 = Staff */}
                                {item.role === 1 ? "Admin" : "Staff"}
                            </td>
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
                    ))}

                    {/* Empty state */}
                    {filteredUsers.length === 0 && (
                        <tr>
                            <td colSpan="4">No users found</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* MODAL: tạo mới / chỉnh sửa user */}
            {showModal && (
                <div className="modal-overlay">
                    <div
                        className="modal"
                        role="dialog"
                        aria-modal="true"
                        aria-label="User form"
                    >
                        <h2>
                            {editingId === null ? "Add User" : "Edit User"}
                        </h2>

                        <form onSubmit={handleSave}>
                            <label htmlFor="user-name">Username</label>
                            {/*
                                Cập nhật từng field: spread toàn bộ form cũ,
                                chỉ ghi đè field username
                            */}
                            <input
                                id="user-name"
                                value={form.username}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        username: e.target.value,
                                    })
                                }
                            />

                            <label htmlFor="user-role">Role</label>
                            {/* Dropdown role: 1 = Admin, 2 = Staff */}
                            <select
                                id="user-role"
                                value={form.role}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        role: Number(e.target.value), // chuyển "1"/"2" → number
                                    })
                                }
                            >
                                <option value={1}>Admin</option>
                                <option value={2}>Staff</option>
                            </select>

                            <label htmlFor="user-status">Status</label>
                            <select
                                id="user-status"
                                value={form.status}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        status: Number(e.target.value),
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

export default UsersPage;
