package com.brisas.las_brisas.controller.employee;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.employee.emplo_scheduleDTO;
import com.brisas.las_brisas.model.employee.emplo_schedule;
import com.brisas.las_brisas.service.employee.EmployeeScheduleService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/employee-schedule")
@RequiredArgsConstructor
public class EmployeeScheduleController {

    private final EmployeeScheduleService employeeScheduleService;

    @GetMapping("/")
    public ResponseEntity<List<emplo_schedule>> getAll() {
        return ResponseEntity.ok(employeeScheduleService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable int id) {
        return employeeScheduleService.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseDTO<>("Relación no encontrada", HttpStatus.NOT_FOUND.toString(), null)));
    }

    @PostMapping("/")
    public ResponseEntity<ResponseDTO<emplo_scheduleDTO>> create(@RequestBody emplo_scheduleDTO dto) {
        ResponseDTO<emplo_scheduleDTO> response = employeeScheduleService.save(dto);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDTO<emplo_scheduleDTO>> delete(@PathVariable int id) {
        ResponseDTO<emplo_scheduleDTO> response = employeeScheduleService.delete(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
