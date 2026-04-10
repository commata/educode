package com.educode.submission.controller;

import com.educode.common.response.ApiResponse;
import com.educode.security.UserPrincipal;
import com.educode.submission.dto.SubmissionDtos;
import com.educode.submission.service.SubmissionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Submissions")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/submissions")
public class SubmissionController {

    private final SubmissionService submissionService;

    @PostMapping("/run")
    public ApiResponse<SubmissionDtos.RunResponse> run(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody SubmissionDtos.RunRequest request
    ) {
        return ApiResponse.ok(submissionService.run(principal.getId(), principal.getRole(), request));
    }

    @PostMapping("/submit")
    public ApiResponse<SubmissionDtos.SubmitResponse> submit(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody SubmissionDtos.SubmitRequest request
    ) {
        return ApiResponse.ok("제출이 완료되었습니다.",
                submissionService.submit(principal.getId(), principal.getRole(), request));
    }

    @GetMapping("/my")
    public ApiResponse<List<SubmissionDtos.SubmissionSummaryResponse>> getMySubmissions(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.ok(submissionService.getMySubmissions(principal.getId(), principal.getRole()));
    }

    @GetMapping("/{submissionId}")
    public ApiResponse<SubmissionDtos.SubmissionDetailResponse> getSubmission(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long submissionId
    ) {
        return ApiResponse.ok(submissionService.getSubmission(principal.getId(), principal.getRole(), submissionId));
    }
}
