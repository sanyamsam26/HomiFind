package com.homifind.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "property_verifications", schema = "public")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PropertyVerificationEntity {
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    @Column(name = "property_id", nullable = false, unique = true) private UUID propertyId;
    @Column(name = "requested_by", nullable = false) private UUID requestedBy;
    @Column(name = "reviewed_by") private UUID reviewedBy;
    @Column(nullable = false) private String status;
    @Column(name = "reviewer_notes") private String reviewerNotes;
    @Column(name = "requested_at", nullable = false, updatable = false) private OffsetDateTime requestedAt;
    @Column(name = "reviewed_at") private OffsetDateTime reviewedAt;
    @PrePersist void onCreate() { if (requestedAt == null) requestedAt = OffsetDateTime.now(); if (status == null) status = "pending"; }
}
