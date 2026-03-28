package com.example.demo.controller;

import com.example.demo.service.CustomUserDetails;
import com.example.demo.service.EnrollmentsService;


import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.example.demo.model.User;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")  // Ensure credentials are allowed
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private EnrollmentsService enrollmentService;

    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signUp(@RequestBody User user) {
        try {
            if (user.getEmail() == null || user.getPassword() == null ||
                    user.getFirstName() == null || user.getLastName() == null || user.getAge() == null) {
                return ResponseEntity.badRequest()
                        .body(Collections.singletonMap("message", "All fields are required"));
            }

            userService.signUp(
                    user.getEmail(),
                    user.getPassword(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getAge()
            );

            return ResponseEntity.status(201).body(
                    Collections.singletonMap("message", "User registered successfully")
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(
                    Collections.singletonMap("message", "Error: " + e.getMessage())
            );
        }
    }



    // Check if User is Enrolled in Any Course
    @GetMapping("/isEnrolled")
    public ResponseEntity<Map<String, Boolean>> isUserEnrolled(@RequestParam Long userId) {
        boolean isEnrolled = enrollmentService.isUserEnrolledInAnyCourse(userId);
        return ResponseEntity.ok(Collections.singletonMap("isEnrolled", isEnrolled));
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsersWithEnrollments() {

        
        List<User> users = userService.getAllUsers();
        List<Map<String, Object>> userWithEnrollments = users.stream().map(user -> {
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("firstName", user.getFirstName());
            userMap.put("lastName", user.getLastName());
            userMap.put("email", user.getEmail());
            userMap.put("role", user.getRole());
            userMap.put("enrolledCourses", user.getEnrollments().stream()
                    .map(enrollment -> enrollment.getCourse().getName()) // Assuming you have a `getCourse().getName()` method
                    .toList());
            return userMap;
        }).toList();

        return ResponseEntity.ok(userWithEnrollments);
    }


    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> logIn(@RequestBody User user, HttpServletRequest request) {
        HttpSession session = request.getSession(false); // Get existing session if any
        if (session != null) {
            session.invalidate(); // Invalidate the old session
        }

        session = request.getSession(true); // Create a new session
        log.info("New Session ID: " + session.getId());

        Optional<User> authenticatedUserOpt = userService.logIn(user.getEmail(), user.getPassword());

        if (authenticatedUserOpt.isPresent()) {
            User authenticatedUser = authenticatedUserOpt.get();
            session.setAttribute("user", authenticatedUser);

            // Populate the SecurityContext
            CustomUserDetails userDetails = new CustomUserDetails(authenticatedUser);
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("userId", authenticatedUser.getId());
            response.put("user", authenticatedUser);
            response.put("role", authenticatedUser.getRole()); // Include role in the response

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
        }
    }


    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession(false); // Retrieve session if it exists
        if (session != null) {
            session.invalidate(); // Invalidate the session on the server
            log.info("Session invalidated successfully.");
        }

        // Delete the JSESSIONID cookie
        Cookie cookie = new Cookie("JSESSIONID", null);
        cookie.setPath("/"); // Match the same path used for the session cookie
        cookie.setMaxAge(0); // Expire the cookie immediately
        response.addCookie(cookie);

        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }



    @GetMapping("/current")
    public ResponseEntity<Map<String, Object>> getCurrentUser(HttpSession session) {
        User currentUser = (User) session.getAttribute("user");
        if (currentUser != null) {
            return ResponseEntity.ok(Map.of("user", currentUser));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "No user logged in"));
        }
    }







}
