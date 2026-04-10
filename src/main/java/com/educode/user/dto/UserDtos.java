package com.educode.user.dto;

import com.educode.user.domain.UserRole;
import jakarta.validation.constraints.Size;

public class UserDtos {
    public record MeResponse(Long id, String email, String name, UserRole role) {}
    public record UpdateMeRequest(
            @Size(max = 100) String name,
            @Size(min = 8, max = 100) String newPassword
    ) {}
}
