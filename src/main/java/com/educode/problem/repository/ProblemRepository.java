package com.educode.problem.repository;

import com.educode.problem.domain.Problem;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProblemRepository extends JpaRepository<Problem, Long> {
    @EntityGraph(attributePaths = {"testCases", "educator"})
    Optional<Problem> findWithTestCasesById(Long problemId);

    @EntityGraph(attributePaths = {"educator"})
    List<Problem> findByEducator_IdOrderByCreatedAtDesc(Long educatorId);
}
