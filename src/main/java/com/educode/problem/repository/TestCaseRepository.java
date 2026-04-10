package com.educode.problem.repository;

import com.educode.problem.domain.TestCase;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestCaseRepository extends JpaRepository<TestCase, Long> {
    List<TestCase> findByProblem_Id(Long problemId);
    List<TestCase> findByProblem_IdAndHiddenFalse(Long problemId);
}
