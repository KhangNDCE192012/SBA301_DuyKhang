/**
 * Nguyễn Duy Khang - CE192012 - Assignment 2
 * Màn hình Quản lý danh mục (CategoryManagement.jsx) dành cho Staff (Role 2):
 * - Xem toàn bộ danh mục và tìm kiếm theo tên hoặc mô tả.
 * - Thêm mới danh mục qua Popup Modal.
 * - Chỉnh sửa danh mục qua Popup Modal.
 * - Xóa danh mục qua ConfirmDialog với ràng buộc không được xóa nếu có bài báo hoặc có danh mục con.
 */

import { useEffect, useState } from "react";

import categoryService from "../services/categoryService";

import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";

export default function CategoryManagement() {

    // Danh sách danh mục và từ khóa tìm kiếm
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");

    // State quản lý Modal và ConfirmDialog
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null); // null = thêm mới, object = đang sửa
    const [deleteId, setDeleteId] = useState(null);

    // Thông báo lỗi
    const [error, setError] = useState("");

    // Form rỗng mặc định
    const emptyForm = {
        categoryName: "",
        categoryDescription: "",
        parentCategoryId: "",
        isActive: true
    };

    const [form, setForm] = useState(emptyForm);

    /**
     * Tải danh sách danh mục từ API qua categoryService.getAll(search)
     */
    const loadCategories = async () => {
        try {
            const data = await categoryService.getAll(search);
            setCategories(data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Cannot load categories"
            );
        }
    };

    // Tìm kiếm realtime khi gõ từ khóa
    useEffect(() => {
        loadCategories();
    }, [search]);

    /**
     * Nút "+ Add Category" click: Mở Modal ở chế độ thêm mới
     */
    const openCreate = () => {
        setEditing(null);
        setForm(emptyForm);
        setError("");
        setModalOpen(true);
    };

    /**
     * Nút "Edit" click: Mở Modal ở chế độ chỉnh sửa, nạp dữ liệu danh mục hiện tại
     */
    const openEdit = (category) => {
        setEditing(category);
        setForm({
            categoryName: category.categoryName,
            categoryDescription: category.categoryDescription,
            parentCategoryId: category.parentCategoryId ?? "",
            isActive: category.isActive
        });
        setError("");
        setModalOpen(true);
    };

    /**
     * Nút "Create" hoặc "Update" trong Modal click:
     * Chuyển đổi parentCategoryId sang Number hoặc null, sau đó gọi create/update của categoryService.
     */
    const handleSave = async () => {
        const data = {
            ...form,
            parentCategoryId:
                form.parentCategoryId === ""
                    ? null
                    : Number(form.parentCategoryId)
        };

        try {
            if (editing) {
                await categoryService.update(editing.categoryId, data);
            } else {
                await categoryService.create(data);
            }

            setModalOpen(false);
            await loadCategories();

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to save category"
            );
        }
    };

    /**
     * Nút "Delete" trong ConfirmDialog click:
     * Gọi categoryService.delete(deleteId). Nếu danh mục có bài báo hoặc có danh mục con,
     * backend sẽ ném lỗi 409 Conflict và thông báo tương ứng.
     */
    const handleDelete = async () => {
        try {
            await categoryService.delete(deleteId);
            setDeleteId(null);
            await loadCategories();
            setError("");
        } catch (err) {
            setDeleteId(null);
            setError(
                err.response?.data?.message ||
                "Unable to delete category"
            );
        }
    };

    return (
        <main className="page-container">

            {/* Tiêu đề trang và Nút thêm danh mục */}
            <div className="page-heading">
                <div>
                    <span className="eyebrow">CONTENT ORGANIZATION</span>
                    <h1>Category Management</h1>
                    <p className="muted">Organize university news categories.</p>
                </div>

                {/* NÚT THÊM DANH MỤC */}
                <button
                    className="btn-primary"
                    onClick={openCreate}
                >
                    + Add Category
                </button>
            </div>

            {/* Thanh tìm kiếm danh mục */}
            <div className="management-toolbar">
                <input
                    type="search"
                    placeholder="Search categories..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <span>{categories.length} categories</span>
            </div>

            {/* Hiển thị lỗi nếu có */}
            {error && (
                <div className="alert-error">
                    {error}
                </div>
            )}

            {/* Bảng danh sách danh mục */}
            <div className="table-wrapper">
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Parent ID</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {categories.map(category => (
                        <tr key={category.categoryId}>
                            <td>{category.categoryId}</td>
                            <td><strong>{category.categoryName}</strong></td>
                            <td>{category.categoryDescription}</td>
                            <td>{category.parentCategoryId ?? "-"}</td>
                            <td>
                                <span className="status-badge">
                                    {category.isActive ? "Active" : "Inactive"}
                                </span>
                            </td>
                            <td className="action-cell">
                                {/* NÚT SỬA */}
                                <button
                                    className="btn-edit"
                                    onClick={() => openEdit(category)}
                                >
                                    Edit
                                </button>

                                {/* NÚT XÓA - Mở ConfirmDialog */}
                                <button
                                    className="btn-delete"
                                    onClick={() => setDeleteId(category.categoryId)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* POPUP MODAL THÊM / SỬA DANH MỤC */}
            {modalOpen && (
                <Modal
                    title={editing ? "Edit Category" : "Create Category"}
                    onClose={() => setModalOpen(false)}
                    onSubmit={handleSave}
                    submitText={editing ? "Update" : "Create"}
                >
                    <label>Category Name</label>
                    <input
                        required
                        maxLength={100}
                        value={form.categoryName}
                        onChange={e => setForm({
                            ...form,
                            categoryName: e.target.value
                        })}
                    />

                    <label>Description</label>
                    <textarea
                        required
                        maxLength={250}
                        rows={4}
                        value={form.categoryDescription}
                        onChange={e => setForm({
                            ...form,
                            categoryDescription: e.target.value
                        })}
                    />

                    <label>Parent Category</label>
                    <select
                        value={form.parentCategoryId}
                        onChange={e => setForm({
                            ...form,
                            parentCategoryId: e.target.value
                        })}
                    >
                        <option value="">No parent</option>
                        {categories
                            .filter(c => c.categoryId !== editing?.categoryId)
                            .map(c => (
                                <option key={c.categoryId} value={c.categoryId}>
                                    {c.categoryName}
                                </option>
                            ))
                        }
                    </select>

                    <label>Status</label>
                    <select
                        value={String(form.isActive)}
                        onChange={e => setForm({
                            ...form,
                            isActive: e.target.value === "true"
                        })}
                    >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </Modal>
            )}

            {/* HỘP THOẠI XÁC NHẬN XÓA */}
            {deleteId !== null && (
                <ConfirmDialog
                    message="Are you sure you want to delete this category?"
                    onCancel={() => setDeleteId(null)}
                    onConfirm={handleDelete}
                />
            )}

        </main>
    );
}
