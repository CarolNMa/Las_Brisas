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

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(inductionEmployeeService.getAllFormatted());
    }

    @PreAuthorize("hasRole('EMPLEADO')")
    @GetMapping("/me")
    public ResponseEntity<?> getMyInductions(Authentication auth) {
        var list = inductionEmployeeService.findByUserEmailFormatted(auth.getName());
        return ResponseEntity.ok(list);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> save(@RequestBody induction_employeeDTO dto) {
        ResponseDTO<?> response = inductionEmployeeService.save(dto);
        return new ResponseEntity<>(response, HttpStatus.valueOf(Integer.parseInt(response.getStatus())));
    }

    @PreAuthorize("hasRole('EMPLEADO')")
    @PutMapping("/{id}/seen")
    public ResponseEntity<?> markAsSeen(@PathVariable int id) {
        ResponseDTO<?> response = inductionEmployeeService.markAsSeen(id);
        return new ResponseEntity<>(response, HttpStatus.valueOf(Integer.parseInt(response.getStatus())));
    }

    @PreAuthorize("hasRole('EMPLEADO')")
    @PutMapping("/{id}/complete")
    public ResponseEntity<?> completeInduction(@PathVariable int id, @RequestParam int points) {
        ResponseDTO<?> response = inductionEmployeeService.completeInduction(id, points);
        return new ResponseEntity<>(response, HttpStatus.valueOf(Integer.parseInt(response.getStatus())));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable int id) {
        ResponseDTO<?> response = inductionEmployeeService.delete(id);
        return new ResponseEntity<>(response, HttpStatus.valueOf(Integer.parseInt(response.getStatus())));
    }

    @PreAuthorize("hasRole('EMPLEADO')")
    @PutMapping("/{id}/complete-training")
    public ResponseEntity<?> completeCapacitacion(@PathVariable int id) {
        ResponseDTO<?> response = inductionEmployeeService.completeCapacitacion(id);
        return new ResponseEntity<>(response, HttpStatus.valueOf(Integer.parseInt(response.getStatus())));
    }

}
