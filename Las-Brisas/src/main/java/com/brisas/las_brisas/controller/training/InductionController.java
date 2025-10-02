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
@RequestMapping("/api/v1/induction")
@RequiredArgsConstructor
public class InductionController {

    private final InductionService inductionService;

    // ADMIN: listar todas
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/")
    public ResponseEntity<?> getAllInductions() {
        return ResponseEntity.ok(inductionService.getAll());
    }

    // EMPLEADO y ADMIN: ver detalle
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getInductionById(@PathVariable int id) {
        return ResponseEntity.ok(inductionService.findById(id));
    }

    // ADMIN: crear o actualizar
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/")
    public ResponseEntity<Object> createOrUpdateInduction(@RequestBody inductionDTO dto) {
        ResponseDTO<inductionDTO> response = inductionService.save(dto);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // ADMIN: eliminar
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteInduction(@PathVariable int id) {
        ResponseDTO<inductionDTO> response = inductionService.delete(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
