package com.brisas.las_brisas.position;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.position.positionsDTO;
import com.brisas.las_brisas.controller.position.PositionsController;
import com.brisas.las_brisas.model.position.positions;
import com.brisas.las_brisas.service.position.PositionsService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PositionsController.class)
@AutoConfigureMockMvc(addFilters = false)
class PositionsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PositionsService positionsService;

    // mocks de seguridad
    @MockBean
    private com.brisas.las_brisas.security.JwtAuthFilter jwtAuthFilter;
    @MockBean
    private com.brisas.las_brisas.auth.service.CustomUserDetailsService customUserDetailsService;

    @Test
    void testGetAllPositions() throws Exception {
        positions entity = positions.builder()
                .id(1)
                .namePost("Gerente")
                .description("Dirige el área")
                .jon_function("Supervisar equipos")
                .requirements("Experiencia en liderazgo")
                .build();

        when(positionsService.getAll()).thenReturn(List.of(entity));

        mockMvc.perform(get("/api/v1/positions/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].namePost").value("Gerente"))
                .andExpect(jsonPath("$[0].description").value("Dirige el área"))
                .andExpect(jsonPath("$[0].jon_function").value("Supervisar equipos"))
                .andExpect(jsonPath("$[0].requirements").value("Experiencia en liderazgo"));
    }

    @Test
    void testGetPositionById_Found() throws Exception {
        positions entity = positions.builder()
                .id(2)
                .namePost("Supervisor")
                .description("Apoya la gestión")
                .jon_function("Control de procesos")
                .requirements("Técnico o tecnólogo")
                .build();

        when(positionsService.findById(2)).thenReturn(Optional.of(entity));

        mockMvc.perform(get("/api/v1/positions/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.namePost").value("Supervisor"))
                .andExpect(jsonPath("$.description").value("Apoya la gestión"))
                .andExpect(jsonPath("$.jon_function").value("Control de procesos"))
                .andExpect(jsonPath("$.requirements").value("Técnico o tecnólogo"));
    }

    @Test
    void testGetPositionById_NotFound() throws Exception {
        when(positionsService.findById(99)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/positions/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Puesto no encontrado"));
    }

    @Test
    void testSavePosition() throws Exception {
        positionsDTO dto = positionsDTO.builder()
                .id(3)
                .namePost("Analista")
                .description("Analiza datos")
                .jobFunction("Procesar información")
                .requirements("Profesional en sistemas")
                .build();

        ResponseDTO<positionsDTO> response = new ResponseDTO<>("Guardado correctamente", "200", dto);

        when(positionsService.save(any(positionsDTO.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/positions/")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Guardado correctamente"))
                .andExpect(jsonPath("$.data.namePost").value("Analista"))
                .andExpect(jsonPath("$.data.description").value("Analiza datos"))
                .andExpect(jsonPath("$.data.jobFunction").value("Procesar información"))
                .andExpect(jsonPath("$.data.requirements").value("Profesional en sistemas"));
    }

    @Test
    void testDeletePosition() throws Exception {
        ResponseDTO<Object> response = new ResponseDTO<>("Eliminado correctamente", "200", null);

        when(positionsService.delete(1)).thenReturn((ResponseDTO) response);

        mockMvc.perform(delete("/api/v1/positions/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Eliminado correctamente"));
    }
}
