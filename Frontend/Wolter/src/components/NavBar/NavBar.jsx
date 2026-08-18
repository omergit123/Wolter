import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthorization } from "../../context/AuthorizationContext";
import "./NavBar.css";

export default function Navbar() {
    const { isAuthenticated, logout, user, profileImageUrl } = useAuthorization();
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });
    const navigate = useNavigate();

    const placeholderUrl = "https://via.placeholder.com/200?text=No+Image";

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    // theme toggle effect
    useEffect(() => {
        document.body.classList.toggle("dark-theme", darkMode);
        document.body.classList.toggle("light-theme", !darkMode);
        document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
        localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode]);

    const toggleTheme = () => {
        setDarkMode((prev) => !prev);
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                {!isAuthenticated ? (
                    <Link to="/" className="nav-link">
                        Home
                    </Link>
                ) : (
                    <>
                        <Link to="/main" className="nav-link">
                            Main Page
                        </Link>
                        {(user &&
                            <Link to="/profile" className="nav-profile-container">
                                <img
                                    className="nav-profile-img"
                                    src={profileImageUrl || placeholderUrl}
                                    alt={user.name}
                                    onError={(event) => {
                                        event.currentTarget.onerror = null;
                                        event.currentTarget.src = placeholderUrl;
                                    }}
                                />
                                <span className="nav-profile-name">{user.name}</span>
                            </Link>
                        )}
                    </>

                )}
            </div>

            <div className="navbar-right">
                {!isAuthenticated ? (
                    <>
                        <Link to="/login" className="nav-link">
                            Login
                        </Link>

                        <Link to="/register" className="nav-link">
                            Register
                        </Link>
                    </>
                ) : (
                    <>
                        <Link to="/checkout" className="nav-link">
                            Checkout
                        </Link>

                        <Link to="/orders" className="nav-link">
                            My orders
                        </Link>

                        <button className="nav-button" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                )}

                <button className="nav-button" onClick={toggleTheme}>
                    {darkMode ? "☀ Light" : "🌙 Dark"}
                </button>
            </div>
        </nav>
    );
}