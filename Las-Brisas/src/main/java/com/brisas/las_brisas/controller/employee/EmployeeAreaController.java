package com.brisas.las_brisas.controller.employee;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.employee.employee_areaDTO;
import com.brisas.las_brisas.service.employee.EmployeeAreaService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/employee-areas")
@RequiredArgsConstructor
public class EmployeeAreaController {

    private final EmployeeAreaService employeeAreaService;

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(employeeAreaService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable int id) {
        return employeeAreaService.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseDTO<>("Relación no encontrada", HttpStatus.NOT_FOUND.toString(), null)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable int id) {
        ResponseDTO<?> response = employeeAreaService.delete(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> save(@RequestBody employee_areaDTO dto) {
        ResponseDTO<?> response = employeeAreaService.save(dto);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
