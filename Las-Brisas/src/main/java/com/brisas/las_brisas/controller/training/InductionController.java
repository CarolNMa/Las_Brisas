package com.brisas.las_brisas.controller.training;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.training.inductionDTO;
import com.brisas.las_brisas.service.training.InductionService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/inductions")
@RequiredArgsConstructor
public class InductionController {

    private final InductionService inductionService;

    // ADMIN: listar todas
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<?> getAllInductions() {
        return ResponseEntity.ok(inductionService.getAll());
    }

    // EMPLEADO y ADMIN: ver detalle
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_EMPLEADO')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getInductionById(@PathVariable int id) {
        return ResponseEntity.ok(inductionService.findById(id));
    }

    // ADMIN: crear o actualizar
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<Object> createOrUpdateInduction(@RequestBody inductionDTO dto) {
        ResponseDTO<inductionDTO> response = inductionService.save(dto);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // ADMIN: eliminar
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteInduction(@PathVariable int id) {
        ResponseDTO<inductionDTO> response = inductionService.delete(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Listar solo capacitaciones
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/capacitaciones")
    public ResponseEntity<?> getAllCapacitaciones() {
        return ResponseEntity.ok(inductionService.getAllCapacitaciones());
    }

    // Crear o actualizar capacitación
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping("/capacitaciones")
    public ResponseEntity<Object> createOrUpdateCapacitacion(@RequestBody inductionDTO dto) {
        dto.setType("capacitacion");
        ResponseDTO<inductionDTO> response = inductionService.saveCapacitacion(dto);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
