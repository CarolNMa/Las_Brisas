package com.brisas.las_brisas.controller.training;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.training.module_inductionDTO;
import com.brisas.las_brisas.model.training.moduleInduction;
import com.brisas.las_brisas.service.training.ModuleInductionService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/module-induction")
@RequiredArgsConstructor
public class ModuleInductionController {

    private final ModuleInductionService moduleInductionService;

    @GetMapping
    public ResponseEntity<List<moduleInduction>> getAll() {
        return ResponseEntity.ok(moduleInductionService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable int id) {
        return moduleInductionService.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok) // forzamos el genérico
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseDTO<>("Módulo no encontrado", HttpStatus.NOT_FOUND.toString(), null)));
    }

    @PostMapping
    public ResponseEntity<ResponseDTO<module_inductionDTO>> save(@RequestBody module_inductionDTO dto) {
        ResponseDTO<module_inductionDTO> response = moduleInductionService.save(dto);
        if (response.getStatus().equals(HttpStatus.INTERNAL_SERVER_ERROR.toString())) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDTO<module_inductionDTO>> delete(@PathVariable int id) {
        ResponseDTO<module_inductionDTO> response = moduleInductionService.delete(id);
        if (response.getStatus().equals(HttpStatus.NOT_FOUND.toString())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        return ResponseEntity.ok(response);
    }
}
