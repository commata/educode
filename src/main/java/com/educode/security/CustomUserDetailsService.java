package com.educode.security;

import com.educode.common.exception.ApiException;
import com.educode.common.exception.ErrorCode;
import com.educode.user.domain.User;
import com.educode.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));
        return new UserPrincipal(user);
    }

    public UserPrincipal loadByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));
        return new UserPrincipal(user);
    }
}
