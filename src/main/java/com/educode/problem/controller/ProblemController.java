package com.educode.problem.controller;

import com.educode.common.response.ApiResponse;
import com.educode.problem.dto.ProblemDtos;
import com.educode.problem.service.ProblemService;
import com.educode.security.UserPrincipal;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Problems")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/problems")
public class ProblemController {

    private final ProblemService problemService;

    @PostMapping
    public ApiResponse<ProblemDtos.ProblemResponse> create(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ProblemDtos.CreateProblemRequest request
    ) {
        return ApiResponse.ok("문제가 생성되었습니다.",
                problemService.create(principal.getId(), principal.getRole(), request));
    }

    @GetMapping("/my")
    public ApiResponse<List<ProblemDtos.ProblemResponse>> getMyProblems(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.ok(problemService.getMyProblems(principal.getId(), principal.getRole()));
    }

    @GetMapping("/{problemId}")
    public ApiResponse<ProblemDtos.ProblemResponse> getProblem(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long problemId
    ) {
        return ApiResponse.ok(problemService.getProblem(principal.getId(), principal.getRole(), problemId));
    }

    @PatchMapping("/{problemId}")
    public ApiResponse<ProblemDtos.ProblemResponse> update(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long problemId,
            @Valid @RequestBody ProblemDtos.UpdateProblemRequest request
    ) {
        return ApiResponse.ok("문제가 수정되었습니다.",
                problemService.update(principal.getId(), principal.getRole(), problemId, request));
    }

    @DeleteMapping("/{problemId}")
    public ApiResponse<Void> delete(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long problemId
    ) {
        problemService.delete(principal.getId(), principal.getRole(), problemId);
        return ApiResponse.ok("문제가 삭제되었습니다.", null);
    }
}
