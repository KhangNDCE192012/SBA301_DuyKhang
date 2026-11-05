/**
 * Nguyễn Duy Khang - CE192012 - Assignment 2
 * Màn hình Quản lý tài khoản (AccountManagement.jsx) dành cho Admin (Role 1):
 * - Xem danh sách và tìm kiếm tài khoản theo tên hoặc email.
 * - Thêm tài khoản mới bằng Popup Modal.
 * - Chỉnh sửa tài khoản bằng Popup Modal.
 * - Xóa tài khoản kèm hộp thoại xác nhận (ConfirmDialog) và kiểm tra ràng buộc không được xóa nếu đã tạo bài báo.
 */

import { useEffect, useState } from "react";

import accountService from "../services/accountService";

import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";

export default function AccountManagement() {

    // Danh sách tài khoản và từ khóa tìm kiếm
    const [accounts, setAccounts] = useState([]);
    const [search, setSearch] = useState("");

    // State quản lý Modal thêm/sửa
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null); // null = thêm mới, object = đang chỉnh sửa
    const [deleteId, setDeleteId] = useState(null); // null = đóng dialog, id = ID tài khoản cần xóa

    // Thông báo lỗi
    const [error, setError] = useState("");

    // Dữ liệu form rỗng ban đầu
    const emptyForm = {
        accountName: "",
        accountEmail: "",
        accountRole: 2,
        accountPassword: ""
    };

    const [form, setForm] = useState(emptyForm);

    /**
     * Tải danh sách tài khoản từ API qua accountService.getAll(search)
     */
    const loadAccounts = async () => {
        try {
            const data = await accountService.getAll(search);
            setAccounts(data);
            setError("");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Cannot load accounts"
            );
        }
    };

    // Tự động tìm kiếm realtime khi ô input search thay đổi
    useEffect(() => {
        loadAccounts();
    }, [search]);

    /**
     * Nút "+ Add Account" click: Mở Modal ở chế độ thêm mới
     */
    const openCreate = () => {
        setEditing(null);
        setForm(emptyForm);
        setError("");
        setModalOpen(true);
    };

    /**
     * Nút "Edit" click: Mở Modal ở chế độ chỉnh sửa, nạp dữ liệu tài khoản vào form
     */
    const openEdit = (account) => {
        setEditing(account);
        setForm({
            accountName: account.accountName,
            accountEmail: account.accountEmail,
            accountRole: account.accountRole,
            accountPassword: "" // Để trống, nếu không đổi mật khẩu thì không cần nhập
        });
        setError("");
        setModalOpen(true);
    };

    /**
     * Nút "Create" hoặc "Update" trong Modal click:
     * - Nếu editing có giá trị: gọi accountService.update()
     * - Nếu editing là null: gọi accountService.create()
     * - Thành công: đóng modal và gọi lại loadAccounts()
     */
    const handleSave = async () => {
        try {
            if (editing) {
                await accountService.update(editing.accountId, form);
            } else {
                await accountService.create(form);
            }

            setModalOpen(false);
            await loadAccounts();

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to save account"
            );
        }
    };

    /**
     * Nút "Delete" trong ConfirmDialog click:
     * Gọi accountService.delete(deleteId). Nếu tài khoản đã tạo bài báo, backend sẽ ném lỗi 409
     * và hiển thị thông báo "Cannot delete account because it created news articles".
     */
    const handleDelete = async () => {
        try {
            await accountService.delete(deleteId);
            setDeleteId(null);
            await loadAccounts();
            setError("");
        } catch (err) {
            setDeleteId(null);
            setError(
                err.response?.data?.message ||
                "Unable to delete account"
            );
        }
    };

    return (
        <main className="page-container">

            {/* Tiêu đề trang và Nút thêm tài khoản */}
            <div className="page-heading">
                <div>
                    <span className="eyebrow">ADMINISTRATION</span>
                    <h1>Account Management</h1>
                    <p className="muted">Manage university system accounts.</p>
                </div>

                {/* NÚT THÊM TÀI KHOẢN MỚI */}
                <button
                    className="btn-primary"
                    onClick={openCreate}
                >
                    + Add Account
                </button>
            </div>

            {/* Thanh tìm kiếm tài khoản */}
            <div className="management-toolbar">
                <input
                    type="search"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <span>{accounts.length} accounts</span>
            </div>

            {/* Hiển thị thông báo lỗi nếu có */}
            {error && (
                <div className="alert-error">
                    {error}
                </div>
            )}

            {/* Bảng danh sách tài khoản */}
            <div className="table-wrapper">
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Account Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {accounts.map(account => (
                        <tr key={account.accountId}>
                            <td>{account.accountId}</td>
                            <td>{account.accountName}</td>
                            <td>{account.accountEmail}</td>
                            <td>
                                <span className="status-badge">
                                    {account.accountRole === 1 ? "Admin" : "Staff"}
                                </span>
                            </td>
                            <td className="action-cell">
                                {/* NÚT SỬA */}
                                <button
                                    className="btn-edit"
                                    onClick={() => openEdit(account)}
                                >
                                    Edit
                                </button>

                                {/* NÚT XÓA - Mở ConfirmDialog */}
                                <button
                                    className="btn-delete"
                                    onClick={() => setDeleteId(account.accountId)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {accounts.length === 0 && (
                    <p className="empty-state">No accounts found.</p>
                )}
            </div>

            {/* POPUP MODAL THÊM / SỬA TÀI KHOẢN */}
            {modalOpen && (
                <Modal
                    title={editing ? "Edit Account" : "Create Account"}
                    onClose={() => setModalOpen(false)}
                    onSubmit={handleSave}
                    submitText={editing ? "Update" : "Create"}
                >
                    <label>Account Name</label>
                    <input
                        required
                        maxLength={100}
                        value={form.accountName}
                        onChange={e => setForm({
                            ...form,
                            accountName: e.target.value
                        })}
                    />

                    <label>Email</label>
                    <input
                        required
                        type="email"
                        maxLength={70}
                        value={form.accountEmail}
                        onChange={e => setForm({
                            ...form,
                            accountEmail: e.target.value
                        })}
                    />

                    <label>Role</label>
                    <select
                        value={form.accountRole}
                        onChange={e => setForm({
                            ...form,
                            accountRole: Number(e.target.value)
                        })}
                    >
                        <option value={1}>Admin</option>
                        <option value={2}>Staff</option>
                    </select>

                    <label>
                        Password {editing && "(Leave blank to keep current)"}
                    </label>
                    <input
                        type="password"
                        required={!editing}
                        maxLength={70}
                        value={form.accountPassword}
                        onChange={e => setForm({
                            ...form,
                            accountPassword: e.target.value
                        })}
                    />
                </Modal>
            )}

            {/* HỘP THOẠI XÁC NHẬN XÓA (ConfirmDialog) */}
            {deleteId !== null && (
                <ConfirmDialog
                    message="Are you sure you want to delete this account?"
                    onCancel={() => setDeleteId(null)}
                    onConfirm={handleDelete}
                />
            )}

        </main>
    );
}
