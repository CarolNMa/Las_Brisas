package com.brisas.las_brisas.controller.employee;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.employee.resumeDTO;
import com.brisas.las_brisas.model.employee.resume;
import com.brisas.las_brisas.service.employee.resumeService;

import org.springframework.http.MediaType;
import lombok.RequiredArgsConstructor;

import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.io.File;
import org.springframework.http.HttpHeaders;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final resumeService resumeService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ResponseDTO<resumeDTO>> saveResume(@RequestBody resumeDTO dto) {
        ResponseDTO<resumeDTO> response = resumeService.save(dto);
        return ResponseEntity.status(Integer.parseInt(response.getStatus())).body(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDTO<resumeDTO>> deleteResume(@PathVariable int id) {
        ResponseDTO<resumeDTO> response = resumeService.deleteResume(id);
        return ResponseEntity.status(Integer.parseInt(response.getStatus())).body(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getResumeById(@PathVariable int id) {
        Optional<resumeDTO> r = resumeService.getResumeDTOById(id);
        if (r.isEmpty()) {
            return ResponseEntity.status(404)
                    .body(new ResponseDTO<>("Hoja de vida no encontrada", "404", null));
        }
        return ResponseEntity.ok(r.get());
    }

    @PreAuthorize("hasRole('EMPLEADO')")
    @GetMapping("/me")
    public ResponseEntity<?> getMyResume(Authentication auth) {
        Optional<resumeDTO> opt = resumeService.getResumeDTOByUserEmail(auth.getName());
        if (opt.isEmpty()) {
            return ResponseEntity.status(404)
                    .body(new ResponseDTO<>("Hoja de vida no encontrada", "404", null));
        }
        return ResponseEntity.ok(opt.get());
    }

    @PreAuthorize("hasRole('EMPLEADO')")
    @GetMapping("/me/download")
    public ResponseEntity<?> downloadMyResume(Authentication auth) {
        Optional<resume> opt = resumeService.findByUserEmail(auth.getName());
        if (opt.isEmpty()) {
            return ResponseEntity.status(404)
                    .body(new ResponseDTO<>("Hoja de vida no encontrada", "404", null));
        }

        resume r = opt.get();
        File file = new File(r.getDocument_url());

        if (!file.exists()) {
            return ResponseEntity.status(404)
                    .body(new ResponseDTO<>("Archivo no encontrado en el servidor", "404", null));
        }

        FileSystemResource resource = new FileSystemResource(file);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + file.getName())
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

}
