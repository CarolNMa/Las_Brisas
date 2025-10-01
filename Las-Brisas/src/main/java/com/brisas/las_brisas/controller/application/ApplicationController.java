package com.brisas.las_brisas.controller.application;

import org.springframework.security.core.Authentication;

import com.brisas.las_brisas.DTO.application.applicationDTO;
import com.brisas.las_brisas.service.application.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PreAuthorize("hasRole('EMPLEADO')")
    @GetMapping("/me")
    public ResponseEntity<?> getMyApplications(Authentication auth) {
        return ResponseEntity.ok(applicationService.findByUserEmail(auth.getName()));
    }

    @PreAuthorize("hasRole('EMPLEADO')")
    @PostMapping("/")
    public ResponseEntity<?> create(@RequestBody applicationDTO dto, Authentication auth) {
        return ResponseEntity.ok(applicationService.create(dto, auth.getName()));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(applicationService.getAll());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable int id) {
        return ResponseEntity.ok(applicationService.approve(id, true));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable int id) {
        return ResponseEntity.ok(applicationService.approve(id, false));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable int id) {
        return ResponseEntity.ok(applicationService.delete(id));
    }
}
