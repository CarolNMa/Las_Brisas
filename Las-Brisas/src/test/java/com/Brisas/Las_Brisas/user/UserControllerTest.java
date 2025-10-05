package com.Brisas.Las_Brisas.user;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.user.userDTO;
import com.brisas.las_brisas.controller.user.UserController;
import com.brisas.las_brisas.model.user.user;
import com.brisas.las_brisas.security.JwtService;
import com.brisas.las_brisas.service.user.userService;
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
import org.springframework.security.core.Authentication;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
@ImportAutoConfiguration(exclude = JwtService.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private userService userService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private com.brisas.las_brisas.auth.service.CustomUserDetailsService customUserDetailsService;

    @Test
    void getAllUsers_ShouldReturnListOfUsers() throws Exception {
        List<user> users = List.of(
                user.builder().idUser(1).username("admin").email("admin@lasbrisas.com").build(),
                user.builder().idUser(2).username("empleado").email("empleado@lasbrisas.com").build());

        Mockito.when(userService.getAllUsers()).thenReturn(users);

        mockMvc.perform(get("/api/v1/user/all")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].username").value("admin"))
                .andExpect(jsonPath("$[1].username").value("empleado"));
    }

    @Test
    void getMyProfile_ShouldReturnUser_WhenExists() throws Exception {
        user u = user.builder()
                .idUser(1)
                .username("carol")
                .email("carol@lasbrisas.com")
                .build();

        Mockito.when(userService.findByEmail("carol@lasbrisas.com"))
                .thenReturn(Optional.of(u));

        Authentication auth = new UsernamePasswordAuthenticationToken("carol@lasbrisas.com", "password");

        mockMvc.perform(get("/api/v1/user/me")
                .principal(auth)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("carol"))
                .andExpect(jsonPath("$.email").value("carol@lasbrisas.com"));
    }

    @Test
    void getMyProfile_ShouldReturnNotFound_WhenUserMissing() throws Exception {
        Mockito.when(userService.findByEmail("missing@lasbrisas.com")).thenReturn(Optional.empty());

        Authentication auth = new UsernamePasswordAuthenticationToken("missing@lasbrisas.com", "password");

        mockMvc.perform(get("/api/v1/user/me")
                .principal(auth)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Usuario no encontrado"));
    }

    @Test
    void createUser_ShouldReturnSuccessResponse() throws Exception {
        userDTO dto = userDTO.builder()
                .idUser(3)
                .username("nuevo")
                .email("nuevo@lasbrisas.com")
                .build();

        ResponseDTO<userDTO> response = new ResponseDTO<>(
                "Usuario creado correctamente",
                HttpStatus.OK.toString(),
                dto);

        Mockito.when(userService.save(any(userDTO.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/user/")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                            "id": 3,
                            "username": "nuevo",
                            "email": "nuevo@lasbrisas.com",
                            "rol": "EMPLEADO"
                        }
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Usuario creado correctamente"));
    }

    @Test
    void deleteUser_ShouldReturnSuccessResponse() throws Exception {
        ResponseDTO<userDTO> response = new ResponseDTO<>(
                "Usuario eliminado correctamente",
                HttpStatus.OK.toString(),
                null);

        Mockito.<ResponseDTO<userDTO>>when(userService.deleteUser(eq(2))).thenReturn(response);

        mockMvc.perform(delete("/api/v1/user/2")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Usuario eliminado correctamente"));
    }
}