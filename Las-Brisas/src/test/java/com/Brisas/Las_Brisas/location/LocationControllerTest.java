package com.Brisas.Las_Brisas.location;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.location.locationDTO;
import com.brisas.las_brisas.controller.location.LocationController;
import com.brisas.las_brisas.model.location.location;
import com.brisas.las_brisas.security.JwtService;
import com.brisas.las_brisas.service.location.LocationService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = LocationController.class)
@AutoConfigureMockMvc(addFilters = false)
@ImportAutoConfiguration(exclude = {
        SecurityAutoConfiguration.class,
        SecurityFilterAutoConfiguration.class
})
@ActiveProfiles("test")
public class LocationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private LocationService locationService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private com.brisas.las_brisas.auth.service.CustomUserDetailsService customUserDetailsService;

    @Test
    void getAll_ShouldReturnListOfLocations() throws Exception {
        List<location> mockList = List.of(
                location.builder().id(1).nameLocation("Planta Principal").address("Calle 10 #25-36").build(),
                location.builder().id(2).nameLocation("Bodega Norte").address("Carrera 5 #44-12").build());

        Mockito.when(locationService.getAll()).thenReturn(mockList);

        mockMvc.perform(get("/api/v1/location/all")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nameLocation").value("Planta Principal"))
                .andExpect(jsonPath("$[1].nameLocation").value("Bodega Norte"));
    }

    @Test
    void getById_ShouldReturnLocation_WhenFound() throws Exception {
        location entity = location.builder()
                .id(1)
                .nameLocation("Planta Principal")
                .address("Calle 10 #25-36")
                .build();

        Mockito.when(locationService.findById(1)).thenReturn(Optional.of(entity));

        mockMvc.perform(get("/api/v1/location/1")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nameLocation").value("Planta Principal"));
    }

    @Test
    void getById_ShouldReturnNotFound_WhenNotExists() throws Exception {
        Mockito.when(locationService.findById(99)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/location/99")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Ubicación no encontrada"));
    }

    @Test
    void save_ShouldReturnSuccessResponse() throws Exception {
        locationDTO dto = new locationDTO(1, "Sucursal Centro", "Carrera 45 #22-18");

        ResponseDTO<locationDTO> mockResponse = new ResponseDTO<>(
                "Ubicación guardada correctamente",
                HttpStatus.OK.toString(),
                dto);

        Mockito.when(locationService.save(any(locationDTO.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/v1/location/")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                            "nameLocation": "Sucursal Centro",
                            "address": "Carrera 45 #22-18"
                        }
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Ubicación guardada correctamente"))
                .andExpect(jsonPath("$.data.nameLocation").value("Sucursal Centro"));
    }

    @Test
    void delete_ShouldReturnSuccessResponse() throws Exception {
        ResponseDTO<locationDTO> mockResponse = new ResponseDTO<>(
                "Ubicación eliminada correctamente",
                "200",
                null);

        Mockito.when(locationService.delete(eq(1))).thenReturn(mockResponse);

        mockMvc.perform(delete("/api/v1/location/1")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Ubicación eliminada correctamente"));
    }
}