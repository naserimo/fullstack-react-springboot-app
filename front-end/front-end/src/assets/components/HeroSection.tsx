import React from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";

const HeroSection: React.FC = () => {
    return (
        <section className="hero">
            <h1>Empower Your Learning Journey</h1>
            <p>
                Access top-notch courses designed to elevate your technology skills and
                advance your career.
            </p>
            <Link to="/courses" className="cta-button">
                Explore Courses
            </Link>
        </section>
    );
};

export default HeroSection;
