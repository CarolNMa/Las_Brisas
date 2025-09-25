package com.brisas.las_brisas.employee;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.employee.resumeDTO;
import com.brisas.las_brisas.controller.employee.ResumeController;
import com.brisas.las_brisas.model.employee.employee;
import com.brisas.las_brisas.model.employee.resume;
import com.brisas.las_brisas.service.employee.resumeService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ResumeController.class)
@AutoConfigureMockMvc(addFilters = false)
class ResumeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private resumeService resumeService;

    @MockBean
    private com.brisas.las_brisas.security.JwtAuthFilter jwtAuthFilter;
    @MockBean
    private com.brisas.las_brisas.auth.service.CustomUserDetailsService customUserDetailsService;

    @Test
    void testGetAllResumes() throws Exception {
        employee e = new employee();
        e.setId(1);

        resume r1 = resume.builder()
                .id(1)
                .date_create(LocalDateTime.of(2025, 1, 10, 10, 0))
                .date_create(LocalDateTime.of(2025, 2, 10, 12, 0))
                .document_url("cv1.pdf")
                .observations("Primera hoja de vida")
                .employee(e)
                .build();

        resume r2 = resume.builder()
                .id(2)
                .date_create(LocalDateTime.of(2025, 3, 5, 9, 0))
                .date_create(LocalDateTime.of(2025, 3, 20, 11, 0))
                .document_url("cv2.pdf")
                .observations("Segunda hoja de vida")
                .employee(e)
                .build();

        when(resumeService.getAllResumes()).thenReturn(List.of(r1, r2));

        mockMvc.perform(get("/api/resumes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].document_url").value("cv1.pdf"))
                .andExpect(jsonPath("$[1].document_url").value("cv2.pdf"));
    }

    @Test
    void testGetResumeById_Found() throws Exception {
        employee e = new employee();
        e.setId(1);

        resume r1 = resume.builder()
                .id(1)
                .date_create(LocalDateTime.of(2025, 1, 10, 10, 0))
                .date_update(LocalDateTime.of(2025, 2, 10, 12, 0))
                .document_url("cv1.pdf")
                .observations("Primera hoja de vida")
                .employee(e)
                .build();

        when(resumeService.findById(1)).thenReturn(Optional.of(r1));

        mockMvc.perform(get("/api/resumes/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.document_url").value("cv1.pdf"));
    }

    @Test
    void testGetResumeById_NotFound() throws Exception {
        when(resumeService.findById(99)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/resumes/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Hoja de vida no encontrada"));
    }

    @Test
    void testSaveResume() throws Exception {
        resumeDTO dto = resumeDTO.builder()
                .id(1)
                .dateCreate(LocalDateTime.of(2025, 1, 10, 10, 0))
                .dateUpdate(LocalDateTime.of(2025, 2, 10, 12, 0))
                .documentUrl("cv1.pdf")
                .observations("Primera hoja de vida")
                .employeeId(1)
                .build();

        ResponseDTO<resumeDTO> response = new ResponseDTO<>("Guardado correctamente", "200", dto);

        when(resumeService.save(any(resumeDTO.class))).thenReturn(response);

        mockMvc.perform(post("/api/resumes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Guardado correctamente"));
    }

    @Test
    void testDeleteResume() throws Exception {
        ResponseDTO<resumeDTO> response = new ResponseDTO<>("Eliminado correctamente", "200", null);

        when(resumeService.deleteResume(1)).thenReturn(response);

        mockMvc.perform(delete("/api/resumes/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Eliminado correctamente"));
    }
}
