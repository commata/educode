package com.educode.judge.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Judge0Dtos {
    public record SubmissionRequest(
            @JsonProperty("source_code") String sourceCode,
            @JsonProperty("language_id") Integer languageId,
            String stdin,
            @JsonProperty("cpu_time_limit") Double cpuTimeLimitSeconds,
            @JsonProperty("memory_limit") Integer memoryLimitKb
    ) {}

    public record SubmissionTokenResponse(String token) {}

    public record StatusDto(Integer id, String description) {}

    public record SubmissionResult(
            String stdout,
            String stderr,
            @JsonProperty("compile_output") String compileOutput,
            @JsonProperty("message") String message,
            StatusDto status,
            @JsonProperty("time") String time
    ) {}
}
