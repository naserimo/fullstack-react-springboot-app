package com.example.demo.service;

import com.example.demo.model.CourseProgress;
import com.example.demo.model.Courses;
import com.example.demo.model.User;
import com.example.demo.repository.CourseProgressRepository;
import com.example.demo.repository.CoursesRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;

@Service
public class CourseProgressService {

    private final CourseProgressRepository courseProgressRepository;
    private final UserRepository userRepository;
    private final CoursesRepository coursesRepository;

    @Autowired
    public CourseProgressService(CourseProgressRepository courseProgressRepository,
                                 UserRepository userRepository,
                                 CoursesRepository coursesRepository) {
        this.courseProgressRepository = courseProgressRepository;
        this.userRepository = userRepository;
        this.coursesRepository = coursesRepository;
    }

    public CourseProgress getOrCreateProgress(String userEmail, String courseName) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found for email: " + userEmail));

        Courses course = coursesRepository.findByName(courseName)
                .orElseThrow(() -> new RuntimeException("Course not found for name: " + courseName));

        return courseProgressRepository.findByUserIdAndCourseId(user.getId(), course.getId())
                .orElseGet(() -> {
                    CourseProgress newProgress = new CourseProgress();
                    newProgress.setUser(user);
                    newProgress.setCourse(course);
                    newProgress.setProgressPercentage(0.0);
                    newProgress.setUpdatedAt(LocalDateTime.now());
                    return courseProgressRepository.save(newProgress);
                });
    }

}
