package com.homifind.workspace;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/workspaces")
@RequiredArgsConstructor
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<UserWorkspaceEntity>> getWorkspaces(@PathVariable UUID userId) {
        return ResponseEntity.ok(workspaceService.getWorkspaces(userId));
    }

    @PostMapping("/{userId}")
    public ResponseEntity<UserWorkspaceEntity> enableWorkspace(
            @PathVariable UUID userId,
            @Valid @RequestBody WorkspaceRequest request) {
        return ResponseEntity.ok(workspaceService.enableWorkspace(userId, request.workspace()));
    }

    @DeleteMapping("/{userId}/{workspace}")
    public ResponseEntity<Void> disableWorkspace(
            @PathVariable UUID userId,
            @PathVariable WorkspaceType workspace) {
        workspaceService.disableWorkspace(userId, workspace);
        return ResponseEntity.noContent().build();
    }

    public record WorkspaceRequest(@NotNull WorkspaceType workspace) {}
}
