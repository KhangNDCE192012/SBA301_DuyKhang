
import { useEffect, useState } from "react";

import newsService from "../services/newsService";
import categoryService from "../services/categoryService";

export default function PublicNews() {

    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);

    const [search, setSearch] = useState("");
    const [categoryId, setCategoryId] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // LOAD NEWS AND CATEGORIES

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

            // Only display active news articles
            setArticles(news);

            // Only display active categories
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

    // RELOAD WHEN SEARCH OR CATEGORY CHANGES

    useEffect(() => {

        loadData();

    }, [search, categoryId]);

    return (

        <main className="page-container">

            {/* HERO SECTION */}

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

            {/* SEARCH AND CATEGORY FILTER */}

            <section className="news-toolbar">

                <input
                    type="search"
                    placeholder="Search university news..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

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

            {/* SECTION HEADING */}

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

            {/* LOADING */}

            {loading && (
                <p>Loading news...</p>
            )}

            {/* ERROR */}

            {error && (
                <p className="error-text">
                    {error}
                </p>
            )}

            {/* EMPTY STATE */}

            {!loading && articles.length === 0 && !error && (

                <p className="empty-state">
                    No news articles found.
                </p>

            )}

            {/* NEWS GRID */}

            <div className="news-grid">

                {!loading && articles.map((article, index) => (

                    <article
                        className="news-card"
                        key={article.newsArticleId}
                    >

                        {/* NEWS ART */}

                        <div className={`news-art art-${index % 4}`}>

                            <span>FU NEWS</span>

                            <strong>
                                {article.categoryName}
                            </strong>

                        </div>

                        {/* NEWS CONTENT */}

                        <div className="news-card-body">

                            <span className="eyebrow">
                                {article.categoryName}
                            </span>

                            <h3>
                                {article.headline}
                            </h3>

                            <p>
                                {article.newsContent?.substring(0, 150)}
                                {article.newsContent?.length > 150
                                    ? "..."
                                    : ""}
                            </p>

                            {/* NEWS INFORMATION */}

                            <div className="news-meta">

                                <span>
                                    {article.createdByName}
                                </span>

                                <span>
                                    {article.createdDate
                                        ? new Date(
                                            article.createdDate
                                        ).toLocaleDateString()
                                        : ""}
                                </span>

                            </div>

                            {/* FULL ARTICLE */}

                            <details className="article-details">

                                <summary>
                                    Read article
                                </summary>

                                <h3>
                                    {article.newsTitle}
                                </h3>

                                <p className="article-full-content">
                                    {article.newsContent}
                                </p>

                                <p>
                                    Source: {article.newsSource}
                                </p>

                            </details>

                        </div>

                    </article>

                ))}

            </div>

        </main>

    );
}
