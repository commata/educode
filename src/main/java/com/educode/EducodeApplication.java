package com.educode;

import com.educode.config.CorsProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(CorsProperties.class)
public class EducodeApplication {

	public static void main(String[] args) {
		SpringApplication.run(EducodeApplication.class, args);
	}
}