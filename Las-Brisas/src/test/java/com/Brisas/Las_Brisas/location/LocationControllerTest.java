package com.brisas.las_brisas.location;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.location.locationDTO;
import com.brisas.las_brisas.controller.location.LocationController;
import com.brisas.las_brisas.model.location.location;
import com.brisas.las_brisas.service.location.LocationService;
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

@WebMvcTest(LocationController.class)
@AutoConfigureMockMvc(addFilters = false)
class LocationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private LocationService locationService;

    @MockBean
    private com.brisas.las_brisas.security.JwtAuthFilter jwtAuthFilter;
    @MockBean
    private com.brisas.las_brisas.auth.service.CustomUserDetailsService customUserDetailsService;

    @Test
    void testGetAllLocations() throws Exception {
        location l1 = location.builder().id(1).nameLocation("Bogotá").address("Calle 123").build();
        location l2 = location.builder().id(2).nameLocation("Medellín").address("Carrera 45").build();

        when(locationService.getAll()).thenReturn(List.of(l1, l2));

        mockMvc.perform(get("/api/v1/location/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nameLocation").value("Bogotá"))
                .andExpect(jsonPath("$[1].nameLocation").value("Medellín"));
    }

    @Test
    void testGetLocationById_Found() throws Exception {
        location l1 = location.builder().id(1).nameLocation("Bogotá").address("Calle 123").build();

        when(locationService.findById(1)).thenReturn(Optional.of(l1));

        mockMvc.perform(get("/api/v1/location/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nameLocation").value("Bogotá"));
    }

    @Test
    void testGetLocationById_NotFound() throws Exception {
        when(locationService.findById(99)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/location/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Ubicación no encontrada"));
    }

    @Test
    void testSaveLocation() throws Exception {
        locationDTO dto = locationDTO.builder()
                .id(1)
                .nameLocation("Cali")
                .address("Av Siempre Viva 742")
                .build();

        ResponseDTO<locationDTO> response =
                new ResponseDTO<>("Guardado correctamente", "200", dto);

        when(locationService.save(any(locationDTO.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/location/")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Guardado correctamente"));
    }

    @Test
    void testDeleteLocation() throws Exception {
        ResponseDTO<Object> response =
                new ResponseDTO<>("Eliminado correctamente", "200", null);

        when(locationService.delete(1)).thenReturn((ResponseDTO) response);

        mockMvc.perform(delete("/api/v1/location/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Eliminado correctamente"));
    }
}
