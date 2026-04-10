package com.educode.classroom.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;

public class ClassroomDtos {
    public record CreateClassroomRequest(
            @NotBlank @Size(max = 150) String name,
            String description
    ) {}

    public record JoinClassroomRequest(
            @NotBlank @Size(min = 6, max = 6) String inviteCode
    ) {}

    public record ClassroomResponse(
            Long id,
            String name,
            String description,
            String inviteCode,
            Long educatorId,
            String educatorName,
            LocalDateTime createdAt
    ) {}

    public record StudentResponse(
            Long studentId,
            String studentName,
            String studentEmail,
            LocalDateTime joinedAt
    ) {}

    public record ClassroomDetailResponse(
            Long id,
            String name,
            String description,
            String inviteCode,
            Long educatorId,
            String educatorName,
            int studentCount,
            LocalDateTime createdAt
    ) {}

    public record ClassroomListResponse(List<ClassroomResponse> classrooms) {}
}
