package com.Brisas.Las_Brisas.application;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.application.application_typeDTO;
import com.brisas.las_brisas.controller.application.ApplicationTypeController;
import com.brisas.las_brisas.model.application.application_type;
import com.brisas.las_brisas.security.JwtService;
import com.brisas.las_brisas.service.application.ApplicationTypeService;
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

@WebMvcTest(controllers = ApplicationTypeController.class)
@AutoConfigureMockMvc(addFilters = false)
@ImportAutoConfiguration(exclude = {
        SecurityAutoConfiguration.class,
        SecurityFilterAutoConfiguration.class
})
@ActiveProfiles("test")
public class ApplicationTypeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ApplicationTypeService applicationTypeService;

    @MockBean
    private JwtService jwtService;

    // si quieres prevenir aún más el error:
    @MockBean
    private com.brisas.las_brisas.auth.service.CustomUserDetailsService customUserDetailsService;

    @Test
    void getAll_ShouldReturnListOfApplicationTypes() throws Exception {
        List<application_type> mockList = List.of(
                application_type.builder()
                        .id(1)
                        .name("Permiso")
                        .build(),
                application_type.builder()
                        .id(2)
                        .name("Incapacidad")
                        .build());

        Mockito.when(applicationTypeService.getAll()).thenReturn(mockList);

        mockMvc.perform(get("/api/v1/application-type/all")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Permiso"))
                .andExpect(jsonPath("$[1].name").value("Incapacidad"));
    }

    @Test
    void getById_ShouldReturnApplicationType_WhenFound() throws Exception {
        application_type type = application_type.builder()
                .id(1)
                .name("Vacaciones")
                .build();

        Mockito.when(applicationTypeService.findById(1))
                .thenReturn(Optional.of(type));

        mockMvc.perform(get("/api/v1/application-type/1")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Vacaciones"));
    }

    @Test
    void getById_ShouldReturnNotFound_WhenNotExists() throws Exception {
        Mockito.when(applicationTypeService.findById(99))
                .thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/application-type/99")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Tipo de solicitud no encontrado"));
    }

    @Test
    void save_ShouldReturnSuccessResponse() throws Exception {
        application_typeDTO dto = application_typeDTO.builder()
                .id(3)
                .name("Horas extra")
                .build();

        ResponseDTO<application_typeDTO> mockResponse = new ResponseDTO<>(
                "Tipo de solicitud guardado exitosamente",
                HttpStatus.OK.toString(),
                dto);

        Mockito.when(applicationTypeService.save(any())).thenReturn(mockResponse);

        String requestBody = """
                {
                    "id": 0,
                    "name": "Horas extra",
                    "description": "Solicitud de horas adicionales"
                }
                """;

        mockMvc.perform(post("/api/v1/application-type/")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Tipo de solicitud guardado exitosamente"))
                .andExpect(jsonPath("$.data.name").value("Horas extra"));
    }

    @Test
    void delete_ShouldReturnSuccessResponse() throws Exception {
        ResponseDTO<application_typeDTO> mockResponse = new ResponseDTO<>(
                "Tipo de solicitud eliminado correctamente",
                HttpStatus.OK.toString(),
                null);

        Mockito.when(applicationTypeService.delete(eq(1)))
                .thenReturn(mockResponse);

        mockMvc.perform(delete("/api/v1/application-type/1")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Tipo de solicitud eliminado correctamente"));
    }

}
