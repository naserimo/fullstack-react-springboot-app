package com.example.demo.controller;

import com.example.demo.model.Enrollments;
import com.example.demo.model.User;
import com.example.demo.service.EnrollmentsService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:5173/", allowCredentials = "true")
public class ProfileController {

    private static final Logger log = LoggerFactory.getLogger(ProfileController.class); // Add this line
    private final EnrollmentsService enrollmentsService;

    public ProfileController(EnrollmentsService enrollmentsService) {
        this.enrollmentsService = enrollmentsService;
    }

    @GetMapping("/enrolled-courses")
    public ResponseEntity<?> getEnrolledCourses(HttpSession session) {
        // Get user from the session
        User user = (User) session.getAttribute("user");
        log.info("Session Attribute User: " + session.getAttribute("user")); // This now works

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User not logged in"));
        }

        // Fetch user's enrolled courses
        List<Enrollments> enrolledCourses = enrollmentsService.getEnrolledCoursesForUser(user.getId());
        return ResponseEntity.ok(enrolledCourses);
    }
}

