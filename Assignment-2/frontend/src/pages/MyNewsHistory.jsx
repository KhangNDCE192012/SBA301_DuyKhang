/**
 * Nguyễn Duy Khang - CE192012 - Assignment 2
 * Màn hình Lịch sử bài viết của tôi (MyNewsHistory.jsx) dành cho Staff (Role 2):
 * Cho phép Staff xem lại toàn bộ các bài viết do chính mình đã tạo ra,
 * sắp xếp theo thứ tự ngày tạo mới nhất.
 */

import { useEffect, useState } from "react";
import newsService from "../services/newsService";

export default function MyNewsHistory() {

    // Danh sách các bài báo do chính Staff này tạo
    const [articles, setArticles] = useState([]);
    const [error, setError] = useState("");

    /**
     * useEffect kích hoạt một lần khi component được render:
     * Gọi newsService.getMyHistory() -> GET /api/news-articles/my-history
     * Backend sẽ tự động lấy thông tin Staff từ Bearer token để lọc ra đúng bài viết của Staff đó.
     */
    useEffect(() => {
        newsService.getMyHistory()
            .then(setArticles)
            .catch(err => setError(
                err.response?.data?.message ||
                "Unable to load history"
            ));
    }, []);

    return (
        <main className="page-container">

            {/* Tiêu đề trang */}
            <div className="page-heading">
                <div>
                    <span className="eyebrow">PERSONAL WORKSPACE</span>
                    <h1>My News History</h1>
                    <p className="muted">Review the articles you have created.</p>
                </div>
            </div>

            {/* Hiển thị lỗi nếu có */}
            {error && (
                <div className="alert-error">{error}</div>
            )}

            {/* Danh sách hiển thị từng bài viết dưới dạng thẻ lịch sử */}
            <div className="history-list">
                {articles.map(article => (
                    <article
                        className="history-item"
                        key={article.newsArticleId}
                    >
                        <div>
                            <span className="eyebrow">
                                {article.categoryName}
                            </span>

                            <h3>{article.headline}</h3>

                            <p>
                                {article.newsContent?.substring(0, 160)}
                                ...
                            </p>

                            <small>
                                Created: {
                                article.createdDate
                                    ? new Date(article.createdDate).toLocaleString()
                                    : "-"
                            }
                            </small>
                        </div>

                        {/* Trạng thái bài viết Active/Inactive */}
                        <span className="status-badge">
                            {article.newsStatus ? "Active" : "Inactive"}
                        </span>
                    </article>
                ))}
            </div>

            {/* Trạng thái chưa từng tạo bài viết nào */}
            {articles.length === 0 && (
                <p className="empty-state">
                    You have not created any news articles yet.
                </p>
            )}

        </main>
    );
}
