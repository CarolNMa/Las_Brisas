package com.brisas.las_brisas.controller.employee;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.employee.resumeDTO;
import com.brisas.las_brisas.model.employee.resume;
import com.brisas.las_brisas.service.employee.resumeService;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final resumeService resumeService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/upload")
    public ResponseEntity<ResponseDTO<resumeDTO>> uploadResume(
            @RequestParam("employeeId") int employeeId,
            @RequestParam(value = "observations", required = false) String observations,
            @RequestParam("file") MultipartFile file) {

        try {
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body(
                        new ResponseDTO<>("El archivo PDF es obligatorio", "400", null));
            }

            if (!resumeService.existsEmployee(employeeId)) {
                return ResponseEntity.badRequest().body(
                        new ResponseDTO<>("El empleado con ID " + employeeId + " no existe", "400", null));
            }

            String uploadDir = System.getProperty("user.dir") + File.separator + "uploads" + File.separator + "resumes";
            File dir = new File(uploadDir);
            if (!dir.exists())
                dir.mkdirs();

            String filePath = uploadDir + File.separator + System.currentTimeMillis() + "_"
                    + file.getOriginalFilename();
            file.transferTo(new File(filePath));

            resumeDTO dto = resumeDTO.builder()
                    .id(0)
                    .employeeId(employeeId)
                    .documentUrl(filePath) 
                    .observations(observations != null ? observations : "")
                    .dateCreate(java.time.LocalDateTime.now())
                    .dateUpdate(java.time.LocalDateTime.now())
                    .build();

            ResponseDTO<resumeDTO> response = resumeService.save(dto);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(
                    new ResponseDTO<>("Error al subir archivo: " + e.getMessage(),
                            String.valueOf(HttpStatus.INTERNAL_SERVER_ERROR.value()), null));
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<?> getAllResumes() {
        return ResponseEntity.ok(resumeService.getAllResumesDTO());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}/download")
    public ResponseEntity<?> downloadResume(@PathVariable int id) {
        Optional<resume> opt = resumeService.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(404)
                    .body(new ResponseDTO<>("Hoja de vida no encontrada", "404", null));
        }

        File file = new File(opt.get().getDocument_url());
        if (!file.exists()) {
            return ResponseEntity.status(404)
                    .body(new ResponseDTO<>("Archivo no encontrado en el servidor", "404", null));
        }

        FileSystemResource resource = new FileSystemResource(file);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + file.getName())
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDTO<resumeDTO>> deleteResume(@PathVariable int id) {
        ResponseDTO<resumeDTO> response = resumeService.deleteResume(id);
        return ResponseEntity.status(Integer.parseInt(response.getStatus())).body(response);
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

        File file = new File(opt.get().getDocument_url());
        if (!file.exists()) {
            return ResponseEntity.status(404)
                    .body(new ResponseDTO<>("Archivo no encontrado en el servidor", "404", null));
        }

        FileSystemResource resource = new FileSystemResource(file);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + file.getName())
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ResponseDTO<resumeDTO>> updateResume(
            @PathVariable int id,
            @RequestParam("employeeId") int employeeId,
            @RequestParam(value = "observations", required = false) String observations,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        try {
            String filePath = null;

            if (file != null && !file.isEmpty()) {
                String uploadDir = System.getProperty("user.dir") + File.separator + "uploads" + File.separator
                        + "resumes";
                File dir = new File(uploadDir);
                if (!dir.exists())
                    dir.mkdirs();

                filePath = uploadDir + File.separator + System.currentTimeMillis() + "_" + file.getOriginalFilename();
                file.transferTo(new File(filePath));
            }

            resumeDTO dto = resumeDTO.builder()
                    .id(id)
                    .employeeId(employeeId)
                    .documentUrl(filePath) 
                    .observations(observations != null ? observations : "")
                    .dateUpdate(LocalDateTime.now())
                    .build();

            ResponseDTO<resumeDTO> response = resumeService.update(dto);
            return ResponseEntity.status(Integer.parseInt(response.getStatus())).body(response);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    new ResponseDTO<>("Error al actualizar archivo: " + e.getMessage(),
                            String.valueOf(HttpStatus.INTERNAL_SERVER_ERROR.value()), null));
        }
    }

}
