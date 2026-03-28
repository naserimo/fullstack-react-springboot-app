package com.example.demo.service;


import com.example.demo.model.Courses;
import com.example.demo.repository.CoursesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CoursesService {

    private final CoursesRepository coursesRepository;

    @Autowired
    public CoursesService(CoursesRepository coursesRepository) {
        this.coursesRepository = coursesRepository;
    }

    public List<Courses> getAllCourses() {
        return coursesRepository.findAll();
    }

    public Optional<Courses> getCourseById(Long id) {
        return coursesRepository.findById(id);
    }

    public void addCourse(Courses course) {
        coursesRepository.save(course);
    }

    public void updateCourse(Long id, Courses updatedCourse) {
        Optional<Courses> existingCourse = coursesRepository.findById(id);
        if (existingCourse.isPresent()) {
            Courses course = existingCourse.get();
            course.setName(updatedCourse.getName());
            course.setDescription(updatedCourse.getDescription());
            course.setInstructor(updatedCourse.getInstructor());
            course.setDuration(updatedCourse.getDuration());
            coursesRepository.save(course);
        } else {
            throw new RuntimeException("Course not found with ID: " + id);
        }
    }

    public void deleteCourse(Long id) {
        if (coursesRepository.existsById(id)) {
            coursesRepository.deleteById(id);
        } else {
            throw new RuntimeException("Course not found with ID: " + id);
        }
    }
}
