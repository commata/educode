package com.educode.problem.service;

import com.educode.common.exception.ApiException;
import com.educode.common.exception.ErrorCode;
import com.educode.problem.domain.Problem;
import com.educode.problem.domain.TestCase;
import com.educode.problem.dto.ProblemDtos;
import com.educode.problem.repository.ProblemRepository;
import com.educode.user.domain.User;
import com.educode.user.domain.UserRole;
import com.educode.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProblemService {

    private final ProblemRepository problemRepository;
    private final UserService userService;

    @Transactional
    public ProblemDtos.ProblemResponse create(Long educatorId, UserRole role, ProblemDtos.CreateProblemRequest request) {
        requireEducator(role);
        if (request.testCases().isEmpty()) {
            throw new ApiException(ErrorCode.TEST_CASE_REQUIRED);
        }
        User educator = userService.getUser(educatorId);
        Problem problem = Problem.builder()
                .educator(educator)
                .title(request.title())
                .content(request.content())
                .timeLimit(request.timeLimit())
                .memoryLimit(request.memoryLimit())
                .build();

        List<TestCase> cases = request.testCases().stream()
                .map(tc -> TestCase.builder()
                        .problem(problem)
                        .inputData(tc.inputData())
                        .expectedOutput(tc.expectedOutput())
                        .hidden(tc.isHidden())
                        .build())
                .toList();
        problem.getTestCases().addAll(cases);
        Problem saved = problemRepository.save(problem);
        return toResponse(saved, true);
    }

    public List<ProblemDtos.ProblemResponse> getMyProblems(Long educatorId, UserRole role) {
        requireEducator(role);
        return problemRepository.findByEducator_IdOrderByCreatedAtDesc(educatorId).stream()
                .map(problem -> toResponse(problem, false))
                .toList();
    }

    public ProblemDtos.ProblemResponse getProblem(Long educatorId, UserRole role, Long problemId) {
        requireEducator(role);
        Problem problem = getOwnedProblem(problemId, educatorId);
        return toResponse(problem, true);
    }

    @Transactional
    public ProblemDtos.ProblemResponse update(Long educatorId, UserRole role, Long problemId, ProblemDtos.UpdateProblemRequest request) {
        requireEducator(role);
        Problem problem = getOwnedProblem(problemId, educatorId);
        problem.update(request.title(), request.content(), request.timeLimit(), request.memoryLimit());
        List<TestCase> newCases = request.testCases().stream()
                .map(tc -> TestCase.builder()
                        .problem(problem)
                        .inputData(tc.inputData())
                        .expectedOutput(tc.expectedOutput())
                        .hidden(tc.isHidden())
                        .build())
                .toList();
        problem.replaceTestCases(newCases);
        return toResponse(problem, true);
    }

    @Transactional
    public void delete(Long educatorId, UserRole role, Long problemId) {
        requireEducator(role);
        Problem problem = getOwnedProblem(problemId, educatorId);
        problemRepository.delete(problem);
    }

    public Problem getOwnedProblem(Long problemId, Long educatorId) {
        Problem problem = problemRepository.findWithTestCasesById(problemId)
                .orElseThrow(() -> new ApiException(ErrorCode.PROBLEM_NOT_FOUND));
        if (!problem.getEducator().getId().equals(educatorId)) {
            throw new ApiException(ErrorCode.FORBIDDEN);
        }
        return problem;
    }

    private ProblemDtos.ProblemResponse toResponse(Problem problem, boolean includeCases) {
        List<ProblemDtos.TestCaseResponse> cases = includeCases
                ? problem.getTestCases().stream()
                .map(tc -> new ProblemDtos.TestCaseResponse(tc.getId(), tc.getInputData(), tc.getExpectedOutput(), tc.isHidden()))
                .toList()
                : List.of();
        return new ProblemDtos.ProblemResponse(
                problem.getId(),
                problem.getTitle(),
                problem.getContent(),
                problem.getTimeLimit(),
                problem.getMemoryLimit(),
                problem.getEducator().getId(),
                problem.getCreatedAt(),
                cases
        );
    }

    private void requireEducator(UserRole role) {
        if (role != UserRole.EDUCATOR) {
            throw new ApiException(ErrorCode.INVALID_ROLE);
        }
    }
}
