package com.homifind.repository;

import com.homifind.entity.PropertyMediaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PropertyMediaRepository extends JpaRepository<PropertyMediaEntity, UUID> {
    List<PropertyMediaEntity> findByPropertyIdAndDeletedAtIsNullOrderByDisplayOrderAsc(UUID propertyId);
    boolean existsByPropertyIdAndStoragePathAndDeletedAtIsNull(UUID propertyId, String storagePath);
}
