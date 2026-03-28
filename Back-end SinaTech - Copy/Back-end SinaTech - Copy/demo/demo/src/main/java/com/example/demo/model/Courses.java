package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "courses")
public class Courses {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "instructor")
    private String instructor;

    @Column(name = "duration")
    private Integer duration;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // New field for the video ID
    @Column(name = "video_id")
    private String videoId;
    // Assuming you have an Enrollment entity that links Courses and Users
    @OneToMany(mappedBy = "course")
    private List<Enrollments> enrollments;
    @Column(name = "pdf_filename")
    private String pdfFilename;
    // Constructors
    public Courses() {}

    public Courses(String name, String description, String instructor, Integer duration, LocalDateTime createdAt, String videoId) {
        this.name = name;
        this.description = description;
        this.instructor = instructor;
        this.duration = duration;
        this.createdAt = createdAt;
        this.videoId = videoId;
        this.pdfFilename = pdfFilename;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getInstructor() {
        return instructor;
    }

    public void setInstructor(String instructor) {
        this.instructor = instructor;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getVideoId() {
        return videoId;
    }

    public void setVideoId(String videoId) {
        this.videoId = videoId;
    }

    public String getPdfFilename() {
        return pdfFilename;
    }
    public void setPdfFilename(String pdfFilename) {
        this.pdfFilename = pdfFilename;
    }

}
