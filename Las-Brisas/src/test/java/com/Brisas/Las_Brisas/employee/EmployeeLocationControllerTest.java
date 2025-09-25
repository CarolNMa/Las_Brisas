package com.brisas.las_brisas.employee;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.employee.emplo_locationDTO;
import com.brisas.las_brisas.controller.employee.EmployeeLocationController;
import com.brisas.las_brisas.model.employee.emplo_location;
import com.brisas.las_brisas.service.employee.EmployeeLocationService;
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

@WebMvcTest(EmployeeLocationController.class)
@AutoConfigureMockMvc(addFilters = false)
class EmployeeLocationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private EmployeeLocationService employeeLocationService;

    @MockBean
    private com.brisas.las_brisas.security.JwtAuthFilter jwtAuthFilter;
    @MockBean
    private com.brisas.las_brisas.security.JwtService jwtService;
    @MockBean
    private com.brisas.las_brisas.auth.service.CustomUserDetailsService customUserDetailsService;

    @Test
    void testGetAll() throws Exception {
        emplo_location relation = new emplo_location();
        relation.setId(1);

        when(employeeLocationService.getAll()).thenReturn(List.of(relation));

        mockMvc.perform(get("/api/employee-locations"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));
    }

    @Test
    void testGetById_Found() throws Exception {
        emplo_location relation = new emplo_location();
        relation.setId(1);

        when(employeeLocationService.findById(1)).thenReturn(Optional.of(relation));

        mockMvc.perform(get("/api/employee-locations/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void testGetById_NotFound() throws Exception {
        when(employeeLocationService.findById(99)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/employee-locations/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Relación empleado-ubicación no encontrada"));
    }

    @Test
    void testSave() throws Exception {
        emplo_locationDTO dto = new emplo_locationDTO(1, 1, 1);
        ResponseDTO<emplo_locationDTO> response = new ResponseDTO<>("Guardado correctamente", "200", dto);

        when(employeeLocationService.save(any(emplo_locationDTO.class))).thenReturn(response);

        mockMvc.perform(post("/api/employee-locations")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Guardado correctamente"));
    }

    @Test
    void testDelete() throws Exception {
        ResponseDTO<emplo_locationDTO> response = new ResponseDTO<>("Eliminado correctamente", "200", null);

        when(employeeLocationService.delete(1)).thenReturn(response);

        mockMvc.perform(delete("/api/employee-locations/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Eliminado correctamente"));
    }
}
