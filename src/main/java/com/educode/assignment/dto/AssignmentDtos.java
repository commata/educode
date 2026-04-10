package com.educode.assignment.dto;

import com.educode.submission.domain.SubmissionStatus;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

public class AssignmentDtos {
    public record CreateAssignmentRequest(
            @NotNull Long problemId,
            @NotNull @Future LocalDateTime deadline
    ) {}

    public record AssignmentResponse(
            Long id,
            Long classroomId,
            Long problemId,
            String problemTitle,
            LocalDateTime deadline,
            LocalDateTime createdAt
    ) {}

    public record AssignmentDetailResponse(
            Long assignmentId,
            Long classroomId,
            String classroomName,
            Long problemId,
            String problemTitle,
            String problemContent,
            Integer timeLimit,
            Integer memoryLimit,
            LocalDateTime deadline,
            List<VisibleTestCaseResponse> visibleTestCases
    ) {}

    public record VisibleTestCaseResponse(
            String inputData,
            String expectedOutput
    ) {}

    public record MyAssignmentResponse(
            Long assignmentId,
            Long classroomId,
            String classroomName,
            Long problemId,
            String problemTitle,
            LocalDateTime deadline,
            boolean submitted,
            SubmissionStatus lastSubmissionStatus,
            LocalDateTime lastSubmittedAt
    ) {}

    public record StudentSubmissionStatusResponse(
            Long studentId,
            String studentName,
            boolean submitted,
            SubmissionStatus status,
            LocalDateTime lastSubmittedAt
    ) {}
}
