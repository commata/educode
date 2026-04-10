package com.educode.assignment.service;

import com.educode.assignment.domain.Assignment;
import com.educode.assignment.dto.AssignmentDtos;
import com.educode.assignment.repository.AssignmentRepository;
import com.educode.classroom.domain.Classroom;
import com.educode.classroom.repository.ClassroomMemberRepository;
import com.educode.classroom.service.ClassroomService;
import com.educode.problem.domain.Problem;
import com.educode.problem.domain.TestCase;
import com.educode.problem.service.ProblemService;
import com.educode.submission.repository.SubmissionRepository;
import com.educode.user.domain.User;
import com.educode.user.domain.UserRole;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class AssignmentServiceTest {

    @Mock AssignmentRepository assignmentRepository;
    @Mock ClassroomService classroomService;
    @Mock ProblemService problemService;
    @Mock ClassroomMemberRepository classroomMemberRepository;
    @Mock SubmissionRepository submissionRepository;

    @InjectMocks AssignmentService assignmentService;

    @Test
    void detail_returns_only_visible_testcases() {
        User educator = User.builder().id(1L).email("e@test.com").password("x").name("선생님").role(UserRole.EDUCATOR).build();
        Classroom classroom = Classroom.builder().id(10L).name("반").inviteCode("ABC123").educator(educator).build();
        Problem problem = Problem.builder().id(20L).educator(educator).title("A+B").content("본문").timeLimit(1000).memoryLimit(256).build();
        problem.getTestCases().addAll(List.of(
                TestCase.builder().problem(problem).inputData("1 2").expectedOutput("3").hidden(false).build(),
                TestCase.builder().problem(problem).inputData("9 9").expectedOutput("18").hidden(true).build()
        ));
        Assignment assignment = Assignment.builder().id(30L).classroom(classroom).problem(problem).deadline(LocalDateTime.now().plusDays(1)).build();

        when(assignmentRepository.findDetailedById(30L)).thenReturn(Optional.of(assignment));
        doNothing().when(classroomService).validateStudentMembership(10L, 2L);

        AssignmentDtos.AssignmentDetailResponse response = assignmentService.getDetail(2L, UserRole.STUDENT, 30L);

        assertEquals(1, response.visibleTestCases().size());
        assertEquals("1 2", response.visibleTestCases().get(0).inputData());
    }
}
