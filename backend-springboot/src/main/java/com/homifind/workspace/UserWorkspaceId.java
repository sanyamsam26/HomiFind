package com.homifind.workspace;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class UserWorkspaceId implements Serializable {
    private UUID userId;
    private WorkspaceType workspace;
}
