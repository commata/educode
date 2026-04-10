package com.educode.common.util;

public final class OutputNormalizer {
    private OutputNormalizer() {}

    public static String normalize(String value) {
        if (value == null) {
            return "";
        }
        return value.replace("\r\n", "\n").replace("\r", "\n");
    }
}
