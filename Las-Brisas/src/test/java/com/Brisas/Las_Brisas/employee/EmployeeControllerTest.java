package com.brisas.Las_Brisas.employee;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.employee.employeeDTO;
import com.brisas.las_brisas.controller.employee.EmployeeController;
import com.brisas.las_brisas.model.employee.employee;
import com.brisas.las_brisas.service.employee.employeeService;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EmployeeController.class)
@AutoConfigureMockMvc(addFilters = false) 
class EmployeeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private employeeService employeeService;

    // mocks de seguridad
    @MockBean
    private com.brisas.las_brisas.security.JwtAuthFilter jwtAuthFilter;
    @MockBean
    private com.brisas.las_brisas.security.JwtService jwtService;
    @MockBean
    private com.brisas.las_brisas.auth.service.CustomUserDetailsService customUserDetailsService;

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetAllEmployees() throws Exception {
        employee e1 = new employee();
        e1.setId(1);
        e1.setFirstName("Carlos");

        employee e2 = new employee();
        e2.setId(2);
        e2.setFirstName("Ana");

        when(employeeService.getAllEmployees()).thenReturn(List.of(e1, e2));

        mockMvc.perform(get("/api/v1/employees/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].firstName").value("Carlos"))
                .andExpect(jsonPath("$[1].firstName").value("Ana"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetEmployeeById_Found() throws Exception {
        employee e1 = new employee();
        e1.setId(1);
        e1.setFirstName("Carlos");

        when(employeeService.findById(1)).thenReturn(Optional.of(e1));

        mockMvc.perform(get("/api/v1/employees/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("Carlos"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetEmployeeById_NotFound() throws Exception {
        when(employeeService.findById(99)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/employees/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Empleado no encontrado"));
    }

    // @Test
    // @WithMockUser(roles = "EMPLEADO", username = "empleado@test.com")
    // void testGetMyProfile_Found() throws Exception {
    //     employee e1 = new employee();
    //     e1.setId(1);
    //     e1.setEmail("empleado@test.com");
    //     e1.setFirstName("Empleado");

    //     when(employeeService.findByEmail("empleado@test.com")).thenReturn(Optional.of(e1));

    //     mockMvc.perform(get("/api/v1/employees/me"))
    //             .andExpect(status().isOk())
    //             .andExpect(jsonPath("$.firstname").value("Empleado"));
    // }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testCreateEmployee() throws Exception {
        employeeDTO dto = employeeDTO.builder()
                .id(1)
                .firstName("Juan")
                .email("juan@test.com")
                .build();

        ResponseDTO<employeeDTO> response = new ResponseDTO<>("Empleado creado", "200", dto);

        when(employeeService.save(any(employeeDTO.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Empleado creado"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testDeleteEmployee() throws Exception {
        mockMvc.perform(delete("/api/v1/employees/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Empleado eliminado"));
    }
}
