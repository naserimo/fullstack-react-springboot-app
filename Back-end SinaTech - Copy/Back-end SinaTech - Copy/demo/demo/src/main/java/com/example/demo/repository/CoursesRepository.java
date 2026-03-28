package com.example.demo.repository;



import com.example.demo.model.Courses;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CoursesRepository extends JpaRepository<Courses, Long> {
    Optional<Courses> findByName(String name);

    @Override
    Optional<Courses> findById(Long id); // Explicitly define findByI
}
