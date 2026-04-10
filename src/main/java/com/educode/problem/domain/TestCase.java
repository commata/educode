package com.educode.problem.domain;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Entity
@Table(name = "test_cases",
        indexes = {
                @Index(name = "idx_test_cases_problem_id", columnList = "problem_id"),
                @Index(name = "idx_test_cases_problem_hidden", columnList = "problem_id,is_hidden")
        })
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class TestCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "problem_id")
    private Problem problem;

    @Column(name = "input_data", nullable = false, columnDefinition = "text")
    private String inputData;

    @Column(name = "expected_output", nullable = false, columnDefinition = "text")
    private String expectedOutput;

    @Column(name = "is_hidden", nullable = false)
    private boolean hidden;
}
