package com.educode.judge.service;

import com.educode.judge.dto.Judge0Dtos;
import com.educode.submission.domain.SubmissionStatus;
import org.springframework.stereotype.Component;

@Component
public class Judge0StatusMapper {

    public SubmissionStatus map(Judge0Dtos.SubmissionResult result, boolean outputMatched) {
        int statusId = result.status() != null && result.status().id() != null ? result.status().id() : -1;
        return switch (statusId) {
            case 3 -> outputMatched ? SubmissionStatus.PASS : SubmissionStatus.FAIL;
            case 5, 6 -> SubmissionStatus.TIME_LIMIT;
            case 11 -> SubmissionStatus.COMPILE_ERR;
            case 12 -> SubmissionStatus.RUNTIME_ERR;
            default -> SubmissionStatus.ERROR;
        };
    }

    public String extractErrorMessage(Judge0Dtos.SubmissionResult result) {
        if (result.compileOutput() != null && !result.compileOutput().isBlank()) {
            return result.compileOutput();
        }
        if (result.stderr() != null && !result.stderr().isBlank()) {
            return result.stderr();
        }
        return result.message();
    }
}
