package com.educode.auth.service;

import com.educode.auth.dto.AuthDtos;
import com.educode.common.exception.ApiException;
import com.educode.common.exception.ErrorCode;
import com.educode.security.JwtTokenProvider;
import com.educode.user.domain.User;
import com.educode.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthDtos.AuthResponse signup(AuthDtos.SignupRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new ApiException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }
        User user = userRepository.save(User.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .name(request.name())
                .role(request.role())
                .build());
        String accessToken = jwtTokenProvider.generateAccessToken(user);
        return new AuthDtos.AuthResponse(user.getId(), user.getEmail(), user.getName(), user.getRole(), accessToken);
    }

    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ApiException(ErrorCode.INVALID_CREDENTIALS));
        String accessToken = jwtTokenProvider.generateAccessToken(user);
        return new AuthDtos.AuthResponse(user.getId(), user.getEmail(), user.getName(), user.getRole(), accessToken);
    }
}
