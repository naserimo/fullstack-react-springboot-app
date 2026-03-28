package com.example.demo.controller;

import com.example.demo.model.Enrollments;
import com.example.demo.model.User;
import com.example.demo.service.EnrollmentsService;
import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequestMapping("/api/enrollments")
public class EnrollmentsController {

    private static final Logger log = LoggerFactory.getLogger(EnrollmentsController.class);
    private final EnrollmentsService enrollmentsService;

    public EnrollmentsController(EnrollmentsService enrollmentsService) {
        this.enrollmentsService = enrollmentsService;
    }

    @PostMapping("/courses/{courseId}")
    public ResponseEntity<?> enrollUserInCourse(@PathVariable Long courseId, HttpSession session) {
        log.info("Session ID: " + session.getId());
        log.info("Session Attribute User: " + session.getAttribute("user"));
        User user = (User) session.getAttribute("user");

        if (user == null) {
            // No user is logged in
            log.warn("No authenticated user found in session!");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User not logged in"));
        }
        log.info("Authenticated user found: " + user.getEmail()); // Debugging
        try {
            // Proceed with enrollment
            Enrollments enrollment = enrollmentsService.enrollUserInCourse(user.getId(), courseId);
            return ResponseEntity.ok(enrollment);
        } catch (RuntimeException ex) {
            // Handle any errors during enrollment
            log.error("Enrollment failed: " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", ex.getMessage()));
        }
    }
}
