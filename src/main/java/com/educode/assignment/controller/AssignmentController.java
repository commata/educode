package com.educode.assignment.controller;

import com.educode.assignment.dto.AssignmentDtos;
import com.educode.assignment.service.AssignmentService;
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

@Tag(name = "Assignments")
@RestController
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService assignmentService;
    private final SubmissionService submissionService;

    @PostMapping("/api/classrooms/{classroomId}/assignments")
    public ApiResponse<AssignmentDtos.AssignmentResponse> create(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long classroomId,
            @Valid @RequestBody AssignmentDtos.CreateAssignmentRequest request
    ) {
        return ApiResponse.ok("과제가 배포되었습니다.",
                assignmentService.create(principal.getId(), principal.getRole(), classroomId, request));
    }

    @GetMapping("/api/classrooms/{classroomId}/assignments")
    public ApiResponse<List<AssignmentDtos.AssignmentResponse>> getClassroomAssignments(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long classroomId
    ) {
        return ApiResponse.ok(assignmentService.getClassroomAssignments(principal.getId(), principal.getRole(), classroomId));
    }

    @GetMapping("/api/assignments/{assignmentId}")
    public ApiResponse<AssignmentDtos.AssignmentDetailResponse> getDetail(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long assignmentId
    ) {
        return ApiResponse.ok(assignmentService.getDetail(principal.getId(), principal.getRole(), assignmentId));
    }

    @GetMapping("/api/assignments/my")
    public ApiResponse<List<AssignmentDtos.MyAssignmentResponse>> getMyAssignments(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.ok(assignmentService.getMyAssignments(principal.getId(), principal.getRole()));
    }

    @GetMapping("/api/assignments/{assignmentId}/submissions-status")
    public ApiResponse<List<AssignmentDtos.StudentSubmissionStatusResponse>> getSubmissionStatuses(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long assignmentId
    ) {
        return ApiResponse.ok(assignmentService.getSubmissionStatuses(principal.getId(), principal.getRole(), assignmentId));
    }

    @GetMapping("/api/assignments/{assignmentId}/submissions/{submissionId}")
    public ApiResponse<SubmissionDtos.SubmissionDetailResponse> getSubmissionByAssignment(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long assignmentId,
            @PathVariable Long submissionId
    ) {
        return ApiResponse.ok(submissionService.getSubmissionForAssignment(principal.getId(), principal.getRole(), assignmentId, submissionId));
    }
}
