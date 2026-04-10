package com.educode.common.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    INVALID_INPUT(HttpStatus.BAD_REQUEST, "C001", "입력값이 올바르지 않습니다."),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "A001", "인증이 필요합니다."),
    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "A002", "이메일 또는 비밀번호가 올바르지 않습니다."),
    FORBIDDEN(HttpStatus.FORBIDDEN, "A003", "권한이 없습니다."),
    EMAIL_ALREADY_EXISTS(HttpStatus.CONFLICT, "U001", "이미 사용 중인 이메일입니다."),
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "U002", "사용자를 찾을 수 없습니다."),
    CLASSROOM_NOT_FOUND(HttpStatus.NOT_FOUND, "CR001", "학습방을 찾을 수 없습니다."),
    CLASSROOM_ALREADY_JOINED(HttpStatus.CONFLICT, "CR002", "이미 참여 중인 학습방입니다."),
    PROBLEM_NOT_FOUND(HttpStatus.NOT_FOUND, "P001", "문제를 찾을 수 없습니다."),
    ASSIGNMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "AS001", "과제를 찾을 수 없습니다."),
    SUBMISSION_NOT_FOUND(HttpStatus.NOT_FOUND, "SB001", "제출을 찾을 수 없습니다."),
    TEST_CASE_REQUIRED(HttpStatus.BAD_REQUEST, "P002", "테스트케이스는 최소 1개 이상 필요합니다."),
    INVALID_ROLE(HttpStatus.FORBIDDEN, "A004", "요청한 기능을 수행할 수 없는 역할입니다."),
    JUDGE0_COMMUNICATION_FAILED(HttpStatus.BAD_GATEWAY, "J001", "Judge0 통신에 실패했습니다."),
    JUDGE0_TIMEOUT(HttpStatus.GATEWAY_TIMEOUT, "J002", "Judge0 응답 대기 시간이 초과되었습니다."),
    UNSUPPORTED_LANGUAGE(HttpStatus.BAD_REQUEST, "J003", "지원하지 않는 언어입니다."),
    ASSIGNMENT_CLOSED(HttpStatus.BAD_REQUEST, "AS002", "마감된 과제입니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;

    ErrorCode(HttpStatus status, String code, String message) {
        this.status = status;
        this.code = code;
        this.message = message;
    }
}
