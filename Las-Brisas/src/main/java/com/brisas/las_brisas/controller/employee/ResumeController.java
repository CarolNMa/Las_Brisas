package com.brisas.las_brisas.controller.employee;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.employee.resumeDTO;
import com.brisas.las_brisas.model.employee.resume;
import com.brisas.las_brisas.service.employee.resumeService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final resumeService resumeService;

    @GetMapping
    public ResponseEntity<List<resume>> getAllResumes() {
        return ResponseEntity.ok(resumeService.getAllResumes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getResumeById(@PathVariable int id) {
        Optional<resume> r = resumeService.findById(id);
        if (r.isEmpty()) {
            return ResponseEntity.status(404).body(new ResponseDTO<>("Hoja de vida no encontrada", "404", null));
        }
        return ResponseEntity.ok(r.get());
    }

    @PostMapping
    public ResponseEntity<ResponseDTO<resumeDTO>> saveResume(@RequestBody resumeDTO dto) {
        ResponseDTO<resumeDTO> response = resumeService.save(dto);
        return ResponseEntity.status(Integer.parseInt(response.getStatus())).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDTO<resumeDTO>> deleteResume(@PathVariable int id) {
        ResponseDTO<resumeDTO> response = resumeService.deleteResume(id);
        return ResponseEntity.status(Integer.parseInt(response.getStatus())).body(response);
    }
}
