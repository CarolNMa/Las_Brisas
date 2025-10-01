package com.brisas.las_brisas.controller.employee;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.employee.EmployeeProfileDTO;
import com.brisas.las_brisas.DTO.employee.employeeDTO;

import com.brisas.las_brisas.service.employee.employeeService;
import com.brisas.las_brisas.service.employee.employeeProfileService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final employeeService employeeService;
    private final employeeProfileService employeeProfileService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<employeeDTO>> getAllEmployees() {
        List<employeeDTO> empleados = employeeService.getAllEmployees()
                .stream()
                .map(e -> employeeService.convertToDTO(e)) 
                .toList();
        return ResponseEntity.ok(empleados);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getEmployeeById(@PathVariable int id) {
        return employeeService.findById(id)
                .map(employee -> ResponseEntity.ok(employeeService.convertToDTO(employee)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{userId}/profile")
    public ResponseEntity<EmployeeProfileDTO> getEmployeeProfile(@PathVariable int userId) {
        return ResponseEntity.ok(employeeProfileService.getFullProfile(userId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ResponseDTO<employeeDTO>> createEmployee(@RequestBody employeeDTO dto) {
        return ResponseEntity.ok(employeeService.save(dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ResponseDTO<employeeDTO>> updateEmployee(
            @PathVariable int id, @RequestBody employeeDTO dto) {
        return ResponseEntity.ok(employeeService.updateEmployee(id, dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEmployee(@PathVariable int id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok("Empleado eliminado");
    }
}
