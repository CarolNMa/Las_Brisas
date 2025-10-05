package com.brisas.las_brisas.controller.attendance;

import com.brisas.las_brisas.DTO.attendance.AttendanceRequest;
import com.brisas.las_brisas.DTO.attendance.attendanceDTO;
import com.brisas.las_brisas.model.attendance.attendance;
import com.brisas.las_brisas.service.attendance.AttendanceService;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/v1/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<?> getAll() {
        var records = attendanceService.getAll()
                .stream()
                .map(attendanceService::convertToDTO)
                .toList();

        return ResponseEntity.ok(records);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable int id) {
        return attendanceService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('EMPLEADO')")
    @GetMapping("/me")
    public ResponseEntity<?> getMyAttendance(Authentication auth) {
        List<attendance> records = attendanceService.findByUserEmail(auth.getName());
        List<attendanceDTO> dtoList = records.stream()
                .map(attendanceService::convertToDTO)
                .toList();
        return ResponseEntity.ok(dtoList);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<?> getAttendanceByEmployee(@PathVariable int employeeId) {
        List<attendance> records = attendanceService.findByEmployeeId(employeeId);
        List<attendanceDTO> dtoList = records.stream()
                .map(attendanceService::convertToDTO)
                .toList();
        return ResponseEntity.ok(dtoList);
    }

    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO')")
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AttendanceRequest request, Authentication auth) {
        return ResponseEntity.ok(
                attendanceService.registerAttendance(auth.getName(), request.getType()));
    }

    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO')")
    @PostMapping
    public ResponseEntity<?> create(@RequestBody attendanceDTO dto) {
        return ResponseEntity.ok(attendanceService.save(dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable int id, @RequestBody attendanceDTO dto) {
        dto.setId(id);
        return ResponseEntity.ok(attendanceService.save(dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable int id) {
        return ResponseEntity.ok(attendanceService.delete(id));
    }
}
