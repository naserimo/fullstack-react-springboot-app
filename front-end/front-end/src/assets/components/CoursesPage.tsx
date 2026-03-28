import React, { useState, useEffect } from "react";
import "../styles/courses.css"; // Add a CSS file for styling
import Header from "./Header";
import Footer from "./Footer";
import course1 from "../images/course1.jpg";
import course2 from "../images/course2.jpg";
import course3 from "../images/course3.jpg";
import course4 from "../images/course4.jpg";
import course5 from "../images/course5.jpg";

interface Course {
    id: number;
    image: string;
    title: string;
    description: string;
}

const CoursesPage: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const courses: Course[] = [
        {
            id: 1,
            image: course1,
            title: "AI for Everyone",
            description: "Learn the fundamentals of artificial intelligence and how it's transforming industries. Sign up to unlock your potential!",
        },
        {
            id: 2,
            image: course2,
            title: "Advanced Java Programming",
            description: "Master Java programming with advanced concepts and build enterprise-grade applications. Sign up to level up your skills!",
        },
        {
            id: 3,
            image: course3,
            title: "Web Development with React",
            description: "Dive into React and build dynamic, modern web applications. Join us to start your journey as a front-end developer!",
        },
        {
            id: 4,
            image: course4,
            title: "Data Structures and Algorithms",
            description: "Understand the core principles of algorithms and data structures to excel in coding interviews. Start learning today!",
        },
        {
            id: 5,
            image: course5,
            title: "Introduction to Cloud Computing",
            description: "Explore the world of cloud computing and learn how to build scalable, secure applications. Sign up to get started!",
        },
    ];

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        setIsLoggedIn(!!userId); // Check if user is logged in
    }, []);

    const handleEnroll = (courseId: number) => {
        fetch(`http://localhost:8080/api/enrollments/courses/${courseId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        })
            .then((response) => {
                if (response.ok) {
                    alert("Successfully enrolled!");
                } else {
                    alert("Enrollment failed!");
                }
            })
            .catch((error) => {
                console.error("Error enrolling:", error);
            });
    };

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
    //The isLoggedIn state is passed as a prop to the Header component: The Header component uses this prop to conditionally render UI elements (e.g., a Logout button or login-related links).
    return (
        <div>
            <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            <main className="courses-container">
                <h1>Our Courses</h1>
                <div className="courses-grid">
                    {courses.map((course) => (
                        <div key={course.id} className="course-card">
                            <img src={course.image} alt={course.title} className="course-image" />
                            <h2 className="course-title">{course.title}</h2>
                            <p className="course-description">{course.description}</p>
                            {isLoggedIn && (
                                <button
                                    className="enroll-button"
                                    onClick={() => handleEnroll(course.id)}
                                >
                                    Enroll
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CoursesPage;
