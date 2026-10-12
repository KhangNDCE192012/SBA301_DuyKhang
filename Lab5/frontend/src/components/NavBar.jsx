
import { Link, NavLink } from "react-router-dom";

export default function NavBar() {
    return (
        <header className="orchid-header">
            <div className="orchid-nav">

                {/* Brand */}
                <Link to="/" className="orchid-brand">
                    <span className="brand-icon">✿</span>

                    <span className="brand-text">
            <strong>ORCHID</strong>
            <small>MANAGEMENT</small>
          </span>
                </Link>

                {/* Navigation */}
                <nav className="orchid-navigation">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            `orchid-nav-link ${isActive ? "active" : ""}`
                        }
                    >
                        Orchid List
                    </NavLink>

                    <NavLink
                        to="/orchids/new"
                        className={({ isActive }) =>
                            `orchid-nav-link ${isActive ? "active" : ""}`
                        }
                    >
                        Add Orchid
                    </NavLink>
                </nav>

            </div>
        </header>
    );
}
