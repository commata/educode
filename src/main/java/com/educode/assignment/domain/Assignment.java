package com.educode.assignment.domain;

import com.educode.classroom.domain.Classroom;
import com.educode.common.domain.BaseTimeEntity;
import com.educode.problem.domain.Problem;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Entity
@Table(name = "assignments",
        indexes = {
                @Index(name = "idx_assignments_classroom_id", columnList = "classroom_id"),
                @Index(name = "idx_assignments_problem_id", columnList = "problem_id"),
                @Index(name = "idx_assignments_deadline", columnList = "deadline")
        })
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class Assignment extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "classroom_id")
    private Classroom classroom;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "problem_id")
    private Problem problem;

    @Column(nullable = false)
    private LocalDateTime deadline;
}
