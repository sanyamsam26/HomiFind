package com.homifind.controller;

import com.homifind.entity.ProfileEntity;
import com.homifind.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final ProfileService profileService;

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("service", "auth", "status", "ok");
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> me(@AuthenticationPrincipal Jwt jwt) {
        ProfileEntity profile = profileService.synchronizeFromJwt(jwt);
        return ResponseEntity.ok(Map.of(
            "id", profile.getId(),
            "email", profile.getEmail(),
            "name", profile.getFullName(),
            "role", profile.getRole().name(),
            "verified", Boolean.TRUE.equals(profile.getVerified())
        ));
    }

    @PostMapping("/sync")
    public ResponseEntity<Map<String, Object>> sync(@AuthenticationPrincipal Jwt jwt) {
        return me(jwt);
    }
}
