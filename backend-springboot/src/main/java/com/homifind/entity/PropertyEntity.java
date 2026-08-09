package com.homifind.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "properties", schema = "public")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "owner_id", nullable = false)
    private UUID ownerId;

    @Column(name = "broker_id")
    private UUID brokerId;

    @Column(name = "agency_id")
    private UUID agencyId;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(name = "property_type", nullable = false)
    private String propertyType;

    @Column(nullable = false)
    private String status;

    @Column(name = "rent_price", nullable = false)
    private BigDecimal rentPrice;

    @Column(name = "deposit_amount")
    private BigDecimal depositAmount;

    @Column(name = "utilities_included")
    private Boolean utilitiesIncluded;

    private Integer bedrooms;

    @Column(name = "bathrooms", precision = 3, scale = 1)
    private BigDecimal bathrooms;

    @Column(name = "square_feet")
    private Integer squareFeet;

    @Column(name = "is_pet_friendly")
    private Boolean isPetFriendly;

    @Column(name = "is_furnished")
    private Boolean isFurnished;

    @Column(name = "address_line1", nullable = false)
    private String addressLine1;

    @Column(name = "zip_code", nullable = false)
    private String zipCode;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private String country;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @Column(name = "deleted_at")
    private OffsetDateTime deletedAt;

    @PrePersist
    protected void onCreate() {
        OffsetDateTime now = OffsetDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.status == null) this.status = "available";
        if (this.country == null) this.country = "India";
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }
}
