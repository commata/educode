package com.educode.judge.service;

import com.educode.common.exception.ApiException;
import com.educode.common.exception.ErrorCode;
import com.educode.config.Judge0Properties;
import org.springframework.stereotype.Component;

@Component
public class Judge0LanguageMapper {
    private final Judge0Properties properties;

    public Judge0LanguageMapper(Judge0Properties properties) {
        this.properties = properties;
    }

    public Integer toLanguageId(String language) {
        Integer value = properties.getLanguageMap().get(language.toLowerCase());
        if (value == null) {
            throw new ApiException(ErrorCode.UNSUPPORTED_LANGUAGE);
        }
        return value;
    }
}
