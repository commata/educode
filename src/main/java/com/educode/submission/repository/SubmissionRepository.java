package com.educode.submission.repository;

import com.educode.submission.domain.Submission;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    @EntityGraph(attributePaths = {"assignment", "assignment.problem", "assignment.classroom", "student"})
    List<Submission> findByStudent_IdOrderByCreatedAtDesc(Long studentId);

    @EntityGraph(attributePaths = {"assignment", "assignment.problem", "assignment.classroom", "student"})
    Optional<Submission> findDetailedById(Long submissionId);

    @Query("select s from Submission s where s.assignment.id = :assignmentId and s.student.id = :studentId order by s.createdAt desc")
    List<Submission> findLatestByAssignmentAndStudent(@Param("assignmentId") Long assignmentId, @Param("studentId") Long studentId);

    @Query("select s from Submission s where s.assignment.id in :assignmentIds and s.student.id = :studentId order by s.createdAt desc")
    List<Submission> findByAssignmentIdsAndStudentId(@Param("assignmentIds") Collection<Long> assignmentIds, @Param("studentId") Long studentId);

    @Query("select s from Submission s where s.assignment.id = :assignmentId and s.student.id in :studentIds order by s.student.id asc, s.createdAt desc")
    List<Submission> findByAssignmentIdAndStudentIds(@Param("assignmentId") Long assignmentId, @Param("studentIds") Collection<Long> studentIds);
}
