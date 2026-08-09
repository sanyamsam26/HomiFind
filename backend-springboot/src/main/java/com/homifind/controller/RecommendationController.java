package com.homifind.controller;

import com.homifind.dto.RecommendationResponse;
import com.homifind.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/recommendations")
@RequiredArgsConstructor
public class RecommendationController {
    private final RecommendationService recommendationService;

    @GetMapping
    public List<RecommendationResponse> recommendations(
        JwtAuthenticationToken authentication,
        @RequestParam(defaultValue = "12") int limit
    ) {
        UUID userId = UUID.fromString(authentication.getToken().getSubject());
        return recommendationService.recommend(userId, limit);
    }
}
