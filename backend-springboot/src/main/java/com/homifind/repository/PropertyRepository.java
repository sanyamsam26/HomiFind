package com.homifind.repository;

import com.homifind.entity.PropertyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PropertyRepository extends JpaRepository<PropertyEntity, UUID> {
    List<PropertyEntity> findByStatusAndDeletedAtIsNull(String status);
    List<PropertyEntity> findByOwnerIdAndDeletedAtIsNull(UUID ownerId);
    List<PropertyEntity> findByCityIgnoreCaseAndDeletedAtIsNull(String city);
}
