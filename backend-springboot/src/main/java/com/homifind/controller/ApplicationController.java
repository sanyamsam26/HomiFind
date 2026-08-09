package com.homifind.controller;

import com.homifind.entity.ApplicationEntity;
import com.homifind.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/applications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ApplicationController {

    private final ApplicationRepository applicationRepository;

    @PostMapping
    public ResponseEntity<ApplicationEntity> submitApplication(@RequestBody ApplicationEntity application) {
        return ResponseEntity.ok(applicationRepository.save(application));
    }

    @GetMapping("/renter/{renterId}")
    public ResponseEntity<List<ApplicationEntity>> getRenterApplications(@PathVariable UUID renterId) {
        return ResponseEntity.ok(applicationRepository.findByRenterId(renterId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApplicationEntity> updateStatus(@PathVariable UUID id, @RequestParam String status) {
        return applicationRepository.findById(id).map(app -> {
            app.setStatus(status);
            return ResponseEntity.ok(applicationRepository.save(app));
        }).orElse(ResponseEntity.notFound().build());
    }
}
