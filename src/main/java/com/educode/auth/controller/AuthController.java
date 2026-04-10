package com.educode.auth.controller;

import com.educode.auth.dto.AuthDtos;
import com.educode.auth.service.AuthService;
import com.educode.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Auth")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ApiResponse<AuthDtos.AuthResponse> signup(@Valid @RequestBody AuthDtos.SignupRequest request) {
        return ApiResponse.ok("회원가입에 성공했습니다.", authService.signup(request));
    }

    @PostMapping("/login")
    public ApiResponse<AuthDtos.AuthResponse> login(@Valid @RequestBody AuthDtos.LoginRequest request) {
        return ApiResponse.ok("로그인에 성공했습니다.", authService.login(request));
    }
}
