// src/models/User.ts

/**
 * Represents the form data required for user authentication (login/signup).
 */
export interface AuthFormData {
    email: string;
    password: string;
}

/**
 * Represents the expected API response structure.
 */
export interface ApiResponse {
    success: boolean;
    message: string;
    data?: { [key: string]: unknown }; // Replace with a defined structure if possible
}
