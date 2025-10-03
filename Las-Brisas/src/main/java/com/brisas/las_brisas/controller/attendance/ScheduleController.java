package com.brisas.las_brisas.controller.attendance;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.attendance.scheduleDTO;
import com.brisas.las_brisas.service.attendance.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/schedules")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(scheduleService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable int id) {
        return scheduleService.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseDTO<>("Horario no encontrado", HttpStatus.NOT_FOUND.toString(), null)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable int id) {
        ResponseDTO<?> response = scheduleService.delete(id);
        return new ResponseEntity<>(response,
                response.getStatus().equals(HttpStatus.OK.toString()) ? HttpStatus.OK : HttpStatus.NOT_FOUND);
    }

    @PostMapping
    public ResponseEntity<?> save(@RequestBody scheduleDTO dto) {
        ResponseDTO<?> response = scheduleService.save(dto);
        HttpStatus status = response.getStatus().equals(HttpStatus.OK.toString()) ? HttpStatus.OK
                : HttpStatus.BAD_REQUEST;
        return new ResponseEntity<>(response, status);
    }
}
