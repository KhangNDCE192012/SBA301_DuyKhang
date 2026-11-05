import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Login() {

    const { login, loading } = useAuth();

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();
        setError("");

        if (!email.trim() || !password) {
            setError("Please enter email and password.");
            return;
        }

        try {

            const account = await login(email, password);

            if (account.accountRole === 1) {
                navigate("/admin/accounts");
            } else if (account.accountRole === 2) {
                navigate("/staff/news");
            }

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Login failed. Please try again."
            );

        }
    };

    return (

        <main className="login-page">

            <div className="login-decoration">
                <span>FU</span>
                <h1>Stories that<br />move knowledge.</h1>
                <p>
                    University news, research and
                    campus stories in one place.
                </p>
            </div>

            <div className="login-card">

                <span className="eyebrow">
                    STAFF PORTAL
                </span>

                <h2>Welcome back</h2>

                <p className="muted">
                    Sign in to manage university news.
                </p>

                <form onSubmit={handleSubmit}>

                    <label>Email address</label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />

                    <label>Password</label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />

                    {error && (
                        <p className="error-text">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="btn-primary full-width"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>

                </form>

                <Link to="/" className="back-link">
                    ← Back to public news
                </Link>

            </div>

        </main>
    );
}