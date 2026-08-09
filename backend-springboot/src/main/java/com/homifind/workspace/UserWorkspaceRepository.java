package com.homifind.workspace;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface UserWorkspaceRepository extends JpaRepository<UserWorkspaceEntity, UserWorkspaceId> {
    List<UserWorkspaceEntity> findByUserIdAndActiveTrue(UUID userId);
}
