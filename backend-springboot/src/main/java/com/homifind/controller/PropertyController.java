package com.homifind.controller;

import com.homifind.entity.PropertyEntity;
import com.homifind.repository.PropertyRepository;
import com.homifind.service.PropertyAiProcessingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/properties")
@RequiredArgsConstructor
public class PropertyController {
    private final PropertyRepository propertyRepository;
    private final PropertyAiProcessingService propertyAiProcessingService;

    @GetMapping
    public ResponseEntity<List<PropertyEntity>> getAllAvailableProperties() {
        return ResponseEntity.ok(propertyRepository.findByStatusAndDeletedAtIsNull("available"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyEntity> getPropertyById(@PathVariable UUID id) {
        return propertyRepository.findById(id)
            .filter(property -> property.getDeletedAt() == null)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PropertyEntity> createProperty(
        JwtAuthenticationToken authentication,
        @RequestBody PropertyEntity property
    ) {
        UUID ownerId = UUID.fromString(authentication.getToken().getSubject());
        property.setId(null);
        property.setOwnerId(ownerId);
        property.setBrokerId(null);
        property.setStatus("under_review");
        PropertyEntity saved = propertyRepository.save(property);
        propertyAiProcessingService.processAsync(saved.getId());
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/mine")
    public ResponseEntity<List<PropertyEntity>> getMyProperties(JwtAuthenticationToken authentication) {
        UUID ownerId = UUID.fromString(authentication.getToken().getSubject());
        return ResponseEntity.ok(propertyRepository.findByOwnerIdAndDeletedAtIsNull(ownerId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<PropertyEntity>> searchByCity(@RequestParam String city) {
        return ResponseEntity.ok(propertyRepository.findByCityIgnoreCaseAndDeletedAtIsNull(city));
    }
}
