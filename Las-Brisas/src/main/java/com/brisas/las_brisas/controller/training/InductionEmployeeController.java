package com.brisas.las_brisas.controller.training;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.training.induction_employeeDTO;
import com.brisas.las_brisas.service.training.InductionEmployeeService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/induction-employee")
@RequiredArgsConstructor
public class InductionEmployeeController {

    private final InductionEmployeeService inductionEmployeeService;

    // ADMIN: ver todas las asignaciones
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(inductionEmployeeService.getAllFormatted());
    }

    // EMPLEADO: ver solo las suyas
    @PreAuthorize("hasRole('EMPLEADO')")
    @GetMapping("/me")
    public ResponseEntity<?> getMyInductions(Authentication auth) {
        return ResponseEntity.ok(inductionEmployeeService.findByUserEmail(auth.getName()));
    }

    // ADMIN: ver detalle por id
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable int id) {
        return inductionEmployeeService.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseDTO<>("Asignación no encontrada", HttpStatus.NOT_FOUND.toString(), null)));
    }

    // ADMIN: guardar (asignar)
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/")
    public ResponseEntity<?> save(@RequestBody induction_employeeDTO dto) {
        ResponseDTO<?> response = inductionEmployeeService.save(dto);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // EMPLEADO: completar inducción
    @PreAuthorize("hasRole('EMPLEADO')")
    @PutMapping("/{id}/complete")
    public ResponseEntity<?> completeInduction(@PathVariable int id, @RequestParam int points) {
        ResponseDTO<?> response = inductionEmployeeService.completeInduction(id, points);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // ADMIN: eliminar
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable int id) {
        ResponseDTO<?> response = inductionEmployeeService.delete(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
