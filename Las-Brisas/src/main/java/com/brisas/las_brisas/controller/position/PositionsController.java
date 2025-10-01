package com.brisas.las_brisas.controller.position;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.position.positionsDTO;
import com.brisas.las_brisas.service.position.PositionsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/positions")
@RequiredArgsConstructor
public class PositionsController {

    private final PositionsService positionsService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(positionsService.getAll());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable int id) {
        return positionsService.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseDTO<>("Puesto no encontrado", HttpStatus.NOT_FOUND.toString(), null)));
    }

    
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable int id) {
        ResponseDTO<?> response = positionsService.delete(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/")
    public ResponseEntity<?> save(@RequestBody positionsDTO dto) {
        ResponseDTO<?> response = positionsService.save(dto);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
