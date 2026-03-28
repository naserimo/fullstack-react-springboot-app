package com.example.demo.repository;

import com.example.demo.model.Enrollments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnrollmentsRepository extends JpaRepository<Enrollments, Long> {
    // Check if a user is enrolled in any course
    boolean existsByUserId(Long userId);

    boolean existsByUserIdAndCourseId(Long userId, Long courseId);
    List<Enrollments> findByUserId(Long userId);
}
