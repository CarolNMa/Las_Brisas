package com.brisas.las_brisas.controller.application;

import org.springframework.security.core.Authentication;

import com.brisas.las_brisas.DTO.application.applicationDTO;
import com.brisas.las_brisas.model.application.application;
import com.brisas.las_brisas.service.application.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService service;

    // ADMIN: ver todas las solicitudes
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    // ADMIN: solicitudes de un empleado
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/employee/{id}")
    public ResponseEntity<?> getByEmployee(@PathVariable int id) {
        List<application> applications = service.findByEmployeeId(id);
        List<applicationDTO> dtos = applications.stream()
                .map(app -> service.convertToDTO(app))
                .toList();
        return ResponseEntity.ok(dtos);
    }

    // EMPLEADO: crear solicitud
    @PreAuthorize("hasRole('EMPLEADO')")
    @PostMapping
    public ResponseEntity<?> create(@RequestBody applicationDTO dto, Authentication auth) {
        return ResponseEntity.ok(service.create(dto, auth.getName()));
    }

    // EMPLEADO: ver mis solicitudes
    @PreAuthorize("hasRole('EMPLEADO')")
    @GetMapping("/me")
    public ResponseEntity<?> getMyApplications(Authentication auth) {
        return ResponseEntity.ok(service.findByUserEmail(auth.getName()));
    }

    // ADMIN: aprobar o rechazar
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable int id, @RequestParam boolean approved) {
        return ResponseEntity.ok(service.approve(id, approved));
    }

    // ADMIN: eliminar solicitud
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable int id) {
        return ResponseEntity.ok(service.delete(id));
    }
}
