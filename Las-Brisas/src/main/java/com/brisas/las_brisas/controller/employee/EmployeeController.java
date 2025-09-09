package com.brisas.las_brisas.controller.employee;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.employee.employeeDTO;
import com.brisas.las_brisas.model.employee.employee;
import com.brisas.las_brisas.service.employee.employeeService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final employeeService employeeService;

    @GetMapping
    public ResponseEntity<List<employee>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEmployeeById(@PathVariable int id) {
        Optional<employee> emp = employeeService.findById(id);
        if (emp.isEmpty()) {
            return ResponseEntity.status(404).body(new ResponseDTO<>("Empleado no encontrado", "404", null));
        }
        return ResponseEntity.ok(emp.get());
    }

    @PostMapping
    public ResponseEntity<ResponseDTO<employeeDTO>> saveEmployee(@RequestBody employeeDTO dto) {
        ResponseDTO<employeeDTO> response = employeeService.save(dto);

        HttpStatus httpStatus;
        try {
            // Si el status es un número (ej: "200", "404")
            httpStatus = HttpStatus.valueOf(Integer.parseInt(response.getStatus()));
        } catch (NumberFormatException e) {
            // Si el status es un texto (ej: "OK", "NOT_FOUND")
            try {
                httpStatus = HttpStatus.valueOf(response.getStatus().toUpperCase());
            } catch (IllegalArgumentException ex) {
                // Si tampoco coincide, default a 200
                httpStatus = HttpStatus.OK;
            }
        }

        return ResponseEntity.status(httpStatus).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDTO<employeeDTO>> deleteEmployee(@PathVariable int id) {
        ResponseDTO<employeeDTO> response = employeeService.deleteEmployee(id);
         HttpStatus httpStatus;
        try {
            // Si el status es un número (ej: "200", "404")
            httpStatus = HttpStatus.valueOf(Integer.parseInt(response.getStatus()));
        } catch (NumberFormatException e) {
            // Si el status es un texto (ej: "OK", "NOT_FOUND")
            try {
                httpStatus = HttpStatus.valueOf(response.getStatus().toUpperCase());
            } catch (IllegalArgumentException ex) {
                // Si tampoco coincide, default a 200
                httpStatus = HttpStatus.OK;
            }
        }

        return ResponseEntity.status(httpStatus).body(response);
    }
}
