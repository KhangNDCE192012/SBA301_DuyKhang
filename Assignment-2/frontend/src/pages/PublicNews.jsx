/**
 * Nguyễn Duy Khang - CE192012 - Assignment 2
 * Màn hình Tin tức công khai (PublicNews.jsx):
 * Dành cho mọi người dùng (kể cả chưa đăng nhập) để xem danh sách các bài báo có trạng thái kích hoạt (active).
 * Hỗ trợ tìm kiếm theo từ khóa và lọc danh mục bài viết.
 */

import { useEffect, useState } from "react";

import newsService from "../services/newsService";
import categoryService from "../services/categoryService";

export default function PublicNews() {

    // Danh sách bài báo và danh mục lấy từ API
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);

    // State lưu giá trị tìm kiếm và danh mục đang chọn để lọc
    const [search, setSearch] = useState("");
    const [categoryId, setCategoryId] = useState("");

    // Trạng thái tải dữ liệu và lỗi
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /**
     * Tải dữ liệu bài viết và danh mục công khai:
     * - Chỉ lấy các bài viết có activeOnly = true.
     * - Chỉ hiển thị các danh mục đang hoạt động (isActive = true).
     * - Gọi đồng thời newsService.getAll() và categoryService.getAll() qua Promise.all.
     */
    const loadData = async () => {
        setLoading(true);
        setError("");

        try {
            const params = {
                search,
                activeOnly: true
            };

            if (categoryId) {
                params.categoryId = categoryId;
            }

            const [news, categoryData] = await Promise.all([
                newsService.getAll(params),
                categoryService.getAll()
            ]);

            setArticles(news);
            setCategories(
                categoryData.filter(category => category.isActive)
            );

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load news."
            );
        } finally {
            setLoading(false);
        }
    };

    /**
     * useEffect kích hoạt tự động loadData mỗi khi:
     * - Người dùng gõ vào ô search (search thay đổi)
     * - Người dùng chọn danh mục khác trong dropdown (categoryId thay đổi)
     */
    useEffect(() => {
        loadData();
    }, [search, categoryId]);

    return (
        <main className="page-container">

            {/* Banner giới thiệu đầu trang */}
            <section className="hero-section">
                <span className="eyebrow">
                    UNIVERSITY NEWSROOM
                </span>

                <h1>
                    Ideas, people and<br />
                    <span>university life.</span>
                </h1>

                <p>
                    Discover the latest stories,
                    research and announcements.
                </p>
            </section>

            {/* Thanh công cụ: Ô tìm kiếm và Dropdown chọn danh mục */}
            <section className="news-toolbar">

                {/* Input tìm kiếm bài báo */}
                <input
                    type="search"
                    placeholder="Search university news..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {/* Dropdown lọc theo danh mục */}
                <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                >
                    <option value="">
                        All categories
                    </option>

                    {categories.map(category => (
                        <option
                            key={category.categoryId}
                            value={category.categoryId}
                        >
                            {category.categoryName}
                        </option>
                    ))}
                </select>

            </section>

            {/* Tiêu đề phần danh sách bài báo */}
            <section className="section-heading">
                <div>
                    <span className="eyebrow">
                        LATEST UPDATES
                    </span>
                    <h2>Campus stories</h2>
                </div>

                <span>
                    {articles.length} articles
                </span>
            </section>

            {/* Thông báo đang tải hoặc lỗi */}
            {loading && <p>Loading news...</p>}
            {error && <p className="error-text">{error}</p>}

            {/* Trạng thái không có bài viết nào phù hợp */}
            {!loading && articles.length === 0 && !error && (
                <p className="empty-state">
                    No news articles found.
                </p>
            )}

            {/* Lưới hiển thị danh sách bài báo */}
            <div className="news-grid">
                {!loading && articles.map((article, index) => (
                    <article
                        className="news-card"
                        key={article.newsArticleId}
                    >
                        {/* Hình minh họa màu sắc theo index */}
                        <div className={`news-art art-${index % 4}`}>
                            <span>FU NEWS</span>
                            <strong>{article.categoryName}</strong>
                        </div>

                        {/* Thẻ nội dung bài báo */}
                        <div className="news-card-body">
                            <span className="eyebrow">
                                {article.categoryName}
                            </span>

                            <h3>{article.headline}</h3>

                            <p>
                                {article.newsContent?.substring(0, 150)}
                                {article.newsContent?.length > 150 ? "..." : ""}
                            </p>

                            {/* Thông tin người tạo và ngày tạo */}
                            <div className="news-meta">
                                <span>{article.createdByName}</span>
                                <span>
                                    {article.createdDate
                                        ? new Date(article.createdDate).toLocaleDateString()
                                        : ""}
                                </span>
                            </div>

                            {/* Chi tiết nội dung bài báo (bấm vào để mở rộng) */}
                            <details className="article-details">
                                <summary>Read article</summary>
                                <h3>{article.newsTitle}</h3>
                                <p className="article-full-content">{article.newsContent}</p>
                                <p>Source: {article.newsSource}</p>
                            </details>
                        </div>
                    </article>
                ))}
            </div>

        </main>
    );
}
