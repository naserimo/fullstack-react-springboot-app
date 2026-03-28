import React, { useState, useEffect } from "react";
import "../styles/home.css";
import AboutSection from "./AboutSection";
import Footer from "./Footer";
import HeroSection from "./HeroSection";
import Header from "./Header";

const Home: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        setIsLoggedIn(!!userId);
    }, []);

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:8080/api/users/logout", {
                method: "POST",
                credentials: "include", // Ensure the session cookie is sent
            });
            localStorage.removeItem("userId"); // Clear userId in local storage
            setIsLoggedIn(false); // Update the logged-in state
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div>
            <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} /> {/* Header specific to Home */}
            <HeroSection />
            <AboutSection />
            <Footer />
        </div>
    );
};

export default Home;
