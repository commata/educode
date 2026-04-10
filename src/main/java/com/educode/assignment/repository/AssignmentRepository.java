package com.educode.assignment.repository;

import com.educode.assignment.domain.Assignment;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    @EntityGraph(attributePaths = {"classroom", "classroom.educator", "problem"})
    List<Assignment> findByClassroom_IdOrderByCreatedAtDesc(Long classroomId);

    @EntityGraph(attributePaths = {"classroom", "classroom.educator", "problem", "problem.testCases"})
    Optional<Assignment> findDetailedById(Long assignmentId);

    @EntityGraph(attributePaths = {"classroom", "classroom.educator", "problem"})
    List<Assignment> findByClassroom_IdInOrderByDeadlineAsc(Collection<Long> classroomIds);
}
