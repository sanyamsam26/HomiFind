package com.homifind.workspace;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WorkspaceService {

    private final UserWorkspaceRepository repository;

    public List<UserWorkspaceEntity> getWorkspaces(UUID userId) {
        return repository.findByUserIdAndActiveTrue(userId);
    }

    @Transactional
    public UserWorkspaceEntity enableWorkspace(UUID userId, WorkspaceType workspace) {
        UserWorkspaceId id = new UserWorkspaceId(userId, workspace);
        UserWorkspaceEntity entity = repository.findById(id).orElseGet(UserWorkspaceEntity::new);
        entity.setUserId(userId);
        entity.setWorkspace(workspace);
        entity.setActive(true);
        if (entity.getCreatedAt() == null) {
            entity.setCreatedAt(OffsetDateTime.now());
        }
        entity.setUpdatedAt(OffsetDateTime.now());
        return repository.save(entity);
    }

    @Transactional
    public void disableWorkspace(UUID userId, WorkspaceType workspace) {
        repository.findById(new UserWorkspaceId(userId, workspace)).ifPresent(entity -> {
            entity.setActive(false);
            entity.setUpdatedAt(OffsetDateTime.now());
            repository.save(entity);
        });
    }
}
