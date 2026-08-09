package com.homifind.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
public class AiController {
    private final JdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper;

    @Value("${SUPABASE_URL:}") private String supabaseUrl;
    @Value("${SUPABASE_ANON_KEY:}") private String supabaseAnonKey;

    @PostMapping("/intent")
    public ResponseEntity<?> intent(@RequestBody Map<String, Object> request, JwtAuthenticationToken authentication) {
        return proxyFunction("ai-renter-intent", request, authentication);
    }

    @PostMapping("/feedback")
    public ResponseEntity<?> feedback(@RequestBody FeedbackRequest request, JwtAuthenticationToken authentication) {
        UUID userId = UUID.fromString(authentication.getToken().getSubject());
        if (request.eventType() == null || request.eventType().isBlank()) return ResponseEntity.badRequest().body(Map.of("error", "eventType is required"));
        UUID propertyId = null;
        if (request.propertyId() != null && !request.propertyId().isBlank()) {
            try { propertyId = UUID.fromString(request.propertyId()); } catch (IllegalArgumentException ex) { return ResponseEntity.badRequest().body(Map.of("error", "Invalid propertyId")); }
        }
        try {
            jdbcTemplate.update("""
                INSERT INTO public.ai_feedback_events(user_id, property_id, event_type, source, context)
                VALUES (?, ?, ?, ?, CAST(? AS jsonb))
                """, userId, propertyId, request.eventType(), request.source() == null ? "recommendation" : request.source(), objectMapper.writeValueAsString(request.context() == null ? Map.of() : request.context()));
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(Map.of("error", "Unable to record AI feedback."));
        }
    }

    private ResponseEntity<?> proxyFunction(String function, Map<String, Object> body, JwtAuthenticationToken authentication) {
        if (supabaseUrl == null || supabaseUrl.isBlank() || supabaseAnonKey == null || supabaseAnonKey.isBlank()) return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of("error", "AI service is not configured."));
        try {
            String url = supabaseUrl.replaceAll("/$", "") + "/functions/v1/" + function;
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(authentication.getToken().getTokenValue());
            headers.set("apikey", supabaseAnonKey);
            HttpEntity<String> entity = new HttpEntity<>(objectMapper.writeValueAsString(body), headers);
            ResponseEntity<String> result = new RestTemplate().exchange(url, HttpMethod.POST, entity, String.class);
            JsonNode json = objectMapper.readTree(result.getBody());
            return ResponseEntity.status(result.getStatusCode()).body(json);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(Map.of("error", "AI service unavailable."));
        }
    }

    public record FeedbackRequest(String propertyId, String eventType, String source, Map<String, Object> context) {}
}
