package com.educode.submission.domain;

import com.educode.assignment.domain.Assignment;
import com.educode.common.domain.BaseTimeEntity;
import com.educode.user.domain.User;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Entity
@Table(name = "submissions",
        indexes = {
                @Index(name = "idx_submissions_student_id", columnList = "student_id"),
                @Index(name = "idx_submissions_assignment_id", columnList = "assignment_id"),
                @Index(name = "idx_submissions_assignment_student_created_at", columnList = "assignment_id,student_id,created_at")
        })
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class Submission extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id")
    private User student;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "assignment_id")
    private Assignment assignment;

    @Column(nullable = false, columnDefinition = "longtext")
    private String code;

    @Column(nullable = false, length = 50)
    private String language;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SubmissionStatus status;

    @Column(name = "passed_cases", nullable = false)
    private int passedCases;

    @Column(name = "total_cases", nullable = false)
    private int totalCases;

    @Column(name = "error_message", columnDefinition = "longtext")
    private String errorMessage;

    public void complete(SubmissionStatus status, int passedCases, int totalCases, String errorMessage) {
        this.status = status;
        this.passedCases = passedCases;
        this.totalCases = totalCases;
        this.errorMessage = errorMessage;
    }
}
