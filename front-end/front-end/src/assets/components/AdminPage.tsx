import React, { useState, useEffect } from "react";
import styles from "../styles/AdminPage.module.css";

const AdminPage: React.FC = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/users/users", {
                    method: "GET",
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch users");
                }

                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className={styles["admin-container"]}>
            <h1 className={styles["admin-header"]}>Admin Dashboard</h1>
            <table className={styles["admin-table"]}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Enrolled Courses</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user: any) => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{`${user.firstName} ${user.lastName}`}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                            {user.enrolledCourses.length > 0
                                ? user.enrolledCourses.join(", ")
                                : "No courses enrolled"}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPage;
