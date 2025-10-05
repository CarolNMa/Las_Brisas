package com.Brisas.Las_Brisas.user;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.user.rolDTO;
import com.brisas.las_brisas.controller.user.RolController;
import com.brisas.las_brisas.model.user.rol;
import com.brisas.las_brisas.security.JwtService;
import com.brisas.las_brisas.service.user.RolService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
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

@WebMvcTest(RolController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
@ImportAutoConfiguration(exclude = JwtService.class)
class RolControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RolService rolService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private com.brisas.las_brisas.auth.service.CustomUserDetailsService customUserDetailsService;

    @Test
    void getAllRoles_ShouldReturnListOfRoles() throws Exception {
        List<rol> roles = List.of(
                rol.builder().id(1).name("ADMIN").description("Administrador del sistema").build(),
                rol.builder().id(2).name("EMPLEADO").description("Usuario general del sistema").build());

        Mockito.when(rolService.getAllRoles()).thenReturn(roles);

        mockMvc.perform(get("/api/v1/role/all")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("ADMIN"))
                .andExpect(jsonPath("$[1].name").value("EMPLEADO"));
    }

    @Test
    void getRoleById_ShouldReturnRole_WhenFound() throws Exception {
        rol entity = rol.builder()
                .id(1)
                .name("ADMIN")
                .description("Administrador del sistema")
                .build();

        Mockito.when(rolService.findById(1)).thenReturn(Optional.of(entity));

        mockMvc.perform(get("/api/v1/role/1")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("ADMIN"));
    }

    @Test
    void createRole_ShouldReturnSuccessResponse() throws Exception {
        rolDTO dto = rolDTO.builder()
                .id(3)
                .name("SUPERVISOR")
                .description(null)
                .build();

        ResponseDTO<rolDTO> response = new ResponseDTO<>(
                "Rol creado correctamente",
                HttpStatus.OK.toString(),
                dto);

        Mockito.when(rolService.save(any(rolDTO.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/role/")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                            "id": 3,
                            "name": "SUPERVISOR"
                        }
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Rol creado correctamente"));
    }

    @Test
    void deleteRole_ShouldReturnSuccessResponse() throws Exception {
        ResponseDTO<rolDTO> response = new ResponseDTO<>(
                "Rol eliminado correctamente", HttpStatus.OK.toString(), null);

        Mockito.<ResponseDTO<rolDTO>>when(rolService.deleteRole(eq(2))).thenReturn(response);

        mockMvc.perform(delete("/api/v1/role/2")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Rol eliminado correctamente"));
    }
}
