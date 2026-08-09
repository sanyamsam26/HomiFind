package com.homifind.controller;

import com.homifind.entity.PropertyEntity;
import com.homifind.entity.PropertyMediaEntity;
import com.homifind.repository.PropertyMediaRepository;
import com.homifind.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/properties/{propertyId}/media")
@RequiredArgsConstructor
public class PropertyMediaController {
    private final PropertyRepository propertyRepository;
    private final PropertyMediaRepository mediaRepository;

    @GetMapping
    public ResponseEntity<List<PropertyMediaEntity>> list(@PathVariable UUID propertyId) {
        if (!propertyRepository.existsById(propertyId)) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(mediaRepository.findByPropertyIdAndDeletedAtIsNullOrderByDisplayOrderAsc(propertyId));
    }

    @PostMapping
    public ResponseEntity<?> register(
            @PathVariable UUID propertyId,
            @RequestBody MediaRequest request,
            JwtAuthenticationToken authentication) {
        UUID userId = UUID.fromString(authentication.getToken().getSubject());
        PropertyEntity property = propertyRepository.findById(propertyId).orElse(null);
        if (property == null || property.getDeletedAt() != null) return ResponseEntity.notFound().build();
        if (!userId.equals(property.getOwnerId())) return ResponseEntity.status(403).body("Only the property owner can add media.");
        if (request.storagePath() == null || request.storagePath().isBlank()) return ResponseEntity.badRequest().body("storagePath is required.");
        if (!request.storagePath().startsWith(userId + "/" + propertyId + "/")) {
            return ResponseEntity.badRequest().body("storagePath must be inside the authenticated owner's property folder.");
        }
        if (mediaRepository.existsByPropertyIdAndStoragePathAndDeletedAtIsNull(propertyId, request.storagePath())) {
            return ResponseEntity.ok(mediaRepository.findByPropertyIdAndDeletedAtIsNullOrderByDisplayOrderAsc(propertyId));
        }
        PropertyMediaEntity media = PropertyMediaEntity.builder()
                .propertyId(propertyId).storagePath(request.storagePath())
                .mediaType(request.mediaType() == null ? "image" : request.mediaType())
                .caption(request.caption()).primary(request.primary()).displayOrder(request.displayOrder()).build();
        return ResponseEntity.ok(mediaRepository.save(media));
    }

    @DeleteMapping("/{mediaId}")
    public ResponseEntity<?> delete(@PathVariable UUID propertyId, @PathVariable UUID mediaId, JwtAuthenticationToken authentication) {
        UUID userId = UUID.fromString(authentication.getToken().getSubject());
        PropertyEntity property = propertyRepository.findById(propertyId).orElse(null);
        PropertyMediaEntity media = mediaRepository.findById(mediaId).orElse(null);
        if (property == null || media == null || !propertyId.equals(media.getPropertyId())) return ResponseEntity.notFound().build();
        if (!userId.equals(property.getOwnerId())) return ResponseEntity.status(403).body("Only the property owner can delete media.");
        media.setDeletedAt(java.time.OffsetDateTime.now());
        mediaRepository.save(media);
        return ResponseEntity.noContent().build();
    }

    public record MediaRequest(String storagePath, String mediaType, String caption, boolean primary, int displayOrder) {}
}
