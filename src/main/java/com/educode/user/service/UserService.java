package com.educode.user.service;

import com.educode.common.exception.ApiException;
import com.educode.common.exception.ErrorCode;
import com.educode.user.domain.User;
import com.educode.user.dto.UserDtos;
import com.educode.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserDtos.MeResponse getMe(Long userId) {
        User user = getUser(userId);
        return new UserDtos.MeResponse(user.getId(), user.getEmail(), user.getName(), user.getRole());
    }

    @Transactional
    public UserDtos.MeResponse updateMe(Long userId, UserDtos.UpdateMeRequest request) {
        User user = getUser(userId);
        String encoded = request.newPassword() != null && !request.newPassword().isBlank()
                ? passwordEncoder.encode(request.newPassword()) : null;
        user.updateProfile(request.name(), encoded);
        return new UserDtos.MeResponse(user.getId(), user.getEmail(), user.getName(), user.getRole());
    }

    public User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));
    }
}
