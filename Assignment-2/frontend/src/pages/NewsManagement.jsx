/**
 * Nguyễn Duy Khang - CE192012 - Assignment 2
 * Màn hình Quản lý bài viết tin tức (NewsManagement.jsx) dành cho Staff (Role 2):
 * - Xem toàn bộ bài báo (kể cả inactive) và tìm kiếm bài báo realtime.
 * - Thêm bài báo mới qua Popup Modal (chọn Category, trạng thái, chọn nhiều Tags).
 * - Sửa bài báo qua Popup Modal.
 * - Xóa bài báo kèm hộp thoại xác nhận (ConfirmDialog).
 */

import { useEffect, useState } from "react";

import newsService from "../services/newsService";
import categoryService from "../services/categoryService";
import tagService from "../services/tagService";

import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";

export default function NewsManagement() {

    // Danh sách bài báo, danh mục và tags
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);

    // Từ khóa tìm kiếm
    const [search, setSearch] = useState("");

    // State quản lý Modal thêm/sửa và ConfirmDialog xóa
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null); // null = thêm mới, object = đang sửa
    const [deleteId, setDeleteId] = useState(null);

    // Thông báo lỗi
    const [error, setError] = useState("");

    // Form rỗng mặc định
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

    /**
     * Tải đồng thời danh sách bài báo (activeOnly=false), danh mục và tags
     */
    const loadData = async () => {
        try {
            const [news, categoryData, tagData] = await Promise.all([
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

    // Tìm kiếm realtime khi gõ từ khóa
    useEffect(() => {
        loadData();
    }, [search]);

    /**
     * Nút "+ Create Article" click: Mở Modal ở chế độ thêm mới
     */
    const openCreate = () => {
        setEditing(null);
        setForm(emptyForm);
        setError("");
        setModalOpen(true);
    };

    /**
     * Nút "Edit" click: Mở Modal ở chế độ chỉnh sửa, nạp dữ liệu bài báo cũ và danh sách Tag IDs
     */
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

    /**
     * Nút chọn/bỏ chọn Tag (Toggle):
     * Nếu tagId đã có trong mảng thì loại bỏ ra, nếu chưa có thì thêm vào
     */
    const toggleTag = (id) => {
        setForm(previous => ({
            ...previous,
            tagIds: previous.tagIds.includes(id)
                ? previous.tagIds.filter(tagId => tagId !== id)
                : [...previous.tagIds, id]
        }));
    };

    /**
     * Nút "Save" hoặc "Update" trong Modal click:
     * Gọi newsService.update() hoặc newsService.create() tùy theo biến editing
     */
    const handleSave = async () => {
        const data = {
            ...form,
            categoryId: Number(form.categoryId)
        };

        try {
            if (editing) {
                await newsService.update(editing.newsArticleId, data);
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

    /**
     * Nút "Delete" trong ConfirmDialog click:
     * Gọi newsService.delete(deleteId) để xóa bài viết
     */
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

            {/* Tiêu đề trang và Nút tạo bài viết mới */}
            <div className="page-heading">
                <div>
                    <span className="eyebrow">EDITORIAL WORKSPACE</span>
                    <h1>News Management</h1>
                    <p className="muted">Create, edit and publish university news.</p>
                </div>

                {/* NÚT TẠO BÀI BÁO */}
                <button
                    className="btn-primary"
                    onClick={openCreate}
                >
                    + Create Article
                </button>
            </div>

            {/* Thanh tìm kiếm bài báo */}
            <div className="management-toolbar">
                <input
                    type="search"
                    placeholder="Search articles..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <span>{articles.length} articles</span>
            </div>

            {/* Thông báo lỗi nếu có */}
            {error && (
                <div className="alert-error">
                    {error}
                </div>
            )}

            {/* Bảng danh sách bài báo */}
            <div className="table-wrapper">
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title & Headline</th>
                        <th>Category</th>
                        <th>Author</th>
                        <th>Tags</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {articles.map(article => (
                        <tr key={article.newsArticleId}>
                            <td>{article.newsArticleId}</td>
                            <td>
                                <strong>{article.newsTitle}</strong>
                                <small className="table-subtext">{article.headline}</small>
                            </td>
                            <td>{article.categoryName}</td>
                            <td>{article.createdByName}</td>
                            <td>
                                <div className="tag-badges">
                                    {article.tags.map(tag => (
                                        <span key={tag.tagId} className="tag-pill">
                                            #{tag.tagName}
                                        </span>
                                    ))}
                                </div>
                            </td>
                            <td>
                                <span className="status-badge">
                                    {article.newsStatus ? "Active" : "Inactive"}
                                </span>
                            </td>
                            <td className="action-cell">
                                {/* NÚT SỬA */}
                                <button
                                    className="btn-edit"
                                    onClick={() => openEdit(article)}
                                >
                                    Edit
                                </button>

                                {/* NÚT XÓA - Mở ConfirmDialog */}
                                <button
                                    className="btn-delete"
                                    onClick={() => setDeleteId(article.newsArticleId)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* POPUP MODAL TẠO / SỬA BÀI VIẾT */}
            {modalOpen && (
                <Modal
                    title={editing ? "Edit Article" : "Create Article"}
                    onClose={() => setModalOpen(false)}
                    onSubmit={handleSave}
                    submitText={editing ? "Update" : "Save"}
                >
                    <label>Title</label>
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

                    <label>Category</label>
                    <select
                        required
                        value={form.categoryId}
                        onChange={e => setForm({
                            ...form,
                            categoryId: e.target.value
                        })}
                    >
                        <option value="">Select category</option>
                        {categories.map(category => (
                            <option
                                key={category.categoryId}
                                value={category.categoryId}
                            >
                                {category.categoryName}
                            </option>
                        ))}
                    </select>

                    <label>Content</label>
                    <textarea
                        required
                        maxLength={4000}
                        rows={6}
                        value={form.newsContent}
                        onChange={e => setForm({
                            ...form,
                            newsContent: e.target.value
                        })}
                    />

                    <label>Source</label>
                    <input
                        maxLength={400}
                        value={form.newsSource}
                        onChange={e => setForm({
                            ...form,
                            newsSource: e.target.value
                        })}
                    />

                    <label>Status</label>
                    <select
                        value={String(form.newsStatus)}
                        onChange={e => setForm({
                            ...form,
                            newsStatus: e.target.value === "true"
                        })}
                    >
                        <option value="true">Active (Published)</option>
                        <option value="false">Inactive (Draft)</option>
                    </select>

                    {/* Danh sách Tags chọn nhiều (Toggle Tags) */}
                    <label>Tags</label>
                    <div className="tag-selector">
                        {tags.map(tag => (
                            <button
                                key={tag.tagId}
                                type="button"
                                className={`tag-select-btn ${
                                    form.tagIds.includes(tag.tagId) ? "selected" : ""
                                }`}
                                onClick={() => toggleTag(tag.tagId)}
                            >
                                #{tag.tagName}
                            </button>
                        ))}
                    </div>
                </Modal>
            )}

            {/* HỘP THOẠI XÁC NHẬN XÓA */}
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
