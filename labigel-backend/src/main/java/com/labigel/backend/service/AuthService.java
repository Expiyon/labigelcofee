package com.labigel.backend.service;

import com.labigel.backend.dto.request.LoginRequest;
import com.labigel.backend.dto.request.PasswordChangeRequest;
import com.labigel.backend.dto.response.AuthResponse;
import com.labigel.backend.entity.User;
import com.labigel.backend.exception.ResourceNotFoundException;
import com.labigel.backend.repository.UserRepository;
import com.labigel.backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtTokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken((org.springframework.security.core.userdetails.UserDetails) authentication.getPrincipal());

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı"));

        return AuthResponse.builder()
                .token(jwt)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .build();
    }

    public AuthResponse getMe() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı"));

        return AuthResponse.builder()
                .token("") // Not needed for 'me' request
                .email(user.getEmail())
                .fullName(user.getFullName())
                .build();
    }

    public void changePassword(PasswordChangeRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı"));

        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Mevcut şifre hatalı");
        }

        // Update to new password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
