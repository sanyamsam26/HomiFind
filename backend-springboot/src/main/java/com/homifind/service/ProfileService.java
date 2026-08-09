package com.homifind.service;

import com.homifind.entity.ProfileEntity;
import com.homifind.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final ProfileRepository profileRepository;

    @Transactional
    public ProfileEntity synchronizeFromJwt(Jwt jwt) {
        UUID id = UUID.fromString(jwt.getSubject());
        String email = jwt.getClaimAsString("email");
        String name = firstNonBlank(
            jwt.getClaimAsString("user_metadata.full_name"),
            jwt.getClaimAsString("name"),
            email != null ? email.substring(0, email.indexOf('@') > 0 ? email.indexOf('@') : email.length()) : "HomiFind Member"
        );

        ProfileEntity profile = profileRepository.findById(id).orElseGet(() -> ProfileEntity.builder().id(id).build());
        profile.setEmail(email == null ? "" : email);
        profile.setFullName(name);
        profile.setVerified(jwt.getClaimAsString("email_confirmed_at") != null);
        if (profile.getRole() == null) profile.setRole(ProfileEntity.UserRole.renter);
        return profileRepository.save(profile);
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) return value;
        }
        return "HomiFind Member";
    }
}
