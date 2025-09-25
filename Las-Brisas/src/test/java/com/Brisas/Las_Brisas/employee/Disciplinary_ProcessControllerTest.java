package com.brisas.las_brisas.employee;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.employee.disciplinary_processDTO;
import com.brisas.las_brisas.controller.employee.disciplinary_processController;
import com.brisas.las_brisas.model.employee.disciplinary_process;
import com.brisas.las_brisas.model.employee.employee;
import com.brisas.las_brisas.model.employee.resume;
import com.brisas.las_brisas.service.employee.disciplinary_processService;
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

@WebMvcTest(disciplinary_processController.class)
@AutoConfigureMockMvc(addFilters = false)
class Disciplinary_ProcessControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private disciplinary_processService processService;

    @MockBean
    private com.brisas.las_brisas.security.JwtAuthFilter jwtAuthFilter;
    @MockBean
    private com.brisas.las_brisas.auth.service.CustomUserDetailsService customUserDetailsService;

    @Test
    void testGetAllProcesses() throws Exception {
        employee e = new employee();
        e.setId(1);
        resume r = new resume();
        r.setId(1);

        disciplinary_process p1 = disciplinary_process.builder()
                .id(1)
                .description("Llamado de atención por retrasos")
                .documentUrl("doc1.pdf")
                .date(LocalDateTime.of(2025, 1, 10, 9, 0))
                .status(disciplinary_process.status.pendiente)
                .type(disciplinary_process.type.llamado_atencion)
                .employee(e)
                .resume(r)
                .build();

        disciplinary_process p2 = disciplinary_process.builder()
                .id(2)
                .description("Suspensión por incumplimiento")
                .documentUrl("doc2.pdf")
                .date(LocalDateTime.of(2025, 2, 15, 14, 0))
                .status(disciplinary_process.status.aprobado)
                .type(disciplinary_process.type.suspension)
                .employee(e)
                .resume(r)
                .build();

        when(processService.getAllProcesses()).thenReturn(List.of(p1, p2));

        mockMvc.perform(get("/api/disciplinary-processes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].description").value("Llamado de atención por retrasos"))
                .andExpect(jsonPath("$[1].description").value("Suspensión por incumplimiento"));
    }

    @Test
    void testGetById_Found() throws Exception {
        employee e = new employee();
        e.setId(1);
        resume r = new resume();
        r.setId(1);

        disciplinary_process p1 = disciplinary_process.builder()
                .id(1)
                .description("Acta de comportamiento")
                .documentUrl("doc3.pdf")
                .date(LocalDateTime.of(2025, 3, 20, 10, 0))
                .status(disciplinary_process.status.aprobado)
                .type(disciplinary_process.type.acta)
                .employee(e)
                .resume(r)
                .build();

        when(processService.findById(1)).thenReturn(Optional.of(p1));

        mockMvc.perform(get("/api/disciplinary-processes/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.description").value("Acta de comportamiento"));
    }

    @Test
    void testGetById_NotFound() throws Exception {
        when(processService.findById(99)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/disciplinary-processes/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Proceso disciplinario no encontrado"));
    }

    @Test
    void testSaveProcess() throws Exception {
        disciplinary_processDTO dto = disciplinary_processDTO.builder()
                .id(1)
                .description("Llamado de atención por faltas leves")
                .documentUrl("doc4.pdf")
                .date(LocalDateTime.of(2025, 4, 5, 8, 0))
                .status("pendiente")
                .type("llamado_atencion")
                .employeeId(1)
                .resumeId(1)
                .build();

        ResponseDTO<disciplinary_processDTO> response = new ResponseDTO<>("Guardado correctamente", "200", dto);

        when(processService.save(any(disciplinary_processDTO.class))).thenReturn(response);

        mockMvc.perform(post("/api/disciplinary-processes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Guardado correctamente"));
    }

    @Test
    void testDeleteProcess() throws Exception {
        ResponseDTO<disciplinary_processDTO> response = new ResponseDTO<>("Eliminado correctamente", "200", null);

        when(processService.delete(1)).thenReturn(response);

        mockMvc.perform(delete("/api/disciplinary-processes/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Eliminado correctamente"));
    }
}
