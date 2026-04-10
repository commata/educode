package com.educode.classroom.controller;

import com.educode.classroom.dto.ClassroomDtos;
import com.educode.classroom.service.ClassroomService;
import com.educode.common.response.ApiResponse;
import com.educode.security.UserPrincipal;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Classrooms")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/classrooms")
public class ClassroomController {

    private final ClassroomService classroomService;

    @PostMapping
    public ApiResponse<ClassroomDtos.ClassroomResponse> create(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ClassroomDtos.CreateClassroomRequest request
    ) {
        return ApiResponse.ok("학습방이 생성되었습니다.",
                classroomService.create(principal.getId(), principal.getRole(), request));
    }

    @GetMapping("/my")
    public ApiResponse<ClassroomDtos.ClassroomListResponse> getMyClassrooms(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ApiResponse.ok(classroomService.getMyClassrooms(principal.getId(), principal.getRole()));
    }

    @PostMapping("/join")
    public ApiResponse<ClassroomDtos.ClassroomResponse> join(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ClassroomDtos.JoinClassroomRequest request
    ) {
        return ApiResponse.ok("학습방 참여가 완료되었습니다.",
                classroomService.join(principal.getId(), principal.getRole(), request));
    }

    @GetMapping("/{classroomId}")
    public ApiResponse<ClassroomDtos.ClassroomDetailResponse> getDetail(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long classroomId
    ) {
        return ApiResponse.ok(classroomService.getDetail(principal.getId(), principal.getRole(), classroomId));
    }

    @GetMapping("/{classroomId}/students")
    public ApiResponse<List<ClassroomDtos.StudentResponse>> getStudents(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long classroomId
    ) {
        return ApiResponse.ok(classroomService.getStudents(principal.getId(), principal.getRole(), classroomId));
    }

    @DeleteMapping("/{classroomId}/students/{studentId}")
    public ApiResponse<Void> removeStudent(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long classroomId,
            @PathVariable Long studentId
    ) {
        classroomService.removeStudent(principal.getId(), principal.getRole(), classroomId, studentId);
        return ApiResponse.ok("학생이 학습방에서 제거되었습니다.", null);
    }
}
