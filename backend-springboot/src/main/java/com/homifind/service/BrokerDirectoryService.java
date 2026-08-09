package com.homifind.service;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BrokerDirectoryService {
    private final JdbcTemplate jdbcTemplate;

    public List<Map<String, Object>> search(String search) {
        String term = search == null ? "" : search.trim();
        return jdbcTemplate.queryForList("""
            SELECT DISTINCT p.id, p.full_name, p.email, p.company_name, p.license_number, p.is_verified
            FROM public.profiles p
            JOIN public.user_workspaces w ON w.user_id = p.id
            WHERE p.role = 'broker'
              AND w.workspace = 'broker'
              AND w.is_active = TRUE
              AND p.is_verified = TRUE
              AND p.deleted_at IS NULL
              AND (LOWER(p.full_name) LIKE LOWER(?) OR LOWER(p.email) LIKE LOWER(?) OR LOWER(COALESCE(p.company_name, '')) LIKE LOWER(?))
            ORDER BY p.full_name ASC
            LIMIT 25
            """, "%" + term + "%", "%" + term + "%", "%" + term + "%");
    }
}
