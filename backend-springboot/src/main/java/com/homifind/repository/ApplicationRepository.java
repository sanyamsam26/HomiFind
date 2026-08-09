package com.homifind.repository;

import com.homifind.entity.ApplicationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ApplicationRepository extends JpaRepository<ApplicationEntity, UUID> {
    List<ApplicationEntity> findByRenterId(UUID renterId);
    List<ApplicationEntity> findByPropertyId(UUID propertyId);
}
