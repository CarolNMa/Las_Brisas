package com.brisas.las_brisas.contract;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.contract.certificateDTO;
import com.brisas.las_brisas.controller.contract.CertificateController;
import com.brisas.las_brisas.model.contract.certificate;
import com.brisas.las_brisas.model.employee.employee;
import com.brisas.las_brisas.service.contract.CertificateService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CertificateController.class)
@AutoConfigureMockMvc(addFilters = false)
class CertificateControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CertificateService certificateService;

    // ⚡ mocks de seguridad (si los exige tu proyecto)
    @MockBean
    private com.brisas.las_brisas.security.JwtAuthFilter jwtAuthFilter;
    @MockBean
    private com.brisas.las_brisas.auth.service.CustomUserDetailsService customUserDetailsService;

    @Test
    void testGetAllCertificates() throws Exception {
        employee e = new employee();
        e.setId(1);

        certificate c1 = certificate.builder()
                .idCertificate(1)
                .dateCertificate(LocalDateTime.of(2025, 1, 11, 0, 0))
                .documentUrl("cert1.pdf")
                .status(certificate.status.generado)
                .type(certificate.type.laboral)
                .employee(e)
                .build();

        certificate c2 = certificate.builder()
                .idCertificate(2)
                .dateCertificate(LocalDateTime.of(2025, 1, 11, 0, 0))
                .documentUrl("cert2.pdf")
                .status(certificate.status.generado)
                .type(certificate.type.laboral)
                .employee(e)
                .build();

        when(certificateService.getAll()).thenReturn(List.of(c1, c2));

        mockMvc.perform(get("/api/v1/certificates/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].documentUrl").value("cert1.pdf"))
                .andExpect(jsonPath("$[1].documentUrl").value("cert2.pdf"));
    }

    @Test
    void testGetCertificateById_Found() throws Exception {
        employee e = new employee();
        e.setId(1);

        certificate c1 = certificate.builder()
                .idCertificate(1)
                .dateCertificate(LocalDateTime.of(2025, 1, 11, 0, 0))
                .documentUrl("cert1.pdf")
                .status(certificate.status.generado)
                .type(certificate.type.laboral)
                .employee(e)
                .build();

        when(certificateService.findById(1)).thenReturn(Optional.of(c1));

        mockMvc.perform(get("/api/v1/certificates/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.documentUrl").value("cert1.pdf"));
    }

    @Test
    void testGetCertificateById_NotFound() throws Exception {
        when(certificateService.findById(99)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/certificates/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Certificado no encontrado"));
    }

    @Test
    void testSaveCertificate() throws Exception {
        certificateDTO dto = certificateDTO.builder()
                .id(1)
                .employee(1)
                .dateCertificate(LocalDateTime.of(2025, 1, 11, 0, 0))
                .documentUrl("cert1.pdf")
                .status("generado")
                .type("laboral")
                .build();

        ResponseDTO<certificateDTO> response = new ResponseDTO<>("Certificado guardado correctamente", "200", dto);

        when(certificateService.save(any(certificateDTO.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/certificates/")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Certificado guardado correctamente"));
    }

    @Test
    void testDeleteCertificate() throws Exception {
        ResponseDTO<Object> response = new ResponseDTO<>("Certificado eliminado correctamente", "200", null);

        when(certificateService.delete(1)).thenReturn((ResponseDTO) response);

        mockMvc.perform(delete("/api/v1/certificates/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Certificado eliminado correctamente"));
    }
}
