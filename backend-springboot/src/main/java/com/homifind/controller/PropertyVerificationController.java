package com.homifind.controller;

import com.homifind.entity.PropertyEntity;
import com.homifind.entity.PropertyVerificationEntity;
import com.homifind.repository.PropertyRepository;
import com.homifind.repository.PropertyVerificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/properties/{propertyId}/verification")
@RequiredArgsConstructor
public class PropertyVerificationController {
    private final PropertyRepository propertyRepository;
    private final PropertyVerificationRepository verificationRepository;

    @GetMapping
    public ResponseEntity<?> get(@PathVariable UUID propertyId, JwtAuthenticationToken auth) {
        PropertyEntity property = propertyRepository.findById(propertyId).orElse(null);
        if (property == null || property.getDeletedAt() != null) return ResponseEntity.notFound().build();
        UUID userId = UUID.fromString(auth.getToken().getSubject());
        if (!userId.equals(property.getOwnerId())) return ResponseEntity.status(403).body("Only the property owner can view verification status.");
        return verificationRepository.findByPropertyId(propertyId).<ResponseEntity<?>>map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.noContent().build());
    }

    @PostMapping("/request")
    public ResponseEntity<?> request(@PathVariable UUID propertyId, JwtAuthenticationToken auth) {
        UUID userId = UUID.fromString(auth.getToken().getSubject());
        PropertyEntity property = propertyRepository.findById(propertyId).orElse(null);
        if (property == null || property.getDeletedAt() != null) return ResponseEntity.notFound().build();
        if (!userId.equals(property.getOwnerId())) return ResponseEntity.status(403).body("Only the property owner can request verification.");
        if (verificationRepository.findByPropertyId(propertyId).isPresent()) return ResponseEntity.badRequest().body("Verification has already been requested for this property.");
        if (!("draft".equals(property.getStatus()) || "under_review".equals(property.getStatus()))) return ResponseEntity.badRequest().body("This listing cannot enter verification from its current status.");
        property.setStatus("under_review");
        propertyRepository.save(property);
        return ResponseEntity.ok(verificationRepository.save(PropertyVerificationEntity.builder().propertyId(propertyId).requestedBy(userId).status("pending").build()));
    }

    @PostMapping("/decision")
    public ResponseEntity<?> decision(@PathVariable UUID propertyId, @RequestBody DecisionRequest request, JwtAuthenticationToken auth) {
        // Reviewer authorization is intentionally server-side: only tokens carrying the admin role may approve/reject.
        if (!auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_admin"))) return ResponseEntity.status(403).body("Admin role required to review properties.");
        PropertyVerificationEntity verification = verificationRepository.findByPropertyId(propertyId).orElse(null);
        PropertyEntity property = propertyRepository.findById(propertyId).orElse(null);
        if (verification == null || property == null) return ResponseEntity.notFound().build();
        if (!"approved".equals(request.status()) && !"rejected".equals(request.status())) return ResponseEntity.badRequest().body("Decision must be approved or rejected.");
        UUID reviewerId = UUID.fromString(auth.getToken().getSubject());
        verification.setStatus(request.status()); verification.setReviewedBy(reviewerId); verification.setReviewerNotes(request.notes()); verification.setReviewedAt(OffsetDateTime.now());
        property.setStatus("approved".equals(request.status()) ? "available" : "draft");
        verificationRepository.save(verification); propertyRepository.save(property);
        return ResponseEntity.ok(verification);
    }

    public record DecisionRequest(String status, String notes) {}
}
