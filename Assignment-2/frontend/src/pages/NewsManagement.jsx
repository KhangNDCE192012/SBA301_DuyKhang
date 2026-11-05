import { useEffect, useState } from "react";

import newsService from "../services/newsService";
import categoryService from "../services/categoryService";
import tagService from "../services/tagService";

import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";

export default function NewsManagement() {

    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);

    const [search, setSearch] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const [error, setError] = useState("");

    const emptyForm = {
        newsTitle: "",
        headline: "",
        newsContent: "",
        newsSource: "",
        categoryId: "",
        newsStatus: true,
        tagIds: []
    };

    const [form, setForm] = useState(emptyForm);

    const loadData = async () => {

        try {

            const [news, categoryData, tagData] =
                await Promise.all([
                    newsService.getAll({
                        search,
                        activeOnly: false
                    }),
                    categoryService.getAll(),
                    tagService.getAll()
                ]);

            setArticles(news);
            setCategories(categoryData);
            setTags(tagData);

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Unable to load data"
            );

        }
    };

    useEffect(() => {
        loadData();
    }, [search]);

    const openCreate = () => {

        setEditing(null);
        setForm(emptyForm);
        setError("");
        setModalOpen(true);

    };

    const openEdit = (article) => {

        setEditing(article);

        setForm({
            newsTitle: article.newsTitle || "",
            headline: article.headline || "",
            newsContent: article.newsContent || "",
            newsSource: article.newsSource || "",
            categoryId: article.categoryId,
            newsStatus: article.newsStatus,
            tagIds: article.tags.map(tag => tag.tagId)
        });

        setError("");
        setModalOpen(true);

    };

    const toggleTag = (id) => {

        setForm(previous => ({

            ...previous,

            tagIds: previous.tagIds.includes(id)

                ? previous.tagIds.filter(
                    tagId => tagId !== id
                )

                : [...previous.tagIds, id]

        }));
    };

    const handleSave = async () => {

        const data = {
            ...form,
            categoryId: Number(form.categoryId)
        };

        try {

            if (editing) {

                await newsService.update(
                    editing.newsArticleId,
                    data
                );

            } else {

                await newsService.create(data);

            }

            setModalOpen(false);
            await loadData();

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Unable to save article"
            );

        }
    };

    const handleDelete = async () => {

        try {

            await newsService.delete(deleteId);

            setDeleteId(null);
            await loadData();

        } catch (err) {

            setDeleteId(null);

            setError(
                err.response?.data?.message ||
                "Unable to delete article"
            );

        }
    };

    return (

        <main className="page-container">

            <div className="page-heading">

                <div>
                    <span className="eyebrow">
                        EDITORIAL WORKSPACE
                    </span>

                    <h1>News Management</h1>

                    <p className="muted">
                        Create and manage university stories.
                    </p>
                </div>

                <button
                    className="btn-primary"
                    onClick={openCreate}
                >
                    + Create Article
                </button>

            </div>

            <div className="management-toolbar">

                <input
                    type="search"
                    placeholder="Search articles..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />

                <span>{articles.length} articles</span>

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
                        <th>Article</th>
                        <th>Category</th>
                        <th>Author</th>
                        <th>Status</th>
                        <th>Tags</th>
                        <th>Actions</th>
                    </tr>
                    </thead>

                    <tbody>

                    {articles.map(article => (

                        <tr key={article.newsArticleId}>

                            <td>
                                <strong>
                                    {article.headline}
                                </strong>

                                <small className="table-subtitle">
                                    {article.newsTitle}
                                </small>
                            </td>

                            <td>{article.categoryName}</td>

                            <td>{article.createdByName}</td>

                            <td>
                                    <span className="status-badge">
                                        {article.newsStatus
                                            ? "Active"
                                            : "Inactive"}
                                    </span>
                            </td>

                            <td>
                                {article.tags
                                    .map(t => t.tagName)
                                    .join(", ")}
                            </td>

                            <td className="action-cell">

                                <button
                                    className="btn-edit"
                                    onClick={() => openEdit(article)}
                                >
                                    Edit
                                </button>

                                <button
                                    className="btn-delete"
                                    onClick={() =>
                                        setDeleteId(
                                            article.newsArticleId
                                        )
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
                        ? "Edit Article"
                        : "Create Article"}
                    onClose={() => setModalOpen(false)}
                    onSubmit={handleSave}
                    submitText={editing ? "Update" : "Publish"}
                >

                    <label>News Title</label>

                    <input
                        required
                        maxLength={400}
                        value={form.newsTitle}
                        onChange={e => setForm({
                            ...form,
                            newsTitle: e.target.value
                        })}
                    />

                    <label>Headline</label>

                    <input
                        required
                        maxLength={150}
                        value={form.headline}
                        onChange={e => setForm({
                            ...form,
                            headline: e.target.value
                        })}
                    />

                    <label>Content</label>

                    <textarea
                        required
                        rows={6}
                        maxLength={4000}
                        value={form.newsContent}
                        onChange={e => setForm({
                            ...form,
                            newsContent: e.target.value
                        })}
                    />

                    <label>News Source</label>

                    <input
                        maxLength={400}
                        value={form.newsSource}
                        onChange={e => setForm({
                            ...form,
                            newsSource: e.target.value
                        })}
                    />

                    <label>Category</label>

                    <select
                        required
                        value={form.categoryId}
                        onChange={e => setForm({
                            ...form,
                            categoryId: e.target.value
                        })}
                    >

                        <option value="">
                            Select category
                        </option>

                        {categories
                            .filter(c => c.isActive)
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

                    <label>Tags</label>

                    <div className="tag-options">

                        {tags.map(tag => (

                            <label
                                className="tag-option"
                                key={tag.tagId}
                            >

                                <input
                                    type="checkbox"
                                    checked={form.tagIds.includes(tag.tagId)}
                                    onChange={() => toggleTag(tag.tagId)}
                                />

                                {tag.tagName}

                            </label>

                        ))}

                    </div>

                    <label>News Status</label>

                    <select
                        value={String(form.newsStatus)}
                        onChange={e => setForm({
                            ...form,
                            newsStatus: e.target.value === "true"
                        })}
                    >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>

                </Modal>

            )}

            {deleteId !== null && (

                <ConfirmDialog
                    message="Are you sure you want to delete this news article?"
                    onCancel={() => setDeleteId(null)}
                    onConfirm={handleDelete}
                />

            )}

        </main>
    );
}