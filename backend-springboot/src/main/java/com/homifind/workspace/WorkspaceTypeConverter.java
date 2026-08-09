package com.homifind.workspace;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.Locale;

@Converter
public class WorkspaceTypeConverter implements AttributeConverter<WorkspaceType, String> {

    @Override
    public String convertToDatabaseColumn(WorkspaceType attribute) {
        return attribute == null ? null : attribute.name().toLowerCase(Locale.ROOT);
    }

    @Override
    public WorkspaceType convertToEntityAttribute(String value) {
        return value == null ? null : WorkspaceType.valueOf(value.trim().toUpperCase(Locale.ROOT));
    }
}
