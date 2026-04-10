package com.educode.classroom.service;

import com.educode.classroom.domain.Classroom;
import com.educode.classroom.domain.ClassroomMember;
import com.educode.classroom.dto.ClassroomDtos;
import com.educode.classroom.repository.ClassroomMemberRepository;
import com.educode.classroom.repository.ClassroomRepository;
import com.educode.common.exception.ApiException;
import com.educode.common.exception.ErrorCode;
import com.educode.common.util.InviteCodeGenerator;
import com.educode.user.domain.User;
import com.educode.user.domain.UserRole;
import com.educode.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ClassroomService {

    private final ClassroomRepository classroomRepository;
    private final ClassroomMemberRepository classroomMemberRepository;
    private final UserService userService;
    private final InviteCodeGenerator inviteCodeGenerator;

    @Transactional
    public ClassroomDtos.ClassroomResponse create(Long educatorId, UserRole role, ClassroomDtos.CreateClassroomRequest request) {
        requireRole(role, UserRole.EDUCATOR);
        User educator = userService.getUser(educatorId);
        Classroom classroom = classroomRepository.save(Classroom.builder()
                .educator(educator)
                .name(request.name())
                .description(request.description())
                .inviteCode(inviteCodeGenerator.generateUniqueCode())
                .build());
        return toResponse(classroom);
    }

    public ClassroomDtos.ClassroomListResponse getMyClassrooms(Long userId, UserRole role) {
        List<ClassroomDtos.ClassroomResponse> result;
        if (role == UserRole.EDUCATOR) {
            result = classroomRepository.findByEducator_IdOrderByCreatedAtDesc(userId).stream()
                    .map(this::toResponse)
                    .toList();
        } else {
            result = classroomMemberRepository.findByStudent_IdOrderByJoinedAtDesc(userId).stream()
                    .map(ClassroomMember::getClassroom)
                    .map(this::toResponse)
                    .toList();
        }
        return new ClassroomDtos.ClassroomListResponse(result);
    }

    @Transactional
    public ClassroomDtos.ClassroomResponse join(Long studentId, UserRole role, ClassroomDtos.JoinClassroomRequest request) {
        requireRole(role, UserRole.STUDENT);
        Classroom classroom = classroomRepository.findByInviteCode(request.inviteCode())
                .orElseThrow(() -> new ApiException(ErrorCode.CLASSROOM_NOT_FOUND));

        if (classroomMemberRepository.existsByClassroom_IdAndStudent_Id(classroom.getId(), studentId)) {
            throw new ApiException(ErrorCode.CLASSROOM_ALREADY_JOINED);
        }
        User student = userService.getUser(studentId);
        classroomMemberRepository.save(ClassroomMember.builder()
                .classroom(classroom)
                .student(student)
                .joinedAt(LocalDateTime.now())
                .build());
        return toResponse(classroom);
    }

    public ClassroomDtos.ClassroomDetailResponse getDetail(Long currentUserId, UserRole role, Long classroomId) {
        Classroom classroom = classroomRepository.findWithEducatorById(classroomId)
                .orElseThrow(() -> new ApiException(ErrorCode.CLASSROOM_NOT_FOUND));
        authorizeClassroomAccess(classroom, currentUserId, role);
        int studentCount = classroomMemberRepository.findByClassroom_IdOrderByJoinedAtAsc(classroomId).size();
        return new ClassroomDtos.ClassroomDetailResponse(
                classroom.getId(),
                classroom.getName(),
                classroom.getDescription(),
                classroom.getInviteCode(),
                classroom.getEducator().getId(),
                classroom.getEducator().getName(),
                studentCount,
                classroom.getCreatedAt()
        );
    }

    public List<ClassroomDtos.StudentResponse> getStudents(Long educatorId, UserRole role, Long classroomId) {
        requireRole(role, UserRole.EDUCATOR);
        Classroom classroom = getOwnedClassroom(classroomId, educatorId);
        return classroomMemberRepository.findByClassroom_IdOrderByJoinedAtAsc(classroom.getId()).stream()
                .map(member -> new ClassroomDtos.StudentResponse(
                        member.getStudent().getId(),
                        member.getStudent().getName(),
                        member.getStudent().getEmail(),
                        member.getJoinedAt()
                ))
                .toList();
    }

    @Transactional
    public void removeStudent(Long educatorId, UserRole role, Long classroomId, Long studentId) {
        requireRole(role, UserRole.EDUCATOR);
        Classroom classroom = getOwnedClassroom(classroomId, educatorId);
        ClassroomMember member = classroomMemberRepository.findByClassroom_IdAndStudent_Id(classroom.getId(), studentId)
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));
        classroomMemberRepository.delete(member);
    }

    public Classroom getOwnedClassroom(Long classroomId, Long educatorId) {
        Classroom classroom = classroomRepository.findWithEducatorById(classroomId)
                .orElseThrow(() -> new ApiException(ErrorCode.CLASSROOM_NOT_FOUND));
        if (!classroom.getEducator().getId().equals(educatorId)) {
            throw new ApiException(ErrorCode.FORBIDDEN);
        }
        return classroom;
    }

    public void validateStudentMembership(Long classroomId, Long studentId) {
        if (!classroomMemberRepository.existsByClassroom_IdAndStudent_Id(classroomId, studentId)) {
            throw new ApiException(ErrorCode.FORBIDDEN);
        }
    }

    private void authorizeClassroomAccess(Classroom classroom, Long userId, UserRole role) {
        if (role == UserRole.EDUCATOR) {
            if (!classroom.getEducator().getId().equals(userId)) {
                throw new ApiException(ErrorCode.FORBIDDEN);
            }
            return;
        }
        validateStudentMembership(classroom.getId(), userId);
    }

    private void requireRole(UserRole actual, UserRole expected) {
        if (actual != expected) {
            throw new ApiException(ErrorCode.INVALID_ROLE);
        }
    }

    private ClassroomDtos.ClassroomResponse toResponse(Classroom classroom) {
        return new ClassroomDtos.ClassroomResponse(
                classroom.getId(),
                classroom.getName(),
                classroom.getDescription(),
                classroom.getInviteCode(),
                classroom.getEducator().getId(),
                classroom.getEducator().getName(),
                classroom.getCreatedAt()
        );
    }
}
