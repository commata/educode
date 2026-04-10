package com.educode.assignment.service;

import com.educode.assignment.domain.Assignment;
import com.educode.assignment.dto.AssignmentDtos;
import com.educode.assignment.repository.AssignmentRepository;
import com.educode.classroom.domain.Classroom;
import com.educode.classroom.domain.ClassroomMember;
import com.educode.classroom.repository.ClassroomMemberRepository;
import com.educode.classroom.service.ClassroomService;
import com.educode.common.exception.ApiException;
import com.educode.common.exception.ErrorCode;
import com.educode.problem.domain.Problem;
import com.educode.problem.service.ProblemService;
import com.educode.submission.domain.Submission;
import com.educode.submission.repository.SubmissionRepository;
import com.educode.user.domain.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final ClassroomService classroomService;
    private final ProblemService problemService;
    private final ClassroomMemberRepository classroomMemberRepository;
    private final SubmissionRepository submissionRepository;

    @Transactional
    public AssignmentDtos.AssignmentResponse create(Long educatorId, UserRole role, Long classroomId, AssignmentDtos.CreateAssignmentRequest request) {
        requireEducator(role);
        Classroom classroom = classroomService.getOwnedClassroom(classroomId, educatorId);
        Problem problem = problemService.getOwnedProblem(request.problemId(), educatorId);
        Assignment assignment = assignmentRepository.save(Assignment.builder()
                .classroom(classroom)
                .problem(problem)
                .deadline(request.deadline())
                .build());
        return toResponse(assignment);
    }

    public List<AssignmentDtos.AssignmentResponse> getClassroomAssignments(Long userId, UserRole role, Long classroomId) {
        if (role == UserRole.EDUCATOR) {
            classroomService.getOwnedClassroom(classroomId, userId);
        } else {
            classroomService.validateStudentMembership(classroomId, userId);
        }
        return assignmentRepository.findByClassroom_IdOrderByCreatedAtDesc(classroomId).stream()
                .map(this::toResponse)
                .toList();
    }

    public AssignmentDtos.AssignmentDetailResponse getDetail(Long userId, UserRole role, Long assignmentId) {
        Assignment assignment = getAccessibleAssignment(assignmentId, userId, role);
        List<AssignmentDtos.VisibleTestCaseResponse> visible = assignment.getProblem().getTestCases().stream()
                .filter(tc -> !tc.isHidden())
                .map(tc -> new AssignmentDtos.VisibleTestCaseResponse(tc.getInputData(), tc.getExpectedOutput()))
                .toList();

        return new AssignmentDtos.AssignmentDetailResponse(
                assignment.getId(),
                assignment.getClassroom().getId(),
                assignment.getClassroom().getName(),
                assignment.getProblem().getId(),
                assignment.getProblem().getTitle(),
                assignment.getProblem().getContent(),
                assignment.getProblem().getTimeLimit(),
                assignment.getProblem().getMemoryLimit(),
                assignment.getDeadline(),
                visible
        );
    }

    public List<AssignmentDtos.MyAssignmentResponse> getMyAssignments(Long studentId, UserRole role) {
        if (role != UserRole.STUDENT) {
            throw new ApiException(ErrorCode.INVALID_ROLE);
        }
        List<ClassroomMember> memberships = classroomMemberRepository.findByStudent_IdOrderByJoinedAtDesc(studentId);
        List<Long> classroomIds = memberships.stream().map(m -> m.getClassroom().getId()).distinct().toList();
        if (classroomIds.isEmpty()) {
            return List.of();
        }

        List<Assignment> assignments = assignmentRepository.findByClassroom_IdInOrderByDeadlineAsc(classroomIds);
        List<Long> assignmentIds = assignments.stream().map(Assignment::getId).toList();
        Map<Long, Submission> latestMap = buildLatestSubmissionMap(
                submissionRepository.findByAssignmentIdsAndStudentId(assignmentIds, studentId)
        );

        return assignments.stream()
                .map(assignment -> {
                    Submission latest = latestMap.get(assignment.getId());
                    return new AssignmentDtos.MyAssignmentResponse(
                            assignment.getId(),
                            assignment.getClassroom().getId(),
                            assignment.getClassroom().getName(),
                            assignment.getProblem().getId(),
                            assignment.getProblem().getTitle(),
                            assignment.getDeadline(),
                            latest != null,
                            latest != null ? latest.getStatus() : null,
                            latest != null ? latest.getCreatedAt() : null
                    );
                })
                .toList();
    }

    public List<AssignmentDtos.StudentSubmissionStatusResponse> getSubmissionStatuses(Long educatorId, UserRole role, Long assignmentId) {
        requireEducator(role);
        Assignment assignment = assignmentRepository.findDetailedById(assignmentId)
                .orElseThrow(() -> new ApiException(ErrorCode.ASSIGNMENT_NOT_FOUND));
        if (!assignment.getClassroom().getEducator().getId().equals(educatorId)) {
            throw new ApiException(ErrorCode.FORBIDDEN);
        }
        List<ClassroomMember> members = classroomMemberRepository.findByClassroom_IdOrderByJoinedAtAsc(assignment.getClassroom().getId());
        List<Long> studentIds = members.stream().map(m -> m.getStudent().getId()).toList();
        Map<Long, Submission> latestMap = buildLatestByStudentMap(
                submissionRepository.findByAssignmentIdAndStudentIds(assignmentId, studentIds)
        );

        return members.stream()
                .map(member -> {
                    Submission latest = latestMap.get(member.getStudent().getId());
                    return new AssignmentDtos.StudentSubmissionStatusResponse(
                            member.getStudent().getId(),
                            member.getStudent().getName(),
                            latest != null,
                            latest != null ? latest.getStatus() : null,
                            latest != null ? latest.getCreatedAt() : null
                    );
                })
                .toList();
    }

    public Assignment getAccessibleAssignment(Long assignmentId, Long userId, UserRole role) {
        Assignment assignment = assignmentRepository.findDetailedById(assignmentId)
                .orElseThrow(() -> new ApiException(ErrorCode.ASSIGNMENT_NOT_FOUND));
        if (role == UserRole.EDUCATOR) {
            if (!assignment.getClassroom().getEducator().getId().equals(userId)) {
                throw new ApiException(ErrorCode.FORBIDDEN);
            }
        } else {
            classroomService.validateStudentMembership(assignment.getClassroom().getId(), userId);
        }
        return assignment;
    }

    private Map<Long, Submission> buildLatestSubmissionMap(List<Submission> submissions) {
        Map<Long, Submission> map = new LinkedHashMap<>();
        for (Submission submission : submissions) {
            map.putIfAbsent(submission.getAssignment().getId(), submission);
        }
        return map;
    }

    private Map<Long, Submission> buildLatestByStudentMap(List<Submission> submissions) {
        Map<Long, Submission> map = new LinkedHashMap<>();
        for (Submission submission : submissions) {
            map.putIfAbsent(submission.getStudent().getId(), submission);
        }
        return map;
    }

    private AssignmentDtos.AssignmentResponse toResponse(Assignment assignment) {
        return new AssignmentDtos.AssignmentResponse(
                assignment.getId(),
                assignment.getClassroom().getId(),
                assignment.getProblem().getId(),
                assignment.getProblem().getTitle(),
                assignment.getDeadline(),
                assignment.getCreatedAt()
        );
    }

    private void requireEducator(UserRole role) {
        if (role != UserRole.EDUCATOR) {
            throw new ApiException(ErrorCode.INVALID_ROLE);
        }
    }
}
