package com.Brisas.Las_Brisas.user;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.user.user_rolDTO;
import com.brisas.las_brisas.controller.user.UserRolController;
import com.brisas.las_brisas.model.user.rol;
import com.brisas.las_brisas.model.user.user;
import com.brisas.las_brisas.model.user.user_rol;
import com.brisas.las_brisas.security.JwtService;
import com.brisas.las_brisas.service.user.UserRolService;
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

@WebMvcTest(UserRolController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
@ImportAutoConfiguration(exclude = JwtService.class)
class UserRolControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserRolService userRolService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private com.brisas.las_brisas.auth.service.CustomUserDetailsService customUserDetailsService;

    @Test
    void getAllUserRoles_ShouldReturnListOfUserRoles() throws Exception {
        user user1 = user.builder().idUser(1).username("admin").build();
        user user2 = user.builder().idUser(2).username("empleado").build();

        rol rol1 = rol.builder().id(1).name("ADMIN").build();
        rol rol2 = rol.builder().id(2).name("EMPLEADO").build();

        List<user_rol> list = List.of(
                user_rol.builder().id(1).user(user1).rol(rol1).build(),
                user_rol.builder().id(2).user(user2).rol(rol2).build());

        Mockito.when(userRolService.getAllUserRoles()).thenReturn(list);

        mockMvc.perform(get("/api/v1/user-role/")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].user.username").value("admin"))
                .andExpect(jsonPath("$[1].rol.name").value("EMPLEADO"));
    }

    @Test
    void getUserRolById_ShouldReturnUserRol_WhenFound() throws Exception {
        user userEntity = user.builder().idUser(5).username("carol").build();
        rol rolEntity = rol.builder().id(2).name("EMPLEADO").build();

        user_rol entity = user_rol.builder()
                .id(3)
                .user(userEntity)
                .rol(rolEntity)
                .build();

        Mockito.when(userRolService.findById(3)).thenReturn(Optional.of(entity));

        mockMvc.perform(get("/api/v1/user-role/3")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.username").value("carol"))
                .andExpect(jsonPath("$.rol.name").value("EMPLEADO"));
    }

    @Test
    void createUserRol_ShouldReturnSuccessResponse() throws Exception {
        user_rolDTO dto = user_rolDTO.builder()
                .id(4)
                .idUser(2)
                .idRol(3)
                .build();

        ResponseDTO<user_rolDTO> response = new ResponseDTO<>(
                "Relación creada correctamente",
                HttpStatus.OK.toString(),
                dto);

        Mockito.when(userRolService.save(any(user_rolDTO.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/user-role/")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                            "id": 4,
                            "idUser": 2,
                            "idRol": 3
                        }
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Relación creada correctamente"));
    }

    @Test
    void deleteUserRol_ShouldReturnSuccessResponse() throws Exception {
        ResponseDTO<user_rolDTO> response = new ResponseDTO<>(
                "Relación eliminada correctamente",
                HttpStatus.OK.toString(),
                null);

        Mockito.<ResponseDTO<user_rolDTO>>when(userRolService.deleteUserRol(eq(2))).thenReturn(response);

        mockMvc.perform(delete("/api/v1/user-role/2")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Relación eliminada correctamente"));
    }

    @Test
    void assignRoleToUser_ShouldReturnSuccessResponse() throws Exception {
        user_rolDTO dto = user_rolDTO.builder()
                .id(10)
                .idUser(5)
                .idRol(1)
                .build();

        ResponseDTO<user_rolDTO> response = new ResponseDTO<>(
                "Rol asignado correctamente",
                HttpStatus.OK.toString(),
                dto);

        Mockito.when(userRolService.assignRoleToUser(5, 1)).thenReturn(response);

        mockMvc.perform(post("/api/v1/user-role/assign/5/1")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Rol asignado correctamente"));
    }

    @Test
    void removeRoleFromUser_ShouldReturnSuccessResponse() throws Exception {
        ResponseDTO<user_rolDTO> response = new ResponseDTO<>(
                "Rol removido correctamente",
                HttpStatus.OK.toString(),
                null);

        Mockito.when(userRolService.removeRoleFromUser(5, 2)).thenReturn(response);

        mockMvc.perform(delete("/api/v1/user-role/remove/5/2")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Rol removido correctamente"));
    }
}
