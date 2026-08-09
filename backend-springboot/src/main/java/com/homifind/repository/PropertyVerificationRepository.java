package com.homifind.repository;

import com.homifind.entity.PropertyVerificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface PropertyVerificationRepository extends JpaRepository<PropertyVerificationEntity, UUID> {
    Optional<PropertyVerificationEntity> findByPropertyId(UUID propertyId);
}
