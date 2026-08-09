package com.homifind.controller;

import com.homifind.service.BrokerPropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/broker-properties")
@RequiredArgsConstructor
public class BrokerPropertyController {
    private final BrokerPropertyService brokerPropertyService;

    @GetMapping("/owner")
    public List<Map<String, Object>> ownerAssignments(JwtAuthenticationToken authentication) {
        return brokerPropertyService.listForOwner(userId(authentication));
    }

    @GetMapping("/broker")
    public List<Map<String, Object>> brokerAssignments(JwtAuthenticationToken authentication) {
        return brokerPropertyService.listForBroker(userId(authentication));
    }

    @PostMapping("/{propertyId}/assign")
    public Map<String, Object> assign(
        JwtAuthenticationToken authentication,
        @PathVariable UUID propertyId,
        @RequestBody AssignmentRequest request
    ) {
        return brokerPropertyService.assign(
            userId(authentication), propertyId, request.brokerId(), request.agencyId(), request.role()
        );
    }

    @PostMapping("/assignments/{assignmentId}/revoke")
    public Map<String, Object> revoke(
        JwtAuthenticationToken authentication,
        @PathVariable UUID assignmentId
    ) {
        brokerPropertyService.revoke(userId(authentication), assignmentId);
        return Map.of("status", "revoked", "assignmentId", assignmentId);
    }

    private UUID userId(JwtAuthenticationToken authentication) {
        return UUID.fromString(authentication.getToken().getSubject());
    }

    public record AssignmentRequest(UUID brokerId, UUID agencyId, String role) {}
}
