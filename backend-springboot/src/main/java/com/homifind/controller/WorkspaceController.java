package com.homifind.controller;

import com.homifind.service.WorkspaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/workspaces")
@RequiredArgsConstructor
public class WorkspaceController {
    private final WorkspaceService workspaceService;

    @GetMapping
    public List<Map<String, Object>> list(JwtAuthenticationToken authentication) {
        return workspaceService.list(userId(authentication));
    }

    @PutMapping("/{workspace}")
    public Map<String, Object> enable(
        JwtAuthenticationToken authentication,
        @PathVariable String workspace
    ) {
        return workspaceService.enable(userId(authentication), workspace);
    }

    private UUID userId(JwtAuthenticationToken authentication) {
        return UUID.fromString(authentication.getToken().getSubject());
    }
}
