package com.Brisas.Las_Brisas.application;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.application.applicationDTO;
import com.brisas.las_brisas.controller.application.ApplicationController;
import com.brisas.las_brisas.model.application.application;
import com.brisas.las_brisas.security.JwtService;
import com.brisas.las_brisas.service.application.ApplicationService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = ApplicationController.class)
@AutoConfigureMockMvc(addFilters = false)
@ImportAutoConfiguration(exclude = {
        SecurityAutoConfiguration.class,
        SecurityFilterAutoConfiguration.class
})
@ActiveProfiles("test")
public class ApplicationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ApplicationService applicationService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private com.brisas.las_brisas.auth.service.CustomUserDetailsService customUserDetailsService;

    @Test
    void getAll_ShouldReturnListOfApplications() throws Exception {
        List<application> mockList = List.of(
                application.builder().id(1).reason("Vacaciones").build(),
                application.builder().id(2).reason("Permiso personal").build());

        Mockito.when(applicationService.getAll()).thenReturn(mockList);
        Mockito.when(applicationService.convertToDTO(any())).thenAnswer(i -> {
            application app = i.getArgument(0);
            return applicationDTO.builder()
                    .id(app.getId())
                    .reason(app.getReason())
                    .build();
        });

        mockMvc.perform(get("/api/v1/applications/all")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].reason").value("Vacaciones"))
                .andExpect(jsonPath("$[1].reason").value("Permiso personal"));
    }

    @Test
    void getById_ShouldReturnApplication_WhenFound() throws Exception {
        application entity = application.builder()
                .id(1)
                .reason("Vacaciones")
                .build();

        applicationDTO dto = applicationDTO.builder()
                .id(1)
                .reason("Vacaciones")
                .build();

        Mockito.when(applicationService.findById(1)).thenReturn(Optional.of(entity));
        Mockito.when(applicationService.convertToDTO(any())).thenReturn(dto);

        mockMvc.perform(get("/api/v1/applications/1")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reason").value("Vacaciones"));
    }

    @Test
    void getById_ShouldReturnNotFound_WhenNotExists() throws Exception {
        Mockito.when(applicationService.findById(99)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/applications/99")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void create_ShouldReturnSuccessResponse_WhenFileUploaded() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file", "document.pdf", "application/pdf", "contenido".getBytes(StandardCharsets.UTF_8));

        applicationDTO dto = applicationDTO.builder()
                .id(3)
                .reason("Incapacidad médica")
                .applicationTypeid(1)
                .documentUrl("document.pdf")
                .build();

        ResponseDTO<applicationDTO> mockResponse = new ResponseDTO<>(
                "Solicitud creada correctamente",
                "200",
                dto);

        Mockito.when(applicationService.create(any(), any())).thenReturn(mockResponse);

        mockMvc.perform(multipart("/api/v1/applications/")
                .file(file)
                .param("applicationTypeid", "1")
                .param("reason", "Incapacidad médica")
                .param("dateStart", "2025-10-04T00:00:00")
                .param("dateEnd", "2025-10-06T00:00:00")
                .principal(new UsernamePasswordAuthenticationToken("empleado", "password")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Solicitud creada correctamente"))
                .andExpect(jsonPath("$.data.reason").value("Incapacidad médica"));
    }

    @Test
    void delete_ShouldReturnSuccessResponse() throws Exception {
        ResponseDTO<applicationDTO> mockResponse = new ResponseDTO<>(
                "Solicitud eliminada correctamente",
                String.valueOf(200),
                null);

        Mockito.when(applicationService.delete(eq(1))).thenReturn(mockResponse);

        mockMvc.perform(delete("/api/v1/applications/1")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Solicitud eliminada correctamente"));
    }

    @Test
    void approve_ShouldReturnSuccessResponse() throws Exception {
        ResponseDTO<Object> mockResponse = new ResponseDTO<>(
                "Solicitud aprobada",
                String.valueOf(200),
                null);

        Mockito.when(applicationService.approve(eq(1), eq(true))).thenReturn(mockResponse);

        mockMvc.perform(put("/api/v1/applications/1/approve")
                .param("approved", "true")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Solicitud aprobada"));
    }

}