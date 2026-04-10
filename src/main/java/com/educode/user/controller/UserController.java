package com.educode.user.controller;

import com.educode.common.response.ApiResponse;
import com.educode.security.UserPrincipal;
import com.educode.user.dto.UserDtos;
import com.educode.user.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Users")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ApiResponse<UserDtos.MeResponse> getMe(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.ok(userService.getMe(principal.getId()));
    }

    @PatchMapping("/me")
    public ApiResponse<UserDtos.MeResponse> updateMe(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UserDtos.UpdateMeRequest request
    ) {
        return ApiResponse.ok("내 정보가 수정되었습니다.", userService.updateMe(principal.getId(), request));
    }
}
