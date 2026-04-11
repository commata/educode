package com.educode.submission.service;

import com.educode.assignment.domain.Assignment;
import com.educode.assignment.service.AssignmentService;
import com.educode.common.exception.ApiException;
import com.educode.common.exception.ErrorCode;
import com.educode.common.util.OutputNormalizer;
import com.educode.config.Judge0Properties;
import com.educode.judge.dto.Judge0Dtos;
import com.educode.judge.service.Judge0Client;
import com.educode.judge.service.Judge0StatusMapper;
import com.educode.submission.domain.Submission;
import com.educode.submission.domain.SubmissionStatus;
import com.educode.submission.dto.SubmissionDtos;
import com.educode.submission.repository.SubmissionRepository;
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
public class SubmissionService {

    private final AssignmentService assignmentService;
    private final SubmissionRepository submissionRepository;
    private final UserService userService;
    private final Judge0Client judge0Client;
    private final Judge0StatusMapper judge0StatusMapper;
    private final Judge0Properties judge0Properties;

    public SubmissionDtos.RunResponse run(Long studentId, UserRole role, SubmissionDtos.RunRequest request) {
        requireStudent(role);
        try {
            Judge0Dtos.SubmissionResult result = judge0Client.execute(
                    request.language(),
                    request.code(),
                    request.customInput() == null ? "" : request.customInput(),
                    judge0Properties.getDefaultRunTimeLimit(),
                    Math.max(1, judge0Properties.getDefaultRunMemoryLimit() / 1024)
            );
            SubmissionStatus mapped = judge0StatusMapper.map(result, true);
            return new SubmissionDtos.RunResponse(
                    result.stdout(),
                    result.stderr(),
                    result.compileOutput(),
                    result.status() != null ? result.status().description() : "UNKNOWN",
                    mapped
            );
        } catch (ApiException e) {
            return new SubmissionDtos.RunResponse(
                    null,
                    e.getMessage(),
                    null,
                    "ERROR",
                    SubmissionStatus.ERROR
            );
        } catch (RuntimeException e) {
            return new SubmissionDtos.RunResponse(
                    null,
                    "Code execution failed",
                    null,
                    "ERROR",
                    SubmissionStatus.ERROR
            );
        }
    }

    @Transactional
    public SubmissionDtos.SubmitResponse submit(Long studentId, UserRole role, SubmissionDtos.SubmitRequest request) {
        requireStudent(role);
        Assignment assignment = assignmentService.getAccessibleAssignment(request.assignmentId(), studentId, role);
        if (assignment.getDeadline().isBefore(LocalDateTime.now())) {
            throw new ApiException(ErrorCode.ASSIGNMENT_CLOSED);
        }
        User student = userService.getUser(studentId);
        int totalCases = assignment.getProblem().getTestCases().size();

        Submission submission = submissionRepository.save(Submission.builder()
                .student(student)
                .assignment(assignment)
                .code(request.code())
                .language(request.language())
                .status(SubmissionStatus.ERROR)
                .passedCases(0)
                .totalCases(totalCases)
                .errorMessage(null)
                .build());

        int passed = 0;
        String errorMessage = null;
        SubmissionStatus finalStatus = SubmissionStatus.PASS;

        try {
            for (var testCase : assignment.getProblem().getTestCases()) {
                Judge0Dtos.SubmissionResult result = judge0Client.execute(
                        request.language(),
                        request.code(),
                        testCase.getInputData(),
                        assignment.getProblem().getTimeLimit(),
                        assignment.getProblem().getMemoryLimit()
                );

                String actual = OutputNormalizer.normalize(result.stdout());
                String expected = OutputNormalizer.normalize(testCase.getExpectedOutput());
                boolean matched = actual.equals(expected);
                SubmissionStatus caseStatus = judge0StatusMapper.map(result, matched);

                if (caseStatus == SubmissionStatus.PASS) {
                    passed++;
                    continue;
                }

                finalStatus = caseStatus == SubmissionStatus.FAIL ? SubmissionStatus.FAIL : caseStatus;
                errorMessage = judge0StatusMapper.extractErrorMessage(result);
                if (finalStatus != SubmissionStatus.FAIL && (errorMessage == null || errorMessage.isBlank())) {
                    errorMessage = result.status() != null ? result.status().description() : "Execution failed";
                }
                break;
            }

            if (finalStatus == SubmissionStatus.PASS && passed != totalCases) {
                finalStatus = SubmissionStatus.FAIL;
            }
        } catch (ApiException e) {
            finalStatus = SubmissionStatus.ERROR;
            errorMessage = (e.getMessage() == null || e.getMessage().isBlank()) ? "Judge execution failed" : e.getMessage();
        } catch (RuntimeException e) {
            finalStatus = SubmissionStatus.ERROR;
            errorMessage = "Submission evaluation failed";
        }

        submission.complete(finalStatus, passed, totalCases, errorMessage);
        return new SubmissionDtos.SubmitResponse(
                submission.getId(),
                submission.getStatus(),
                submission.getPassedCases(),
                submission.getTotalCases(),
                submission.getErrorMessage()
        );
    }

