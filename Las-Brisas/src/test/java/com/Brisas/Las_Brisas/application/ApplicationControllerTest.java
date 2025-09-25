package com.brisas.las_brisas.application;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.application.applicationDTO;
import com.brisas.las_brisas.controller.application.ApplicationController;
import com.brisas.las_brisas.model.application.application;
import com.brisas.las_brisas.service.application.ApplicationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ApplicationController.class)
@AutoConfigureMockMvc(addFilters = false) // Desactiva filtros de seguridad en los tests
class ApplicationControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @MockBean
        private ApplicationService applicationService;

        @MockBean
        private com.brisas.las_brisas.security.JwtAuthFilter jwtAuthFilter;

        @MockBean
        private com.brisas.las_brisas.security.JwtService jwtService;

        @Autowired
        private ObjectMapper objectMapper;

        // // Crear solicitud
        // @Test
        // void testCreateApplication() throws Exception {
        //         User principal = new User("empleado@test.com", "password", List.of());
        //         UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(principal,
        //                         "password", principal.getAuthorities());

        //         applicationDTO dto = new applicationDTO();
        //         ResponseDTO<applicationDTO> response = new ResponseDTO<>("Solicitud creada", "200", dto);

        //         Mockito.when(applicationService.create(any(applicationDTO.class), eq("empleado@test.com")))
        //                         .thenReturn(response);

        //         mockMvc.perform(post("/api/v1/applications/")
        //                         .with(authentication(auth)) // ✅ pasa Authentication
        //                         .contentType(MediaType.APPLICATION_JSON)
        //                         .content(objectMapper.writeValueAsString(dto)))
        //                         .andExpect(status().isOk())
        //                         .andExpect(jsonPath("$.message").value("Solicitud creada"));
        // }

        // // Obtener mis solicitudes

        // @Test
        // void testGetMyApplications() throws Exception {
        //         User principal = new User("empleado@test.com", "password", List.of());
        //         UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(principal,
        //                         "password", principal.getAuthorities());

        //         application app1 = application.builder().id(1).reason("Vacaciones").build();
        //         application app2 = application.builder().id(2).reason("Permiso").build();

        //         Mockito.when(applicationService.findByUserEmail("empleado@test.com"))
        //                         .thenReturn(List.of(app1, app2));

        //         mockMvc.perform(get("/api/v1/applications/me")
        //                         .with(authentication(auth))) // ✅ fuerza el Authentication en la request
        //                         .andExpect(status().isOk())
        //                         .andExpect(jsonPath("$[0].reason").value("Vacaciones"))
        //                         .andExpect(jsonPath("$[1].reason").value("Permiso"));
        // }

        // Obtener todas las solicitudes (admin)
        @Test
        @WithMockUser(roles = "ADMIN")
        void testGetAllApplications() throws Exception {
                application app1 = application.builder().id(1).reason("Viaje").build();
                application app2 = application.builder().id(2).reason("Incapacidad").build();

                Mockito.when(applicationService.getAll())
                                .thenReturn(List.of(app1, app2));

                mockMvc.perform(get("/api/v1/applications/all"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$[0].reason").value("Viaje"))
                                .andExpect(jsonPath("$[1].reason").value("Incapacidad"));
        }

        // Aprobar solicitud
        @Test
        @WithMockUser(roles = "ADMIN")
        void testApproveApplication() throws Exception {
                ResponseDTO<Object> response = new ResponseDTO<>("Solicitud aprobada", "200", null);

                Mockito.when(applicationService.approve(1, true))
                                .thenReturn(response);

                mockMvc.perform(put("/api/v1/applications/1/approve")
                                .param("approved", "true"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.message").value("Solicitud aprobada"));
        }
}
