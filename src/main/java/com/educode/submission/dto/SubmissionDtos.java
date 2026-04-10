package com.educode.submission.dto;

import com.educode.submission.domain.SubmissionStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class SubmissionDtos {
    public record RunRequest(
            @NotBlank String language,
            @NotBlank String code,
            String customInput
    ) {}

    public record RunResponse(
            String stdout,
            String stderr,
            String compileOutput,
            String judgeStatus,
            SubmissionStatus mappedStatus
    ) {}

    public record SubmitRequest(
            @NotNull Long assignmentId,
            @NotBlank String language,
            @NotBlank String code
    ) {}

    public record SubmitResponse(
            Long submissionId,
            SubmissionStatus status,
            int passedCases,
            int totalCases,
            String errorMessage
    ) {}

    public record SubmissionSummaryResponse(
            Long submissionId,
            Long assignmentId,
            String problemTitle,
            String classroomName,
            SubmissionStatus status,
            int passedCases,
            int totalCases,
            LocalDateTime submittedAt
    ) {}

    public record SubmissionDetailResponse(
            Long submissionId,
            Long assignmentId,
            Long studentId,
            String studentName,
            String classroomName,
            String problemTitle,
            String language,
            String code,
            SubmissionStatus status,
            int passedCases,
            int totalCases,
            String errorMessage,
            LocalDateTime submittedAt
    ) {}
}
