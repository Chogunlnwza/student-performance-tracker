package com.panuwit.tracker.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Assignment info
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String dueDate;

    private Double maxScore = 100.0;

    // Student info
    private String studentName;

    private Integer studentYear;

    // Submission status: NOT_SUBMITTED, SUBMITTED, LATE
    private String status = "NOT_SUBMITTED";

    // Grading
    private Double score;

    // Notes
    @Column(columnDefinition = "TEXT")
    private String teacherNote;

    @Column(columnDefinition = "TEXT")
    private String studentNote;
}
