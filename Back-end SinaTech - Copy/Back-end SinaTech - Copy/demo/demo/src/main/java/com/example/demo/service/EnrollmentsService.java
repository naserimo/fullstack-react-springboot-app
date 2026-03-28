package com.example.demo.service;
import com.example.demo.model.Courses;
import com.example.demo.model.Enrollments;
import com.example.demo.model.User;
import com.example.demo.repository.CoursesRepository;
import com.example.demo.repository.EnrollmentsRepository;
import com.example.demo.repository.UserRepository;

import org.springframework.stereotype.Service;

import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Service
public class EnrollmentsService {

    private final EnrollmentsRepository enrollmentsRepository;
    private final CoursesRepository coursesRepository;
    private final UserRepository userRepository;

    @Autowired
    public EnrollmentsService(EnrollmentsRepository enrollmentsRepository,
                              CoursesRepository coursesRepository,
                              UserRepository userRepository) {
        this.enrollmentsRepository = enrollmentsRepository;
        this.coursesRepository = coursesRepository;
        this.userRepository = userRepository;
    }

    public List<Enrollments> getEnrolledCoursesForUser(Long userId) {
        return enrollmentsRepository.findByUserId(userId);
    }

    public boolean isUserEnrolledInAnyCourse(Long userId) {
        // Check if any enrollments exist for the given user ID
        return enrollmentsRepository.existsByUserId(userId);
    }
    public Enrollments enrollUserInCourse(Long userId, Long courseId) {
        if (enrollmentsRepository.existsByUserIdAndCourseId(userId, courseId)) {
            throw new RuntimeException("User is already enrolled in this course");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Courses course = coursesRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Enrollments enrollment = new Enrollments();
        enrollment.setUser(user);
        enrollment.setCourse(course);
        System.out.println("Enrollment before saving: " + enrollment);
        return enrollmentsRepository.save(enrollment);
    }

}
