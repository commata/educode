package com.educode.problem.domain;

import com.educode.common.domain.BaseTimeEntity;
import com.educode.user.domain.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@Table(name = "problems", indexes = {
        @Index(name = "idx_problems_educator_id", columnList = "educator_id")
})
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class Problem extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "educator_id")
    private User educator;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "text")
    private String content;

    @Column(name = "time_limit", nullable = false)
    private Integer timeLimit;

    @Column(name = "memory_limit", nullable = false)
    private Integer memoryLimit;

    @OneToMany(mappedBy = "problem", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<TestCase> testCases = new ArrayList<>();

    public void update(String title, String content, Integer timeLimit, Integer memoryLimit) {
        this.title = title;
        this.content = content;
        this.timeLimit = timeLimit;
        this.memoryLimit = memoryLimit;
    }

    public void replaceTestCases(List<TestCase> newTestCases) {
        this.testCases.clear();
        this.testCases.addAll(newTestCases);
    }
}
