package com.brisas.las_brisas.controller.employee;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.employee.emplo_locationDTO;
import com.brisas.las_brisas.service.employee.EmployeeLocationService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/employee-locations")
@RequiredArgsConstructor
public class EmployeeLocationController {

    private final EmployeeLocationService employeeLocationService;

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(employeeLocationService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable int id) {
        return employeeLocationService.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseDTO<>("Relación no encontrada", HttpStatus.NOT_FOUND.toString(), null)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable int id) {
        ResponseDTO<?> response = employeeLocationService.delete(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> save(@RequestBody emplo_locationDTO dto) {
        ResponseDTO<?> response = employeeLocationService.save(dto);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
