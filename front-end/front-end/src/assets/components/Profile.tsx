import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/profile.css";

interface EnrolledCourse {
    id: number; // This is the enrollment ID
    course: {
        id: number;        // Added the course ID field
        name: string;
        description: string;
    };
    createdAt: string;
}

const Profile: React.FC = () => {
    const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    // Fetch enrolled courses
    useEffect(() => {
        fetch("http://localhost:8080/api/profile/enrolled-courses", {
            method: "GET",
            credentials: "include", // Send session cookies
        })
            .then((response) => {
                if (response.ok) return response.json();
                throw new Error("Failed to fetch courses");
            })
            .then((data) => setEnrolledCourses(data))
            .catch((error) => {
                console.error(error);
                setError("You have not logged in to see the courses enrolled !");
            });
    }, []);

    // Navigate to course tracking page using the course's actual ID
    const handleCourseClick = (courseId: number) => {
        navigate(`/course-tracking/${courseId}`);
    };

    return (
        <div className="profile-container">
            <h1 className="profile-header">Your Enrolled Courses</h1>
            {error && <p className="error-message">{error}</p>}
            <ul className="course-list">
                {enrolledCourses.map((enrollment) => (
                    <li
                        key={enrollment.id}
                        className="course-item"
                        onClick={() => handleCourseClick(enrollment.course.id)}
                        tabIndex={0}
                    >
                        <div className="course-item-content">
                            <h3 className="course-title">
                                {enrollment.course.name}
                            </h3>
                            <p className="course-description">
                                {enrollment.course.description}
                            </p>
                            <p className="course-date">
                                Enrolled On:{" "}
                                {new Date(enrollment.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
            <footer className="footer">
                SkillUp © 2024. All rights reserved.
            </footer>
        </div>
    );
};

export default Profile;
