package com.brisas.las_brisas.controller.contract;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.brisas.las_brisas.service.contract.CertificateService;

@RestController
@RequestMapping("/api/v1/certificates")
@RequiredArgsConstructor
public class CertificateController {

    private final CertificateService certificateService;

   
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<?> generateForEmployee(@PathVariable int employeeId) {
        try {
            byte[] pdfBytes = certificateService.generateCertificate(employeeId);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=certificado_empleado_" + employeeId + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("⚠️ Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("❌ Error al generar el certificado");
        }
    }

   
    @PreAuthorize("hasAnyRole('EMPLEADO','ADMIN')")
    @GetMapping("/me")
    public ResponseEntity<?> generateForCurrentUser(Authentication auth) {
        try {
            byte[] pdfBytes = certificateService.generateCertificateByEmail(auth.getName());
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=certificado_laboral.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("⚠️ Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("❌ Error al generar el certificado");
        }
    }
}
