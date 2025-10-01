package com.brisas.las_brisas.controller.contract;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.contract.contractDTO;
import com.brisas.las_brisas.service.contract.ContractService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import org.springframework.core.io.UrlResource;
import org.springframework.format.annotation.DateTimeFormat;

import org.springframework.security.core.Authentication;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.nio.file.Path;
import java.nio.file.Paths;

import java.time.LocalDate;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/contracts")
@RequiredArgsConstructor
public class ContractController {
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteContractByBody(@RequestBody contractDTO dto) {
        if (dto.getId() <= 0) {
            return ResponseEntity.badRequest().body(new ResponseDTO<>("Id de contrato requerido", "400", null));
        }
        ResponseDTO<?> response = contractService.delete(dto.getId());
        if (response.getStatus().equals("200")) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteContract(@PathVariable int id) {
        ResponseDTO<?> response = contractService.delete(id);
        if (response.getStatus().equals("200")) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    private final ContractService contractService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(contractService.getAll());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/employee/{id}")
    public ResponseEntity<?> getByEmployee(@PathVariable int id) {
        return contractService.findById(id)
                .map(contract -> ResponseEntity.ok(new ResponseDTO<>("Contrato encontrado", "200", contract)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseDTO<>("Contrato no encontrado", "404", null)));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable int id) {
        return contractService.findById(id)
                .map(contract -> ResponseEntity.ok(new ResponseDTO<>("Contrato encontrado", "200", contract)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseDTO<>("Contrato no encontrado", "404", null)));
    }

    @PreAuthorize("hasRole('EMPLEADO')")
    @GetMapping("/me")
    public ResponseEntity<?> getMyContract(Authentication auth) {
        return contractService.findByUserEmail(auth.getName())
                .map(contract -> ResponseEntity.ok(
                        new ResponseDTO<>("Contrato encontrado", "200",
                                contractService.convertToDTO(contract))))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseDTO<>("Contrato no encontrado", "404", null)));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable int id, @RequestBody contractDTO dto) {
        dto.setId(id);
        return ResponseEntity.ok(contractService.save(dto));
    }

    public ResponseEntity<?> delete(@PathVariable int id) {
        return ResponseEntity.ok(contractService.delete(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createContract(
            @RequestParam("employeeId") int employeeId,
            @RequestParam("dateStart") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateStart,
            @RequestParam("dateEnd") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateEnd,
            @RequestParam("type") String type,
            @RequestParam("status") String status,
            @RequestParam(value = "fechaRenovacion", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaRenovacion,
            @RequestParam(value = "document", required = false) MultipartFile document) {
        try {
            contractDTO dto = new contractDTO();
            dto.setEmployee(employeeId);
            dto.setDateStart(dateStart);
            dto.setDateEnd(dateEnd);
            dto.setType(type);
            dto.setStatus(status);
            dto.setDateUpdate(fechaRenovacion);

            ResponseDTO<?> response = contractService.saveWithDocument(dto, document);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDTO<>("Error al crear contrato: " + e.getMessage(),
                            HttpStatus.INTERNAL_SERVER_ERROR.toString(), null));
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO')")
    @GetMapping("/download/{filename}")
    public ResponseEntity<Resource> downloadContract(@PathVariable String filename) {
        try {
            Path filePath = Paths.get("uploads/contracts").resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

}
