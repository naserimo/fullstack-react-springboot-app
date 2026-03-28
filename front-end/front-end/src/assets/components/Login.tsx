import React, { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate for redirect
import logo from "../images/logotransparent.png";
import styles from "../styles/login.module.css";
import { AuthFormData } from "../models/User.ts"; // Import AuthFormData model



const Login: React.FC = () => {
    // State to manage form data and error message
    const [formData, setFormData] = useState<AuthFormData>({
        email: "",
        password: "",
    });
    const [errorMessage, setErrorMessage] = useState<string>("");

    const navigate = useNavigate(); // Initialize the useNavigate hook

    // Handle input change for form fields
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        console.log("Form data before submission:", formData); // Debugging

        try {
            const response = await fetch("http://localhost:8080/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // Include cookies for session-based authentication
                body: JSON.stringify({
                    email: formData.email.trim(), // Trim any unnecessary whitespace
                    password: formData.password,
                }),
            });

            if (response.ok) {
                const data = await response.json(); // Parse the response JSON
                console.log("Login Response Data:", data); // Debugging
                if (data.userId) {
                    localStorage.setItem("userId", data.userId); // Store userId
                    localStorage.setItem("isLoggedIn", "true"); // Optionally store logged-in status
                    localStorage.setItem("role", data.role); // Ensure this line exists

                    navigate("/"); // Redirect to the homepage or another page
                } else {
                    setErrorMessage("User ID not found in the response.");
                }
            } else {
                const errorData = await response.json();
                console.error("Login error:", errorData);
                setErrorMessage(errorData.message || "Login failed");
            }
        } catch (error) {
            console.error("Network error:", error);
            setErrorMessage("An error occurred during login.");
        }
    };



    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.logo}>
                    <img src={logo} alt="logo"/>
                </div>
                <nav>
                    <ul className={styles.navLinks}>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/signup">Sign Up</Link>
                        </li>
                    </ul>
                </nav>
            </header>

            <main>
                <section className={styles.authContainer}>
                    <div className={styles.authBox}>
                        <h2 className={styles.title}>Login</h2>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className={styles.input}
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className={styles.input}
                            />
                            <button type="submit" className={styles.button}>
                                Login
                            </button>
                        </form>
                        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
                    </div>
                </section>
            </main>

            <footer className={styles.footer}>
                <p>SkillUp © 2024. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Login;
