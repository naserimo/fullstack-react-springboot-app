import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/signup.module.css";

const SignUp = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        age: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const age = parseInt(formData.age, 10);
        if (age < 14 || age > 100) {
            setError("Age must be between 14 and 100.");
            return;
        }

        if (!formData.firstName || !formData.lastName) {
            setError("First and Last Name are required.");
            return;
        }

        setError("");

        // Post data to backend
        try {
            const response = await fetch("http://localhost:8080/api/users/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to sign up. Please try again.");
            }

            alert("Signup successful!");
            setFormData({
                firstName: "",
                lastName: "",
                age: "",
                email: "",
                password: "",
            });

            // Redirect to login page after successful signup
            navigate("/login");
        } catch (err) {
            // Fixing the TypeScript error with type assertion
            setError(
                err instanceof Error
                    ? err.message
                    : "An unknown error occurred. Please try again."
            );
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.authContainer}>
                <div className={styles.authBox}>
                    <h1 className={styles.title}>Sign Up</h1>
                    {error && <p className={styles.errorMessage}>{error}</p>}
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                            className={styles.input}
                            required
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                            className={styles.input}
                            required
                        />
                        <input
                            type="number"
                            name="age"
                            placeholder="Age"
                            value={formData.age}
                            onChange={handleChange}
                            className={styles.input}
                            required
                            min="14"
                            max="100"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className={styles.input}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className={styles.input}
                            required
                        />
                        <button type="submit" className={styles.button}>
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
