package com.brisas.las_brisas.area;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.area.areaDTO;
import com.brisas.las_brisas.controller.area.AreaController;
import com.brisas.las_brisas.model.area.area;
import com.brisas.las_brisas.service.area.AreaService;

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

@WebMvcTest(AreaController.class)
@AutoConfigureMockMvc(addFilters = false)
class AreaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AreaService areaService;

    // 👇 mocks de seguridad si tu proyecto los exige
    @MockBean
    private com.brisas.las_brisas.security.JwtAuthFilter jwtAuthFilter;
    @MockBean
    private com.brisas.las_brisas.auth.service.CustomUserDetailsService customUserDetailsService;

    @Test
    void testGetAllAreas() throws Exception {
        area area1 = area.builder().id(1).nameArea("TI").description("Tecnología").build();
        area area2 = area.builder().id(2).nameArea("RH").description("Recursos Humanos").build();

        when(areaService.getAll()).thenReturn(List.of(area1, area2));

        mockMvc.perform(get("/api/v1/area/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nameArea").value("TI"))
                .andExpect(jsonPath("$[1].nameArea").value("RH"));
    }

    @Test
    void testGetAreaById_Found() throws Exception {
        area area1 = area.builder().id(1).nameArea("TI").description("Tecnología").build();
        when(areaService.findById(1)).thenReturn(Optional.of(area1));

        mockMvc.perform(get("/api/v1/area/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nameArea").value("TI"));
    }

    @Test
    void testGetAreaById_NotFound() throws Exception {
        when(areaService.findById(99)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/area/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Área no encontrada")); // 👈 ahora "message"
    }

    @Test
    void testSaveArea() throws Exception {
        areaDTO dto = new areaDTO(1, "TI", "Tecnología");
        ResponseDTO<areaDTO> response = new ResponseDTO<>("Área guardada correctamente", "200", dto);

        when(areaService.save(any(areaDTO.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/area/")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Área guardada correctamente")); // 👈 ahora "message"
    }

    @Test
    void testDeleteArea() throws Exception {
        ResponseDTO<Object> response = new ResponseDTO<>("Área eliminada correctamente", "200", null);
        when(areaService.delete(1)).thenReturn((ResponseDTO) response);

        mockMvc.perform(delete("/api/v1/area/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Área eliminada correctamente")); // 👈 ahora "message"
    }
}
