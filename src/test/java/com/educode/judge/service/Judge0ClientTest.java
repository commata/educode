package com.educode.judge.service;

import com.educode.config.Judge0Properties;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

class Judge0ClientTest {

    @Test
    void execute_posts_json_payload_with_required_headers() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        RestClient restClient = builder.build();

        Judge0Properties properties = new Judge0Properties();
        properties.setBaseUrl("http://judge0.test");
        properties.setPollIntervalMillis(1);
        properties.setMaxPollCount(1);

        Judge0LanguageMapper languageMapper = mock(Judge0LanguageMapper.class);
        when(languageMapper.toLanguageId("python")).thenReturn(71);

        server.expect(requestTo("http://judge0.test/submissions?base64_encoded=false&wait=false"))
                .andExpect(method(HttpMethod.POST))
                .andExpect(header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE))
                .andExpect(header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE))
                .andExpect(content().json("""
                        {
                          "source_code": "print('hello')",
                          "language_id": 71,
                          "stdin": "",
                          "cpu_time_limit": 2.0,
                          "memory_limit": 262144
                        }
                        """))
                .andRespond(withSuccess("{\"token\":\"token-123\"}", MediaType.APPLICATION_JSON));

        server.expect(requestTo("http://judge0.test/submissions/token-123?base64_encoded=false"))
                .andExpect(method(HttpMethod.GET))
                .andExpect(header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE))
                .andRespond(withSuccess("""
                        {
                          "stdout": "hello\\n",
                          "stderr": null,
                          "compile_output": null,
                          "message": null,
                          "status": { "id": 3, "description": "Accepted" },
                          "time": "0.01"
                        }
                        """, MediaType.APPLICATION_JSON));

        Judge0Client client = new Judge0Client(restClient, properties, languageMapper);

        var result = client.execute("python", "print('hello')", "", 2000, 256);

        assertThat(result.stdout()).isEqualTo("hello\n");
        assertThat(result.status().description()).isEqualTo("Accepted");
        server.verify();
    }
}
