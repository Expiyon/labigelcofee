package com.labigel.backend.service;

import com.labigel.backend.dto.request.UserCreateRequest;
import com.labigel.backend.dto.request.UserUpdateRequest;
import com.labigel.backend.dto.response.UserResponse;
import com.labigel.backend.entity.User;
import com.labigel.backend.exception.DuplicateResourceException;
import com.labigel.backend.exception.ResourceNotFoundException;
import com.labigel.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserResponse createUser(UserCreateRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Bu e-posta adresi zaten kullanılıyor");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(request.getRole())
                .isActive(true)
                .build();

        return mapToResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse updateUser(Long id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı: " + id));

        // Guard against locking everyone out of the admin panel.
        boolean demotingOrDeactivatingLastAdmin = "ADMIN".equals(user.getRole())
                && (!"ADMIN".equals(request.getRole()) || Boolean.FALSE.equals(request.getIsActive()))
                && userRepository.countByRoleAndIsActiveTrue("ADMIN") <= 1;
        if (demotingOrDeactivatingLastAdmin) {
            throw new IllegalArgumentException("Sistemde en az bir aktif admin kullanıcı bulunmalıdır");
        }

        user.setFullName(request.getFullName());
        user.setRole(request.getRole());
        if (request.getIsActive() != null) {
            user.setActive(request.getIsActive());
        }
        if (StringUtils.hasText(request.getPassword())) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return mapToResponse(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı: " + id));

        String currentEmail = SecurityContextHolder.getContext().getAuthentication() != null
                ? getCurrentEmail() : null;
        if (user.getEmail().equals(currentEmail)) {
            throw new IllegalArgumentException("Kendi hesabınızı silemezsiniz");
        }

        if ("ADMIN".equals(user.getRole()) && userRepository.countByRoleAndIsActiveTrue("ADMIN") <= 1) {
            throw new IllegalArgumentException("Sistemde en az bir aktif admin kullanıcı bulunmalıdır");
        }

        userRepository.deleteById(id);
    }

    private String getCurrentEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null ? authentication.getName() : null;
    }

    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .isActive(user.isActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
