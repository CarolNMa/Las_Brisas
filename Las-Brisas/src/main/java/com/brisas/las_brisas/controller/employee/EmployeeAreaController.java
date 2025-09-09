package com.brisas.las_brisas.controller.employee;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.employee.employee_areaDTO;
import com.brisas.las_brisas.model.employee.employee_area;
import com.brisas.las_brisas.service.employee.EmployeeAreaService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/employee-areas")
@RequiredArgsConstructor
public class EmployeeAreaController {

    private final EmployeeAreaService employeeAreaService;

    @GetMapping
    public ResponseEntity<List<employee_area>> getAll() {
        return ResponseEntity.ok(employeeAreaService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable int id) {
        Optional<employee_area> ea = employeeAreaService.findById(id);
        if (ea.isEmpty()) {
            return ResponseEntity.status(404).body(
                    new ResponseDTO<>("Relación empleado-área no encontrada", "404", null)
            );
        }
        return ResponseEntity.ok(ea.get());
    }

    @PostMapping
    public ResponseEntity<ResponseDTO<employee_areaDTO>> save(@RequestBody employee_areaDTO dto) {
        ResponseDTO<employee_areaDTO> response = employeeAreaService.save(dto);
        return ResponseEntity.status(Integer.parseInt(response.getStatus())).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDTO<employee_areaDTO>> delete(@PathVariable int id) {
        ResponseDTO<employee_areaDTO> response = employeeAreaService.delete(id);
        return ResponseEntity.status(Integer.parseInt(response.getStatus())).body(response);
    }
}
