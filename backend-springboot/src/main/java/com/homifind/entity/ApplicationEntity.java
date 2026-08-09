package com.homifind.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "applications", schema = "public")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "property_id", nullable = false)
    private UUID propertyId;

    @Column(name = "renter_id", nullable = false)
    private UUID renterId;

    @Column(nullable = false)
    private String status;

    @Column(name = "proposed_move_in_date")
    private LocalDate proposedMoveInDate;

    @Column(name = "occupants_count")
    private Integer occupantsCount;

    @Column(name = "annual_income")
    private BigDecimal annualIncome;

    @Column(name = "employment_status")
    private String employmentStatus;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = OffsetDateTime.now();
        if (this.status == null) this.status = "submitted";
    }
}
