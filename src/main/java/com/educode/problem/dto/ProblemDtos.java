package com.educode.problem.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

public class ProblemDtos {
    public record TestCaseRequest(
            @NotBlank String inputData,
            @NotBlank String expectedOutput,
            boolean isHidden
    ) {}

    public record CreateProblemRequest(
            @NotBlank String title,
            @NotBlank String content,
            @NotNull @Min(1) Integer timeLimit,
            @NotNull @Min(1) Integer memoryLimit,
            @Valid @NotEmpty List<TestCaseRequest> testCases
    ) {}

    public record UpdateProblemRequest(
            @NotBlank String title,
            @NotBlank String content,
            @NotNull @Min(1) Integer timeLimit,
            @NotNull @Min(1) Integer memoryLimit,
            @Valid @NotEmpty List<TestCaseRequest> testCases
    ) {}

    public record TestCaseResponse(
            Long id,
            String inputData,
            String expectedOutput,
            boolean isHidden
    ) {}

    public record ProblemResponse(
            Long id,
            String title,
            String content,
            Integer timeLimit,
            Integer memoryLimit,
            Long educatorId,
            LocalDateTime createdAt,
            List<TestCaseResponse> testCases
    ) {}
}
