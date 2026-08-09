package com.homifind.workspace;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Locale;

/**
 * Values intentionally match the PostgreSQL public.user_role enum exactly.
 */
public enum WorkspaceType {
    renter,
    owner,
    broker;

    @JsonValue
    public String toJson() {
        return name();
    }

    @JsonCreator
    public static WorkspaceType fromJson(String value) {
        if (value == null) {
            return null;
        }
        return valueOf(value.trim().toLowerCase(Locale.ROOT));
    }
}
