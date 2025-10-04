package com.brisas.las_brisas.controller.training;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.training.module_inductionDTO;
import com.brisas.las_brisas.model.training.moduleInduction;
import com.brisas.las_brisas.service.training.ModuleInductionService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/modules")
@RequiredArgsConstructor
public class ModuleInductionController {

    private final ModuleInductionService moduleInductionService;

    // ADMIN: listar todos los módulos
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<moduleInduction>> getAll() {
        return ResponseEntity.ok(moduleInductionService.getAll());
    }

    // EMPLEADO y ADMIN: listar módulos de una inducción
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO')")
    @GetMapping("/induction/{inductionId}")
    public ResponseEntity<List<moduleInduction>> getByInduction(@PathVariable int inductionId) {
        return ResponseEntity.ok(moduleInductionService.findByInductionId(inductionId));
    }

    // EMPLEADO y ADMIN: ver un módulo
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable int id) {
        return moduleInductionService.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseDTO<>("Módulo no encontrado", HttpStatus.NOT_FOUND.toString(), null)));
    }

    // ADMIN: guardar
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ResponseDTO<module_inductionDTO>> save(@RequestBody module_inductionDTO dto) {
        ResponseDTO<module_inductionDTO> response = moduleInductionService.save(dto);
        return ResponseEntity.ok(response);
    }

    // ADMIN: actualizar
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ResponseDTO<module_inductionDTO>> update(
            @PathVariable int id,
            @RequestBody module_inductionDTO dto) {
        dto.setId(id); 
        ResponseDTO<module_inductionDTO> response = moduleInductionService.save(dto);
        return ResponseEntity.ok(response);
    }

    // ADMIN: eliminar
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDTO<module_inductionDTO>> delete(@PathVariable int id) {
        ResponseDTO<module_inductionDTO> response = moduleInductionService.delete(id);
        return ResponseEntity.ok(response);
    }
}
