package com.Brisas.Las_Brisas.position;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.position.employee_postDTO;
import com.brisas.las_brisas.DTO.position.employee_postDetailDTO;
import com.brisas.las_brisas.controller.position.EmployeePostController;
import com.brisas.las_brisas.model.employee.employee;
import com.brisas.las_brisas.model.position.EmployeePost;
import com.brisas.las_brisas.model.position.positions;
import com.brisas.las_brisas.security.JwtService;
import com.brisas.las_brisas.service.position.EmployeePostService;
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

@WebMvcTest(controllers = EmployeePostController.class)
@AutoConfigureMockMvc(addFilters = false)
@ImportAutoConfiguration(exclude = {
        SecurityAutoConfiguration.class,
        SecurityFilterAutoConfiguration.class
})
@ActiveProfiles("test")
public class EmployeePostControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EmployeePostService employeePostService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private com.brisas.las_brisas.auth.service.CustomUserDetailsService customUserDetailsService;

    @Test
    void getAllDetails_ShouldReturnListOfEmployeePosts() throws Exception {
        List<employee_postDetailDTO> mockList = List.of(
                new employee_postDetailDTO(1, 1, "Ana Torres", 2, "Asistente de Nómina"),
                new employee_postDetailDTO(2, 2, "Carlos Pérez", 3, "Jefe de Planta"));

        Mockito.when(employeePostService.getAllDetails()).thenReturn(mockList);

        mockMvc.perform(get("/api/v1/employee-post")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].employeeName").value("Ana Torres"))
                .andExpect(jsonPath("$[1].postName").value("Jefe de Planta"));
    }

    @Test
    void getById_ShouldReturnEmployeePost_WhenFound() throws Exception {
        employee mockEmployee = employee.builder()
                .id(1)
                .firstName("Ana")
                .lastName("Torres")
                .build();

        positions mockPosition = positions.builder()
                .id(2)
                .namePost("Asistente de Nómina")
                .build();

        EmployeePost entity = EmployeePost.builder()
                .id(1)
                .employee(mockEmployee)
                .post(mockPosition)
                .build();

        Mockito.when(employeePostService.findById(1)).thenReturn(Optional.of(entity));

        mockMvc.perform(get("/api/v1/employee-post/1")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void getById_ShouldReturnNotFound_WhenNotExists() throws Exception {
        Mockito.when(employeePostService.findById(99)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/employee-post/99")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Relación no encontrada"));
    }


    @Test
    void delete_ShouldReturnSuccessResponse() throws Exception {
        ResponseDTO<employee_postDTO> mockResponse = new ResponseDTO<>(
                "Relación eliminada correctamente",
                "200",
                null);

        Mockito.when(employeePostService.delete(eq(1))).thenReturn(mockResponse);

        mockMvc.perform(delete("/api/v1/employee-post/1")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Relación eliminada correctamente"));
    }
}
