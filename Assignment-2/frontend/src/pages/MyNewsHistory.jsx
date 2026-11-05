import { useEffect, useState } from "react";
import newsService from "../services/newsService";

export default function MyNewsHistory() {

    const [articles, setArticles] = useState([]);
    const [error, setError] = useState("");

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

            <div className="page-heading">
                <div>
                    <span className="eyebrow">
                        PERSONAL WORKSPACE
                    </span>

                    <h1>My News History</h1>

                    <p className="muted">
                        Review the articles you have created.
                    </p>
                </div>
            </div>

            {error && (
                <div className="alert-error">{error}</div>
            )}

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
                                    ? new Date(
                                        article.createdDate
                                    ).toLocaleString()
                                    : "-"
                            }
                            </small>
                        </div>

                        <span className="status-badge">
                            {article.newsStatus
                                ? "Active"
                                : "Inactive"}
                        </span>

                    </article>

                ))}

            </div>

            {articles.length === 0 && (
                <p className="empty-state">
                    You have not created any news articles yet.
                </p>
            )}

        </main>
    );
}