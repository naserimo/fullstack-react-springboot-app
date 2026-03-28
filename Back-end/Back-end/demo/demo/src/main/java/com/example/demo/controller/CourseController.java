package com.example.demo.controller;

import com.example.demo.model.Courses;
import com.example.demo.service.CoursesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CoursesService courseService;

    @GetMapping
    public List<Courses> getAllCourses() {
        return courseService.getAllCourses();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Optional<Courses> getCourseById(@PathVariable Long id) {
        return courseService.getCourseById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public void addCourse(@RequestBody Courses course) {
        courseService.addCourse(course);
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void updateCourse(@PathVariable Long id, @RequestBody Courses course) {
        courseService.updateCourse(id, course);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
    }

    @GetMapping("/testAuth")
    public ResponseEntity<?> testAuth(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Not authenticated");
        }

        String username = authentication.getName();
        String roles = authentication.getAuthorities().toString(); // Extract roles

        return ResponseEntity.ok("Authenticated user: " + username + ", Roles: " + roles);
    }

}
