package com.Brisas.Las_Brisas.area;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.area.areaDTO;
import com.brisas.las_brisas.controller.area.AreaController;
import com.brisas.las_brisas.model.area.area;
import com.brisas.las_brisas.security.JwtService;
import com.brisas.las_brisas.service.area.AreaService;
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

@WebMvcTest(controllers = AreaController.class)
@AutoConfigureMockMvc(addFilters = false)
@ImportAutoConfiguration(exclude = {
        SecurityAutoConfiguration.class,
        SecurityFilterAutoConfiguration.class
})
@ActiveProfiles("test")
public class AreaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AreaService areaService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private com.brisas.las_brisas.auth.service.CustomUserDetailsService customUserDetailsService;

    @Test
    void getAll_ShouldReturnListOfAreas() throws Exception {
        List<area> mockList = List.of(
                area.builder().id(1).nameArea("Producción").description("Área encargada de la elaboración de productos")
                        .build(),
                area.builder().id(2).nameArea("Ventas").description("Área que gestiona los clientes y ventas").build());

        Mockito.when(areaService.getAll()).thenReturn(mockList);

        mockMvc.perform(get("/api/v1/areas/all")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nameArea").value("Producción"))
                .andExpect(jsonPath("$[1].nameArea").value("Ventas"));
    }

    @Test
    void getById_ShouldReturnArea_WhenFound() throws Exception {
        area entity = area.builder()
                .id(1)
                .nameArea("Producción")
                .description("Área encargada de la elaboración de productos")
                .build();

        Mockito.when(areaService.findById(1)).thenReturn(Optional.of(entity));

        mockMvc.perform(get("/api/v1/areas/1")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nameArea").value("Producción"));
    }

    @Test
    void getById_ShouldReturnNotFound_WhenNotExists() throws Exception {
        Mockito.when(areaService.findById(99)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/areas/99")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Área no encontrada"));
    }

    @Test
    void save_ShouldReturnSuccessResponse() throws Exception {
        areaDTO dto = new areaDTO(1, "Contabilidad", "Maneja las finanzas");

        ResponseDTO<areaDTO> mockResponse = new ResponseDTO<>(
                "Área guardada correctamente",
                HttpStatus.OK.toString(),
                dto);

        Mockito.when(areaService.save(any(areaDTO.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/v1/areas/")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                            "name": "Contabilidad",
                            "description": "Maneja las finanzas"
                        }
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Área guardada correctamente"))
                .andExpect(jsonPath("$.data.name").value("Contabilidad"));
    }

    @Test
    void delete_ShouldReturnSuccessResponse() throws Exception {
        ResponseDTO<areaDTO> mockResponse = new ResponseDTO<>(
                "Área eliminada correctamente",
                HttpStatus.OK.toString(),
                null);

        Mockito.when(areaService.delete(eq(1))).thenReturn(mockResponse);

        mockMvc.perform(delete("/api/v1/areas/1")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Área eliminada correctamente"));
    }

}
