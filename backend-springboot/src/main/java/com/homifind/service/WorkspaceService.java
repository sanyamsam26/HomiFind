package com.homifind.service;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WorkspaceService {
    private final JdbcTemplate jdbcTemplate;

    public List<Map<String, Object>> list(UUID userId) {
        return jdbcTemplate.queryForList("""
            SELECT user_id, workspace, is_active, created_at, updated_at
            FROM public.user_workspaces
            WHERE user_id = ? AND is_active = TRUE
            ORDER BY created_at ASC
            """, userId);
    }

    public Map<String, Object> enable(UUID userId, String workspace) {
        validateWorkspace(workspace);
        return jdbcTemplate.queryForMap("""
            INSERT INTO public.user_workspaces(user_id, workspace, is_active, updated_at)
            VALUES (?, ?, TRUE, NOW())
            ON CONFLICT (user_id, workspace)
            DO UPDATE SET is_active = TRUE, updated_at = NOW()
            RETURNING user_id, workspace, is_active, created_at, updated_at
            """, userId, workspace);
    }

    private void validateWorkspace(String workspace) {
        if (!List.of("renter", "owner", "broker").contains(workspace)) {
            throw new IllegalArgumentException("Unsupported workspace: " + workspace);
        }
    }
}
