import { useEffect, useState } from "react";

import categoryService from "../services/categoryService";

import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";

export default function CategoryManagement() {

    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const [error, setError] = useState("");

    const emptyForm = {
        categoryName: "",
        categoryDescription: "",
        parentCategoryId: "",
        isActive: true
    };

    const [form, setForm] = useState(emptyForm);

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

    useEffect(() => {
        loadCategories();
    }, [search]);

    const openCreate = () => {

        setEditing(null);
        setForm(emptyForm);
        setError("");
        setModalOpen(true);

    };

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

                await categoryService.update(
                    editing.categoryId,
                    data
                );

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

            <div className="page-heading">

                <div>
                    <span className="eyebrow">
                        CONTENT ORGANIZATION
                    </span>

                    <h1>Category Management</h1>

                    <p className="muted">
                        Organize university news categories.
                    </p>
                </div>

                <button
                    className="btn-primary"
                    onClick={openCreate}
                >
                    + Add Category
                </button>

            </div>

            <div className="management-toolbar">

                <input
                    type="search"
                    placeholder="Search categories..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />

                <span>{categories.length} categories</span>

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

                            <td>
                                <strong>
                                    {category.categoryName}
                                </strong>
                            </td>

                            <td>
                                {category.categoryDescription}
                            </td>

                            <td>
                                {category.parentCategoryId ?? "-"}
                            </td>

                            <td>
                                    <span className="status-badge">
                                        {category.isActive
                                            ? "Active"
                                            : "Inactive"}
                                    </span>
                            </td>

                            <td className="action-cell">

                                <button
                                    className="btn-edit"
                                    onClick={() => openEdit(category)}
                                >
                                    Edit
                                </button>

                                <button
                                    className="btn-delete"
                                    onClick={() =>
                                        setDeleteId(category.categoryId)
                                    }
                                >
                                    Delete
                                </button>

                            </td>

                        </tr>

                    ))}

                    </tbody>

                </table>

            </div>

            {modalOpen && (

                <Modal
                    title={editing
                        ? "Edit Category"
                        : "Create Category"}
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
                            .filter(c =>
                                c.categoryId !== editing?.categoryId
                            )
                            .map(c => (
                                <option
                                    key={c.categoryId}
                                    value={c.categoryId}
                                >
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