    public List<SubmissionDtos.SubmissionSummaryResponse> getMySubmissions(Long studentId, UserRole role) {
        requireStudent(role);
        return submissionRepository.findByStudent_IdOrderByCreatedAtDesc(studentId).stream()
                .map(s -> new SubmissionDtos.SubmissionSummaryResponse(
                        s.getId(),
                        s.getAssignment().getId(),
                        s.getAssignment().getProblem().getTitle(),
                        s.getAssignment().getClassroom().getName(),
                        s.getStatus(),
                        s.getPassedCases(),
                        s.getTotalCases(),
                        s.getCreatedAt()
                ))
                .toList();
    }

    public SubmissionDtos.SubmissionDetailResponse getSubmission(Long currentUserId, UserRole role, Long submissionId) {
        Submission submission = submissionRepository.findDetailedById(submissionId)
                .orElseThrow(() -> new ApiException(ErrorCode.SUBMISSION_NOT_FOUND));
        authorizeSubmissionAccess(submission, currentUserId, role);
        return toDetail(submission);
    }

    public SubmissionDtos.SubmissionDetailResponse getSubmissionForAssignment(Long currentUserId, UserRole role, Long assignmentId, Long submissionId) {
        Submission submission = submissionRepository.findDetailedById(submissionId)
                .orElseThrow(() -> new ApiException(ErrorCode.SUBMISSION_NOT_FOUND));
        if (!submission.getAssignment().getId().equals(assignmentId)) {
            throw new ApiException(ErrorCode.SUBMISSION_NOT_FOUND);
        }
        authorizeSubmissionAccess(submission, currentUserId, role);
        return toDetail(submission);
    }

    private void authorizeSubmissionAccess(Submission submission, Long currentUserId, UserRole role) {
        if (role == UserRole.STUDENT) {
            if (!submission.getStudent().getId().equals(currentUserId)) {
                throw new ApiException(ErrorCode.FORBIDDEN);
            }
            return;
        }
        if (!submission.getAssignment().getClassroom().getEducator().getId().equals(currentUserId)) {
            throw new ApiException(ErrorCode.FORBIDDEN);
        }
    }

    private SubmissionDtos.SubmissionDetailResponse toDetail(Submission submission) {
        return new SubmissionDtos.SubmissionDetailResponse(
                submission.getId(),
                submission.getAssignment().getId(),
                submission.getStudent().getId(),
                submission.getStudent().getName(),
                submission.getAssignment().getClassroom().getName(),
                submission.getAssignment().getProblem().getTitle(),
                submission.getLanguage(),
                submission.getCode(),
                submission.getStatus(),
                submission.getPassedCases(),
                submission.getTotalCases(),
                submission.getErrorMessage(),
                submission.getCreatedAt()
        );
    }

    private void requireStudent(UserRole role) {
        if (role != UserRole.STUDENT) {
            throw new ApiException(ErrorCode.INVALID_ROLE);
        }
    }
}
