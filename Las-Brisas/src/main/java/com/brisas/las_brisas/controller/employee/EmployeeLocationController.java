package com.brisas.las_brisas.controller.employee;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.employee.emplo_locationDTO;
import com.brisas.las_brisas.model.employee.emplo_location;
import com.brisas.las_brisas.service.employee.EmployeeLocationService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/employee-locations")
@RequiredArgsConstructor
public class EmployeeLocationController {

    private final EmployeeLocationService employeeLocationService;

    @GetMapping
    public ResponseEntity<List<emplo_location>> getAll() {
        return ResponseEntity.ok(employeeLocationService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable int id) {
        Optional<emplo_location> relation = employeeLocationService.findById(id);
        if (relation.isEmpty()) {
            return ResponseEntity.status(404).body(
                    new ResponseDTO<>("Relación empleado-ubicación no encontrada", "404", null)
            );
        }
        return ResponseEntity.ok(relation.get());
    }

    @PostMapping
    public ResponseEntity<ResponseDTO<emplo_locationDTO>> save(@RequestBody emplo_locationDTO dto) {
        ResponseDTO<emplo_locationDTO> response = employeeLocationService.save(dto);
        return ResponseEntity.status(Integer.parseInt(response.getStatus())).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDTO<emplo_locationDTO>> delete(@PathVariable int id) {
        ResponseDTO<emplo_locationDTO> response = employeeLocationService.delete(id);
        return ResponseEntity.status(Integer.parseInt(response.getStatus())).body(response);
    }
}
