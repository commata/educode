package com.educode.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
@Validated
@ConfigurationProperties(prefix = "app.judge0")
public class Judge0Properties {
    private String baseUrl;
    private String xAuthToken;
    private String xAuthUser;
    private int pollIntervalMillis;
    private int maxPollCount;
    private int defaultRunTimeLimit;
    private int defaultRunMemoryLimit;
    private Map<String, Integer> languageMap = new HashMap<>();
}
