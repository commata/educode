package com.educode.submission.service;

import com.educode.assignment.domain.Assignment;
import com.educode.assignment.service.AssignmentService;
import com.educode.classroom.domain.Classroom;
import com.educode.common.exception.ApiException;
import com.educode.common.exception.ErrorCode;
import com.educode.config.Judge0Properties;
import com.educode.judge.dto.Judge0Dtos;
import com.educode.judge.service.Judge0Client;
import com.educode.judge.service.Judge0StatusMapper;
import com.educode.problem.domain.Problem;
import com.educode.problem.domain.TestCase;
import com.educode.submission.domain.Submission;
import com.educode.submission.domain.SubmissionStatus;
import com.educode.submission.dto.SubmissionDtos;
import com.educode.submission.repository.SubmissionRepository;
import com.educode.user.domain.User;
import com.educode.user.domain.UserRole;
import com.educode.user.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class SubmissionServiceTest {

    @Mock AssignmentService assignmentService;
    @Mock SubmissionRepository submissionRepository;
    @Mock UserService userService;
    @Mock Judge0Client judge0Client;
    @Spy Judge0StatusMapper judge0StatusMapper = new Judge0StatusMapper();
    @Mock Judge0Properties judge0Properties;

    @InjectMocks SubmissionService submissionService;

    @Test
    void submit_passes_all_testcases() {
        Assignment assignment = createAssignment();
        User student = createStudent();

        when(assignmentService.getAccessibleAssignment(33L, 2L, UserRole.STUDENT)).thenReturn(assignment);
        when(userService.getUser(2L)).thenReturn(student);
        when(submissionRepository.save(any(Submission.class))).thenAnswer(inv -> inv.getArgument(0));

        when(judge0Client.execute(eq("java"), anyString(), eq("1 2"), eq(1000), eq(128)))
                .thenReturn(new Judge0Dtos.SubmissionResult("3", null, null, null, new Judge0Dtos.StatusDto(3, "Accepted"), "0.01"));
        when(judge0Client.execute(eq("java"), anyString(), eq("10 20"), eq(1000), eq(128)))
                .thenReturn(new Judge0Dtos.SubmissionResult("30", null, null, null, new Judge0Dtos.StatusDto(3, "Accepted"), "0.01"));

        SubmissionDtos.SubmitResponse response = submissionService.submit(2L, UserRole.STUDENT,
                new SubmissionDtos.SubmitRequest(33L, "java", "class Main {}"));

        assertEquals(SubmissionStatus.PASS, response.status());
        assertEquals(2, response.passedCases());
        assertEquals(2, response.totalCases());
    }

    @Test
    void submit_marks_submission_error_when_judge_call_fails() {
        Assignment assignment = createAssignment();
        User student = createStudent();

        when(assignmentService.getAccessibleAssignment(33L, 2L, UserRole.STUDENT)).thenReturn(assignment);
        when(userService.getUser(2L)).thenReturn(student);
        when(submissionRepository.save(any(Submission.class))).thenAnswer(inv -> inv.getArgument(0));
        when(judge0Client.execute(eq("java"), anyString(), eq("1 2"), eq(1000), eq(128)))
                .thenThrow(new ApiException(ErrorCode.JUDGE0_TIMEOUT));

        SubmissionDtos.SubmitResponse response = submissionService.submit(2L, UserRole.STUDENT,
                new SubmissionDtos.SubmitRequest(33L, "java", "class Main {}"));

        assertEquals(SubmissionStatus.ERROR, response.status());
        assertEquals(0, response.passedCases());
        assertEquals(2, response.totalCases());
        assertEquals(ErrorCode.JUDGE0_TIMEOUT.getMessage(), response.errorMessage());
    }

    private Assignment createAssignment() {
        User educator = User.builder().id(1L).email("e@test.com").password("x").name("Educator").role(UserRole.EDUCATOR).build();
        Classroom classroom = Classroom.builder().id(11L).name("Classroom").inviteCode("ABC123").educator(educator).build();
        Problem problem = Problem.builder().id(22L).educator(educator).title("A+B").content("content").timeLimit(1000).memoryLimit(128).build();
        problem.getTestCases().addAll(List.of(
                TestCase.builder().problem(problem).inputData("1 2").expectedOutput("3").hidden(false).build(),
                TestCase.builder().problem(problem).inputData("10 20").expectedOutput("30").hidden(true).build()
        ));
        return Assignment.builder().id(33L).classroom(classroom).problem(problem).deadline(LocalDateTime.now().plusDays(1)).build();
    }

    private User createStudent() {
        return User.builder().id(2L).email("s@test.com").password("x").name("Student").role(UserRole.STUDENT).build();
    }
}
