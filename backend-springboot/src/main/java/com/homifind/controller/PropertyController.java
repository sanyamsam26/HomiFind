package com.homifind.controller;

import com.homifind.entity.PropertyEntity;
import com.homifind.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/properties")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PropertyController {

    private final PropertyRepository propertyRepository;

    @GetMapping
    public ResponseEntity<List<PropertyEntity>> getAllAvailableProperties() {
        return ResponseEntity.ok(propertyRepository.findByStatusAndDeletedAtIsNull("available"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyEntity> getPropertyById(@PathVariable UUID id) {
        return propertyRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PropertyEntity> createProperty(@RequestBody PropertyEntity property) {
        return ResponseEntity.ok(propertyRepository.save(property));
    }

    @GetMapping("/search")
    public ResponseEntity<List<PropertyEntity>> searchByCity(@RequestParam String city) {
        return ResponseEntity.ok(propertyRepository.findByCityIgnoreCaseAndDeletedAtIsNull(city));
    }
}
