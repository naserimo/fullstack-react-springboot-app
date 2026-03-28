package com.example.demo.controller;

import com.example.demo.model.CourseProgress;
import com.example.demo.model.Courses;
import com.example.demo.model.User;
import com.example.demo.model.CourseTrackingRequest;
import com.example.demo.repository.CourseProgressRepository;
import com.example.demo.repository.CoursesRepository;


import org.springframework.core.io.Resource;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;


import jakarta.servlet.http.HttpSession;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courseTracking")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CourseTrackingController {

    private final CourseProgressRepository courseProgressRepository;
    private final CoursesRepository coursesRepository;

    @Autowired
    public CourseTrackingController(CourseProgressRepository courseProgressRepository,
                                    CoursesRepository coursesRepository) {
        this.courseProgressRepository = courseProgressRepository;
        this.coursesRepository = coursesRepository;
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveProgressAndNotes(@RequestBody CourseTrackingRequest request, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User not logged in"));
        }

        Courses course = coursesRepository.findById(request.getCourseId()).orElse(null);
        if (course == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Invalid course ID"));
        }

        // Create a new entry instead of updating
        CourseProgress newProgress = new CourseProgress();
        newProgress.setUser(user);
        newProgress.setCourse(course);
        newProgress.setProgressPercentage(request.getProgress());
        newProgress.setNotes(request.getNotes());
        newProgress.setUpdatedAt(LocalDateTime.now());

        courseProgressRepository.save(newProgress);

        return ResponseEntity.ok(Map.of("message", "Progress and notes saved successfully"));
    }


    @GetMapping("/history")
    public ResponseEntity<?> getNotesHistory(@RequestParam("courseId") Long courseId, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User not logged in"));
        }

        Courses course = coursesRepository.findById(courseId).orElse(null);
        if (course == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Invalid course ID"));
        }

        List<CourseProgress> history = courseProgressRepository.findByUserAndCourseOrderByUpdatedAtDesc(user, course);

        return ResponseEntity.ok(history);
    }

    @GetMapping("/courseInfo")
    public ResponseEntity<?> getCourseInfo(@RequestParam("courseId") Long courseId, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User not logged in"));
        }

        Courses course = coursesRepository.findById(courseId).orElse(null);
        if (course == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Invalid course ID"));
        }

        // Assuming Courses entity has getName(), getDescription(), getVideoId() methods
        Map<String, Object> courseData = Map.of(
                "id", course.getId(),
                "name", course.getName(),
                "description", course.getDescription(),
                "videoId", course.getVideoId(),
                "pdfFilename", course.getPdfFilename()
        );

        return ResponseEntity.ok(courseData);
    }
    @GetMapping("/pdf/{courseId}")
    public ResponseEntity<?> getPdfFile(@PathVariable Long courseId) {
        Courses course = coursesRepository.findById(courseId).orElse(null);
        if (course == null || course.getPdfFilename() == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "PDF not found for this course"));
        }

        try {
            ClassPathResource pdfFile = new ClassPathResource("static/" + course.getPdfFilename());

            if (!pdfFile.exists()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "PDF file not found on server"));
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfFile);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error loading PDF"));
        }
    }



}
