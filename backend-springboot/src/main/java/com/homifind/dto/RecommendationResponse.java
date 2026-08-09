package com.homifind.dto;

import com.homifind.entity.PropertyEntity;

import java.util.List;

public record RecommendationResponse(
    PropertyEntity property,
    int matchScore,
    List<String> reasons
) {}
