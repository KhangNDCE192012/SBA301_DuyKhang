import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (

        <header className="site-header">

            <Link to="/" className="brand">
                <span className="brand-icon">F</span>

                <span>
                    <strong>FU NEWSROOM</strong>
                    <small>UNIVERSITY MEDIA</small>
                </span>
            </Link>

            <nav className="main-nav">

                <Link to="/">News</Link>

                {user?.accountRole === 1 && (
                    <Link to="/admin/accounts">
                        Accounts
                    </Link>
                )}

                {user?.accountRole === 2 && (
                    <>
                        <Link to="/staff/categories">
                            Categories
                        </Link>

                        <Link to="/staff/news">
                            Articles
                        </Link>

                        <Link to="/staff/history">
                            My History
                        </Link>

                        <Link to="/staff/profile">
                            My Profile
                        </Link>
                    </>
                )}

            </nav>

            <div className="header-right">

                {user ? (

                    <>
                        <span className="user-label">
                            {user.accountName}
                        </span>

                        <button
                            className="btn-secondary"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>

                ) : (

                    <Link
                        to="/login"
                        className="btn-primary"
                    >
                        Staff Login
                    </Link>

                )}

            </div>

        </header>
    );
}