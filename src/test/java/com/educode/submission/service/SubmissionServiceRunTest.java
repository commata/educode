package com.educode.submission.service;

import com.educode.common.exception.ApiException;
import com.educode.common.exception.ErrorCode;
import com.educode.config.Judge0Properties;
import com.educode.judge.service.Judge0Client;
import com.educode.judge.service.Judge0StatusMapper;
import com.educode.submission.domain.SubmissionStatus;
import com.educode.submission.dto.SubmissionDtos;
import com.educode.submission.repository.SubmissionRepository;
import com.educode.user.domain.UserRole;
import com.educode.user.service.UserService;
import com.educode.assignment.service.AssignmentService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class SubmissionServiceRunTest {

    @Mock AssignmentService assignmentService;
    @Mock SubmissionRepository submissionRepository;
    @Mock UserService userService;
    @Mock Judge0Client judge0Client;
    @Spy Judge0StatusMapper judge0StatusMapper = new Judge0StatusMapper();
    @Mock Judge0Properties judge0Properties;

    @InjectMocks SubmissionService submissionService;

    @Test
    void run_returns_error_payload_when_judge_call_fails() {
        when(judge0Properties.getDefaultRunTimeLimit()).thenReturn(2000);
        when(judge0Properties.getDefaultRunMemoryLimit()).thenReturn(256000);
        when(judge0Client.execute(anyString(), anyString(), anyString(), anyInt(), anyInt()))
                .thenThrow(new ApiException(ErrorCode.JUDGE0_COMMUNICATION_FAILED));

        SubmissionDtos.RunResponse response = submissionService.run(
                2L,
                UserRole.STUDENT,
                new SubmissionDtos.RunRequest("python", "print('hello')", "")
        );

        assertEquals(SubmissionStatus.ERROR, response.mappedStatus());
        assertEquals("ERROR", response.judgeStatus());
        assertEquals(ErrorCode.JUDGE0_COMMUNICATION_FAILED.getMessage(), response.stderr());
    }
}
