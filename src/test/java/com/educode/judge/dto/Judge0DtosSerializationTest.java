package com.educode.judge.dto;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class Judge0DtosSerializationTest {

    private final ObjectMapper objectMapper = new ObjectMapper()
            .setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);

    @Test
    void submissionRequest_serializes_with_judge0_field_names() throws Exception {
        Judge0Dtos.SubmissionRequest request = new Judge0Dtos.SubmissionRequest(
                "print('hello')",
                71,
                "",
                2.0,
                262144
        );

        String json = objectMapper.writeValueAsString(request);

        assertThat(json).contains("\"source_code\":\"print('hello')\"");
        assertThat(json).contains("\"language_id\":71");
        assertThat(json).doesNotContain("sourceCode");
        assertThat(json).doesNotContain("languageId");
    }
}
