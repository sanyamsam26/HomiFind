package com.homifind.service;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BrokerPropertyService {
    private final JdbcTemplate jdbcTemplate;

    @Transactional
    public Map<String, Object> assign(UUID ownerId, UUID propertyId, UUID brokerId, UUID agencyId, String role) {
        requireOwner(ownerId, propertyId);
        requireBroker(brokerId);
        if (ownerId.equals(brokerId)) throw new IllegalArgumentException("An owner cannot assign themselves as broker.");
        String listingRole = role == null || role.isBlank() ? "agent" : role;
        if (!List.of("agent", "manager").contains(listingRole)) {
            throw new IllegalArgumentException("Unsupported broker listing role: " + listingRole);
        }
        return jdbcTemplate.queryForMap("""
            INSERT INTO public.property_broker_assignments
                (property_id, owner_id, broker_id, agency_id, role_in_listing, status, created_by, updated_by)
            VALUES (?, ?, ?, ?, ?, 'active', ?, ?)
            ON CONFLICT (property_id, broker_id)
            WHERE status IN ('pending', 'active') AND deleted_at IS NULL
            DO UPDATE SET agency_id = EXCLUDED.agency_id, role_in_listing = EXCLUDED.role_in_listing,
                          status = 'active', revoked_at = NULL, updated_at = NOW(), updated_by = EXCLUDED.updated_by
            RETURNING id, property_id, owner_id, broker_id, agency_id, role_in_listing, status, permissions, assigned_at
            """, propertyId, ownerId, brokerId, agencyId, listingRole, ownerId, ownerId);
    }

    public List<Map<String, Object>> listForOwner(UUID ownerId) {
        return jdbcTemplate.queryForList("""
            SELECT a.id, a.property_id, a.owner_id, a.broker_id, a.agency_id,
                   a.role_in_listing, a.status, a.permissions, a.assigned_at,
                   p.full_name AS broker_name, p.email AS broker_email
            FROM public.property_broker_assignments a JOIN public.profiles p ON p.id = a.broker_id
            WHERE a.owner_id = ? AND a.deleted_at IS NULL ORDER BY a.assigned_at DESC
            """, ownerId);
    }

    public List<Map<String, Object>> listForBroker(UUID brokerId) {
        return jdbcTemplate.queryForList("""
            SELECT a.id, a.property_id, a.owner_id, a.broker_id, a.agency_id,
                   a.role_in_listing, a.status, a.permissions, a.assigned_at,
                   p.full_name AS owner_name, p.email AS owner_email,
                   pr.title AS property_title, pr.city, pr.status AS property_status
            FROM public.property_broker_assignments a JOIN public.profiles p ON p.id = a.owner_id
            JOIN public.properties pr ON pr.id = a.property_id
            WHERE a.broker_id = ? AND a.deleted_at IS NULL ORDER BY a.assigned_at DESC
            """, brokerId);
    }

    public List<Map<String, Object>> availableBrokers() {
        return jdbcTemplate.queryForList("""
            SELECT DISTINCT p.id, p.full_name, p.email, p.company_name, p.license_number
            FROM public.profiles p JOIN public.user_workspaces w ON w.user_id = p.id
            WHERE p.role = 'broker' AND w.workspace = 'broker' AND w.is_active = TRUE AND p.deleted_at IS NULL
            ORDER BY p.full_name ASC
            """);
    }

    @Transactional
    public void revoke(UUID ownerId, UUID assignmentId) {
        int updated = jdbcTemplate.update("""
            UPDATE public.property_broker_assignments
            SET status = 'revoked', revoked_at = NOW(), updated_at = NOW(), updated_by = ?
            WHERE id = ? AND owner_id = ? AND deleted_at IS NULL
            """, ownerId, assignmentId, ownerId);
        if (updated == 0) throw new IllegalArgumentException("Broker assignment not found or not owned by this user.");
    }

    private void requireOwner(UUID ownerId, UUID propertyId) {
        Integer count = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM public.properties WHERE id = ? AND owner_id = ? AND deleted_at IS NULL",
            Integer.class, propertyId, ownerId);
        if (count == null || count == 0) throw new IllegalArgumentException("You can only assign brokers to properties you own.");
    }

    private void requireBroker(UUID brokerId) {
        Integer count = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM public.profiles p JOIN public.user_workspaces w ON w.user_id = p.id WHERE p.id = ? AND p.role = 'broker' AND w.workspace = 'broker' AND w.is_active = TRUE AND p.deleted_at IS NULL",
            Integer.class, brokerId);
        if (count == null || count == 0) throw new IllegalArgumentException("The selected user is not an active HomiFind broker.");
    }
}
