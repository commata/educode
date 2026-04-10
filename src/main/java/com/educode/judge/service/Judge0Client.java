package com.educode.judge.service;

import com.educode.common.exception.ApiException;
import com.educode.common.exception.ErrorCode;
import com.educode.config.Judge0Properties;
import com.educode.judge.dto.Judge0Dtos;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Component
@RequiredArgsConstructor
public class Judge0Client {

    private final RestClient restClient;
    private final Judge0Properties properties;
    private final Judge0LanguageMapper languageMapper;

    public Judge0Dtos.SubmissionResult execute(String language, String code, String stdin, int timeLimitMillis, int memoryLimitMb) {
        Integer languageId = languageMapper.toLanguageId(language);
        Judge0Dtos.SubmissionRequest request = new Judge0Dtos.SubmissionRequest(
                code,
                languageId,
                stdin,
                timeLimitMillis / 1000.0,
                memoryLimitMb * 1024
        );

        try {
            Judge0Dtos.SubmissionTokenResponse tokenResponse = restClient.post()
                    .uri(properties.getBaseUrl() + "/submissions?base64_encoded=false&wait=false")
                    .headers(this::addHeaders)
                    .body(request)
                    .retrieve()
                    .body(Judge0Dtos.SubmissionTokenResponse.class);

            if (tokenResponse == null || tokenResponse.token() == null) {
                throw new ApiException(ErrorCode.JUDGE0_COMMUNICATION_FAILED, "Judge0 토큰 응답이 비어 있습니다.");
            }

            for (int i = 0; i < properties.getMaxPollCount(); i++) {
                sleep(properties.getPollIntervalMillis());
                Judge0Dtos.SubmissionResult result = restClient.get()
                        .uri(properties.getBaseUrl() + "/submissions/" + tokenResponse.token() + "?base64_encoded=false")
                        .headers(this::addHeaders)
                        .retrieve()
                        .body(Judge0Dtos.SubmissionResult.class);
                if (result != null && result.status() != null && result.status().id() != null && result.status().id() > 2) {
                    return result;
                }
            }
            throw new ApiException(ErrorCode.JUDGE0_TIMEOUT);
        } catch (RestClientException e) {
            throw new ApiException(ErrorCode.JUDGE0_COMMUNICATION_FAILED, e.getMessage());
        }
    }

    private void addHeaders(HttpHeaders headers) {
        if (properties.getXAuthToken() != null && !properties.getXAuthToken().isBlank()) {
            headers.add("X-Auth-Token", properties.getXAuthToken());
        }
        if (properties.getXAuthUser() != null && !properties.getXAuthUser().isBlank()) {
            headers.add("X-Auth-User", properties.getXAuthUser());
        }
    }

    private void sleep(int millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new ApiException(ErrorCode.JUDGE0_TIMEOUT);
        }
    }
}
