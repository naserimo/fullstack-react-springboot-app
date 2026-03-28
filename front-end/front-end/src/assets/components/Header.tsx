import React from "react";
import { Link } from "react-router-dom";
import logo from "../images/logotransparent.png";

interface HeaderProps {
    isLoggedIn: boolean;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, onLogout }) => {
    const role = localStorage.getItem("role"); // Get role from localStorage

    return (
        <header>
            <div className="logo">
                <img src={logo} alt="logo" />
            </div>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/profile">Profile</Link>
                    </li>
                    <li>
                        <Link to="/courses">Courses</Link>
                    </li>
                    {isLoggedIn && role === "ADMIN" && (
                        <li>
                            <Link to="/admin">Admin</Link>
                        </li>
                    )}
                </ul>
            </nav>
            <div className="auth-box">
                {isLoggedIn ? (
                    <button onClick={onLogout} className="auth-link">
                        Logout
                    </button>
                ) : (
                    <>
                        <Link to="/login" className="auth-link">
                            Login
                        </Link>
                        <Link to="/signup" className="auth-link">
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
