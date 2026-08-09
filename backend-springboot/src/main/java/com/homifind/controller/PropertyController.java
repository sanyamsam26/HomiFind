package com.homifind.controller;

import com.homifind.entity.PropertyEntity;
import com.homifind.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/properties")
@RequiredArgsConstructor
public class PropertyController {
    private final PropertyRepository propertyRepository;

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
        UUID ownerId = authenticatedUserId(authentication);
        if (property.getTitle() == null || property.getTitle().trim().length() < 5) {
            return ResponseEntity.badRequest().build();
        }
        if (property.getRentPrice() == null || property.getRentPrice().compareTo(BigDecimal.ZERO) <= 0) {
            return ResponseEntity.badRequest().build();
        }
        if (property.getAddressLine1() == null || property.getAddressLine1().isBlank()
            || property.getCity() == null || property.getCity().isBlank()
            || property.getState() == null || property.getState().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        // Ownership always comes from the authenticated account.
        // A broker assignment is a separate relationship and can never be created by this endpoint.
        property.setId(null);
        property.setOwnerId(ownerId);
        property.setBrokerId(null);
        property.setAgencyId(null);

        // New listings enter verification before they become discoverable to renters.
        property.setStatus("under_review");
        return ResponseEntity.status(HttpStatus.CREATED).body(propertyRepository.save(property));
    }

    @GetMapping("/mine")
    public ResponseEntity<List<PropertyEntity>> getMyProperties(JwtAuthenticationToken authentication) {
        UUID ownerId = authenticatedUserId(authentication);
        return ResponseEntity.ok(propertyRepository.findByOwnerIdAndDeletedAtIsNull(ownerId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<PropertyEntity>> searchByCity(@RequestParam String city) {
        return ResponseEntity.ok(propertyRepository.findByCityIgnoreCaseAndDeletedAtIsNull(city));
    }

    private UUID authenticatedUserId(JwtAuthenticationToken authentication) {
        return UUID.fromString(authentication.getToken().getSubject());
    }
}
