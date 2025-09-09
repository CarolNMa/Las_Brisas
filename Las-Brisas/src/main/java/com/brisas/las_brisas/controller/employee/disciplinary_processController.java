package com.brisas.las_brisas.controller.employee;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.employee.disciplinary_processDTO;
import com.brisas.las_brisas.model.employee.disciplinary_process;
import com.brisas.las_brisas.service.employee.disciplinary_processService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/disciplinary-processes")
@RequiredArgsConstructor
public class disciplinary_processController {

    private final disciplinary_processService processService;

    @GetMapping
    public ResponseEntity<List<disciplinary_process>> getAll() {
        return ResponseEntity.ok(processService.getAllProcesses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable int id) {
        Optional<disciplinary_process> process = processService.findById(id);
        if (process.isEmpty()) {
            return ResponseEntity.status(404).body(
                    new ResponseDTO<>("Proceso disciplinario no encontrado", "404", null)
            );
        }
        return ResponseEntity.ok(process.get());
    }

    @PostMapping
    public ResponseEntity<ResponseDTO<disciplinary_processDTO>> save(@RequestBody disciplinary_processDTO dto) {
        ResponseDTO<disciplinary_processDTO> response = processService.save(dto);
        return ResponseEntity.status(Integer.parseInt(response.getStatus())).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDTO<disciplinary_processDTO>> delete(@PathVariable int id) {
        ResponseDTO<disciplinary_processDTO> response = processService.delete(id);
        return ResponseEntity.status(Integer.parseInt(response.getStatus())).body(response);
    }
}
