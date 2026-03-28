package com.example.demo.model;

public class CourseTrackingRequest {
    private Long courseId;
    private Double progress;
    private String notes;

    // Default constructor (required for deserialization)
    public CourseTrackingRequest() {
    }

    // Constructor with parameters
    public CourseTrackingRequest(Long courseId, Double progress, String notes) {
        this.courseId = courseId;
        this.progress = progress;
        this.notes = notes;
    }

    // Getter for courseId
    public Long getCourseId() {
        return courseId;
    }

    // Setter for courseId
    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    // Getter for progress
    public Double getProgress() {
        return progress;
    }

    // Setter for progress
    public void setProgress(Double progress) {
        this.progress = progress;
    }

    // Getter for notes
    public String getNotes() {
        return notes;
    }

    // Setter for notes
    public void setNotes(String notes) {
        this.notes = notes;
    }

    // Optional: Override toString for debugging purposes
    @Override
    public String toString() {
        return "CourseTrackingRequest{" +
                "courseId=" + courseId +
                ", progress=" + progress +
                ", notes='" + notes + '\'' +
                '}';
    }
}
