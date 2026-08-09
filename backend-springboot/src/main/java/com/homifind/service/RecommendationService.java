package com.homifind.service;

import com.homifind.dto.RecommendationResponse;
import com.homifind.entity.PropertyEntity;
import com.homifind.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RecommendationService {
    private final PropertyRepository propertyRepository;
    private final JdbcTemplate jdbcTemplate;

    public List<RecommendationResponse> recommend(UUID userId, int limit) {
        Map<String, Object> preferences = loadPreferences(userId);
        List<PropertyEntity> properties = propertyRepository.findByStatusAndDeletedAtIsNull("available");

        return properties.stream()
            .map(property -> score(property, preferences))
            .sorted((a, b) -> Integer.compare(b.matchScore(), a.matchScore()))
            .limit(Math.max(1, Math.min(limit, 50)))
            .toList();
    }

    private Map<String, Object> loadPreferences(UUID userId) {
        try {
            return jdbcTemplate.queryForMap("""
                SELECT min_budget, max_budget, workplace, min_bedrooms, pet_friendly
                FROM public.user_preferences
                WHERE user_id = ? AND deleted_at IS NULL
                """, userId);
        } catch (Exception ignored) {
            return Map.of();
        }
    }

    private RecommendationResponse score(PropertyEntity property, Map<String, Object> prefs) {
        int score = 0;
        List<String> reasons = new ArrayList<>();

        BigDecimal minBudget = decimal(prefs.get("min_budget"));
        BigDecimal maxBudget = decimal(prefs.get("max_budget"));
        if (maxBudget != null) {
            BigDecimal rent = property.getRentPrice();
            if (rent.compareTo(maxBudget) <= 0 && (minBudget == null || rent.compareTo(minBudget) >= 0)) {
                score += 40;
                reasons.add("Within your preferred budget");
            } else if (rent.compareTo(maxBudget) <= 0) {
                score += 28;
                reasons.add("Fits your maximum budget");
            } else {
                int over = rent.subtract(maxBudget).compareTo(maxBudget.multiply(new BigDecimal("0.10"))) <= 0 ? 20 : 5;
                score += over;
                if (over == 20) reasons.add("Slightly above your preferred budget");
            }
        } else {
            score += 20;
        }

        String workplace = string(prefs.get("workplace"));
        if (workplace != null && property.getCity() != null && containsLocation(workplace, property.getCity())) {
            score += 25;
            reasons.add("Location aligns with your work/study area");
        } else {
            score += 8;
        }

        Integer minBedrooms = integer(prefs.get("min_bedrooms"));
        if (minBedrooms != null && property.getBedrooms() != null) {
            if (property.getBedrooms() >= minBedrooms) {
                score += 15;
                reasons.add("Meets your bedroom requirement");
            }
        } else {
            score += 8;
        }

        Boolean petFriendly = bool(prefs.get("pet_friendly"));
        if (Boolean.TRUE.equals(petFriendly)) {
            if (Boolean.TRUE.equals(property.getIsPetFriendly())) {
                score += 10;
                reasons.add("Pet-friendly match");
            }
        } else {
            score += 10;
        }

        if (Boolean.TRUE.equals(property.getIsFurnished())) {
            reasons.add("Furnished property");
        }

        return new RecommendationResponse(property, Math.min(99, Math.max(0, score)), reasons);
    }

    private boolean containsLocation(String workplace, String city) {
        String w = workplace.toLowerCase().replace(",", " ");
        String c = city.toLowerCase().trim();
        return w.contains(c) || c.contains(w.trim());
    }

    private BigDecimal decimal(Object value) {
        if (value == null) return null;
        try { return new BigDecimal(value.toString()); } catch (NumberFormatException e) { return null; }
    }

    private Integer integer(Object value) {
        if (value == null) return null;
        try { return Integer.valueOf(value.toString()); } catch (NumberFormatException e) { return null; }
    }

    private Boolean bool(Object value) {
        if (value == null) return null;
        return Boolean.valueOf(value.toString());
    }

    private String string(Object value) {
        return value == null ? null : value.toString().trim();
    }
}
