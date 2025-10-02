package com.brisas.las_brisas.controller.application;

import org.springframework.security.core.Authentication;
import com.brisas.las_brisas.DTO.application.applicationDTO;
import com.brisas.las_brisas.service.application.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.MediaType;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/v1/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    // 🔹 Obtener TODAS las solicitudes (ADMIN)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<applicationDTO>> getAll() {
        var apps = applicationService.getAll()
                .stream()
                .map(applicationService::convertToDTO)
                .toList();
        return ResponseEntity.ok(apps);
    }

    // 🔹 Obtener solicitudes del usuario autenticado (EMPLEADO)
    @PreAuthorize("hasRole('EMPLEADO')")
    @GetMapping("/me")
    public ResponseEntity<List<applicationDTO>> getMyApplications(Authentication auth) {
        var apps = applicationService.findByUserEmail(auth.getName())
                .stream()
                .map(applicationService::convertToDTO)
                .toList();
        return ResponseEntity.ok(apps);
    }

    // 🔹 Obtener solicitud por ID
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable int id) {
        return applicationService.findById(id)
                .map(app -> ResponseEntity.ok(applicationService.convertToDTO(app)))
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔹 Crear solicitud (EMPLEADO)
    @PreAuthorize("hasRole('EMPLEADO')")
    @PostMapping(value = "/", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> create(
            @RequestParam("applicationTypeid") int applicationTypeid,
            @RequestParam("reason") String reason,
            @RequestParam(value = "dateStart", required = false) String dateStart,
            @RequestParam(value = "dateEnd", required = false) String dateEnd,
            @RequestParam(value = "file", required = false) MultipartFile file,
            Authentication auth) {

        String documentUrl = null;

        try {
            if (file != null && !file.isEmpty()) {
                Path uploadsDir = Paths.get(System.getProperty("user.home"), "uploads");
                Files.createDirectories(uploadsDir);

                String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                Path path = uploadsDir.resolve(fileName);
                file.transferTo(path.toFile());

                documentUrl = fileName;
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("❌ Error guardando archivo: " + e.getMessage());
        }

        // Parseo de fechas
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
        LocalDateTime start = null, end = null;
        try {
            if (dateStart != null && !dateStart.isEmpty()) {
                start = LocalDateTime.parse(dateStart, formatter);
            }
            if (dateEnd != null && !dateEnd.isEmpty()) {
                end = LocalDateTime.parse(dateEnd, formatter);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("❌ Error en formato de fechas. Usa yyyy-MM-ddTHH:mm:ss → Ejemplo: 2025-10-06T00:00:00");
        }

        applicationDTO dto = applicationDTO.builder()
                .applicationTypeid(applicationTypeid)
                .reason(reason)
                .dateStart(start)
                .dateEnd(end)
                .documentUrl(documentUrl)
                .build();

        return ResponseEntity.ok(applicationService.create(dto, auth.getName()));
    }

    // 🔹 Eliminar solicitud
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable int id) {
        return ResponseEntity.ok(applicationService.delete(id));
    }

    // 🔹 Aprobar o rechazar (solo ADMIN)
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable int id, @RequestParam boolean approved) {
        return ResponseEntity.ok(applicationService.approve(id, approved));
    }

    @GetMapping("/download/{filename}")
    public ResponseEntity<Resource> downloadApplicationFile(@PathVariable String filename) {
        Path path = Paths.get(System.getProperty("user.home"), "uploads").resolve(filename);
        Resource resource = new FileSystemResource(path.toFile());

        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(resource);
    }
}
