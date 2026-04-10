package com.educode.auth.service;

import com.educode.auth.dto.AuthDtos;
import com.educode.common.exception.ApiException;
import com.educode.security.JwtTokenProvider;
import com.educode.user.domain.User;
import com.educode.user.domain.UserRole;
import com.educode.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class AuthServiceTest {

    @Mock UserRepository userRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock JwtTokenProvider jwtTokenProvider;
    @Mock AuthenticationManager authenticationManager;

    @InjectMocks AuthService authService;

    @Test
    void signup_success() {
        AuthDtos.SignupRequest request = new AuthDtos.SignupRequest("a@test.com", "password123", "홍길동", UserRole.STUDENT);
        when(userRepository.existsByEmail(request.email())).thenReturn(false);
        when(passwordEncoder.encode(request.password())).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User user = inv.getArgument(0);
            return user.toBuilder().id(1L).build();
        });
        when(jwtTokenProvider.generateAccessToken(any(User.class))).thenReturn("token");

        AuthDtos.AuthResponse response = authService.signup(request);

        assertEquals("token", response.accessToken());
        assertEquals(UserRole.STUDENT, response.role());
    }

    @Test
    void signup_duplicateEmail_throws() {
        AuthDtos.SignupRequest request = new AuthDtos.SignupRequest("a@test.com", "password123", "홍길동", UserRole.STUDENT);
        when(userRepository.existsByEmail(request.email())).thenReturn(true);

        assertThrows(ApiException.class, () -> authService.signup(request));
    }

    @Test
    void login_success() {
        AuthDtos.LoginRequest request = new AuthDtos.LoginRequest("a@test.com", "pw");
        User user = User.builder().id(1L).email("a@test.com").password("encoded").name("홍길동").role(UserRole.EDUCATOR).build();
        when(userRepository.findByEmail(request.email())).thenReturn(Optional.of(user));
        when(jwtTokenProvider.generateAccessToken(user)).thenReturn("token");

        AuthDtos.AuthResponse response = authService.login(request);

        verify(authenticationManager).authenticate(any());
        assertEquals("token", response.accessToken());
    }
}
