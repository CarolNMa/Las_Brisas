package com.brisas.Las_Brisas.position;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.position.employee_postDTO;
import com.brisas.las_brisas.controller.position.EmployeePostController;
import com.brisas.las_brisas.model.employee.employee;
import com.brisas.las_brisas.model.position.EmployeePost;
import com.brisas.las_brisas.model.position.positions;
import com.brisas.las_brisas.service.position.EmployeePostService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EmployeePostController.class)
@AutoConfigureMockMvc(addFilters = false)
class EmployeePostControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private EmployeePostService employeePostService;
    @MockBean
    private com.brisas.las_brisas.security.JwtAuthFilter jwtAuthFilter;
    @MockBean
    private com.brisas.las_brisas.auth.service.CustomUserDetailsService customUserDetailsService;

    @Test
    void testGetAllEmployeePosts() throws Exception {
        employee emp = new employee();
        emp.setId(1);

        positions pos = new positions();
        pos.setId(1);
        pos.setNamePost("Gerente");

        EmployeePost ep = EmployeePost.builder()
                .id(1)
                .employee(emp)
                .post(pos)
                .build();

        when(employeePostService.getAll()).thenReturn(List.of(ep));

        mockMvc.perform(get("/api/v1/employee-post/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));
    }

    @Test
    void testGetEmployeePostById_Found() throws Exception {
        employee emp = new employee();
        emp.setId(1);

        positions pos = new positions();
        pos.setId(2);
        pos.setNamePost("Supervisor");

        EmployeePost ep = EmployeePost.builder()
                .id(2)
                .employee(emp)
                .post(pos)
                .build();

        when(employeePostService.findById(2)).thenReturn(Optional.of(ep));

        mockMvc.perform(get("/api/v1/employee-post/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2));
    }

    @Test
    void testGetEmployeePostById_NotFound() throws Exception {
        when(employeePostService.findById(99)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/employee-post/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Relación no encontrada"));
    }

    @Test
    void testSaveEmployeePost() throws Exception {
        employee_postDTO dto = employee_postDTO.builder()
                .id(1)
                .employeeId(1)
                .postId(1)
                .build();

        ResponseDTO<employee_postDTO> response = new ResponseDTO<>("Guardado correctamente", "200", dto);

        when(employeePostService.save(any(employee_postDTO.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/employee-post/")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Guardado correctamente"));
    }

    @Test
    void testDeleteEmployeePost() throws Exception {
        ResponseDTO<Object> response = new ResponseDTO<>("Eliminado correctamente", "200", null);

        when(employeePostService.delete(1)).thenReturn((ResponseDTO) response);

        mockMvc.perform(delete("/api/v1/employee-post/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Eliminado correctamente"));
    }
}
