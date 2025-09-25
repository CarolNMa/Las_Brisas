package com.brisas.las_brisas.application;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.application.application_typeDTO;
import com.brisas.las_brisas.controller.application.ApplicationTypeController;
import com.brisas.las_brisas.model.application.application_type;
import com.brisas.las_brisas.security.JwtAuthFilter;
import com.brisas.las_brisas.security.JwtService;
import com.brisas.las_brisas.service.application.ApplicationTypeService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ApplicationTypeController.class)
@AutoConfigureMockMvc(addFilters = false) 
class ApplicationTypeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ApplicationTypeService applicationTypeService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private JwtAuthFilter jwtAuthFilter;

    @Autowired
    private ObjectMapper objectMapper;

    // GET all
    @Test
    void shouldReturnAllApplicationTypes() throws Exception {
        application_type type1 = new application_type();
        type1.setId(1);
        type1.setName("Vacaciones");

        application_type type2 = new application_type();
        type2.setId(2);
        type2.setName("Permiso");

        Mockito.when(applicationTypeService.getAll())
                .thenReturn(List.of(type1, type2));

        mockMvc.perform(get("/api/v1/application-type/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Vacaciones"))
                .andExpect(jsonPath("$[1].name").value("Permiso"));
    }

    // GET by ID (found)
    @Test
    void shouldReturnApplicationTypeById() throws Exception {
        application_type type = new application_type();
        type.setId(1);
        type.setName("Vacaciones");

        Mockito.when(applicationTypeService.findById(1))
                .thenReturn(Optional.of(type));

        mockMvc.perform(get("/api/v1/application-type/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Vacaciones"));
    }

    // GET by ID (not found)
    @Test
    void shouldReturnNotFoundWhenApplicationTypeDoesNotExist() throws Exception {
        Mockito.when(applicationTypeService.findById(99))
                .thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/application-type/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Tipo de solicitud no encontrado"));
    }

    // DELETE
    @Test
    void shouldDeleteApplicationType() throws Exception {
        ResponseDTO<?> response = new ResponseDTO<>("Eliminado", "200", null);

        Mockito.when(applicationTypeService.delete(1))
                .thenReturn((ResponseDTO) response);

        mockMvc.perform(delete("/api/v1/application-type/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Eliminado")); 
    }

    // POST save
    @Test
    void shouldSaveApplicationType() throws Exception {
        application_typeDTO dto = new application_typeDTO();
        ResponseDTO<?> response = new ResponseDTO<>("Guardado", "200", null);

        Mockito.when(applicationTypeService.save(any(application_typeDTO.class)))
                .thenReturn((ResponseDTO) response);

        mockMvc.perform(post("/api/v1/application-type/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Guardado")); 
    }
}
