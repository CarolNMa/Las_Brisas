package com.brisas.Las_Brisas.employee;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.employee.employee_areaDTO;
import com.brisas.las_brisas.controller.employee.EmployeeAreaController;
import com.brisas.las_brisas.model.employee.employee_area;
import com.brisas.las_brisas.service.employee.EmployeeAreaService;
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

@WebMvcTest(EmployeeAreaController.class)
@AutoConfigureMockMvc(addFilters = false)
class EmployeeAreaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private EmployeeAreaService employeeAreaService;

    @MockBean
    private com.brisas.las_brisas.security.JwtAuthFilter jwtAuthFilter;
    @MockBean
    private com.brisas.las_brisas.security.JwtService jwtService;
    @MockBean
    private com.brisas.las_brisas.auth.service.CustomUserDetailsService customUserDetailsService;

    @Test
    void testGetAll() throws Exception {
        employee_area ea1 = new employee_area();
        ea1.setId(1);

        employee_area ea2 = new employee_area();
        ea2.setId(2);

        when(employeeAreaService.getAll()).thenReturn(List.of(ea1, ea2));

        mockMvc.perform(get("/api/employee-areas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[1].id").value(2));
    }

    @Test
    void testGetById_Found() throws Exception {
        employee_area ea = new employee_area();
        ea.setId(1);

        when(employeeAreaService.findById(1)).thenReturn(Optional.of(ea));

        mockMvc.perform(get("/api/employee-areas/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void testGetById_NotFound() throws Exception {
        when(employeeAreaService.findById(99)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/employee-areas/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Relación empleado-área no encontrada"));
    }

    @Test
    void testSave() throws Exception {
        employee_areaDTO dto = employee_areaDTO.builder()
                .id(1)
                .employeeId(1)
                .areaId(2)
                .build();

        ResponseDTO<employee_areaDTO> response = new ResponseDTO<>("Guardado correctamente", "200", dto);

        when(employeeAreaService.save(any(employee_areaDTO.class))).thenReturn(response);

        mockMvc.perform(post("/api/employee-areas")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Guardado correctamente"));
    }

    @Test
    void testDelete() throws Exception {
        ResponseDTO<employee_areaDTO> response = new ResponseDTO<>("Eliminado correctamente", "200", null);

        when(employeeAreaService.delete(1)).thenReturn(response);

        mockMvc.perform(delete("/api/employee-areas/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Eliminado correctamente"));
    }
}
