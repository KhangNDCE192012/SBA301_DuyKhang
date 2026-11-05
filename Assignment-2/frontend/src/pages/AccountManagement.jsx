import { useEffect, useState } from "react";

import accountService from "../services/accountService";

import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";

export default function AccountManagement() {

    const [accounts, setAccounts] = useState([]);
    const [search, setSearch] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const [error, setError] = useState("");

    const emptyForm = {
        accountName: "",
        accountEmail: "",
        accountRole: 2,
        accountPassword: ""
    };

    const [form, setForm] = useState(emptyForm);

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

    useEffect(() => {
        loadAccounts();
    }, [search]);

    const openCreate = () => {
        setEditing(null);
        setForm(emptyForm);
        setError("");
        setModalOpen(true);
    };

    const openEdit = (account) => {

        setEditing(account);

        setForm({
            accountName: account.accountName,
            accountEmail: account.accountEmail,
            accountRole: account.accountRole,
            accountPassword: ""
        });

        setError("");
        setModalOpen(true);
    };

    const handleSave = async () => {

        try {

            if (editing) {

                await accountService.update(
                    editing.accountId,
                    form
                );

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

            <div className="page-heading">

                <div>
                    <span className="eyebrow">
                        ADMINISTRATION
                    </span>

                    <h1>Account Management</h1>

                    <p className="muted">
                        Manage university system accounts.
                    </p>
                </div>

                <button
                    className="btn-primary"
                    onClick={openCreate}
                >
                    + Add Account
                </button>

            </div>

            <div className="management-toolbar">

                <input
                    type="search"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <span>{accounts.length} accounts</span>

            </div>

            {error && (
                <div className="alert-error">
                    {error}
                </div>
            )}

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
                                        {account.accountRole === 1
                                            ? "Admin"
                                            : "Staff"}
                                    </span>
                            </td>

                            <td className="action-cell">

                                <button
                                    className="btn-edit"
                                    onClick={() => openEdit(account)}
                                >
                                    Edit
                                </button>

                                <button
                                    className="btn-delete"
                                    onClick={() =>
                                        setDeleteId(account.accountId)
                                    }
                                >
                                    Delete
                                </button>

                            </td>

                        </tr>

                    ))}

                    </tbody>

                </table>

                {accounts.length === 0 && (
                    <p className="empty-state">
                        No accounts found.
                    </p>
                )}

            </div>

            {modalOpen && (

                <Modal
                    title={editing
                        ? "Edit Account"
                        : "Create Account"}
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