package com.brisas.Las_Brisas.employee;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.employee.emplo_scheduleDTO;
import com.brisas.las_brisas.controller.employee.EmployeeScheduleController;
import com.brisas.las_brisas.model.employee.emplo_schedule;
import com.brisas.las_brisas.service.employee.EmployeeScheduleService;
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

@WebMvcTest(EmployeeScheduleController.class)
@AutoConfigureMockMvc(addFilters = false)
class EmployeeScheduleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private EmployeeScheduleService employeeScheduleService;

    @MockBean
    private com.brisas.las_brisas.security.JwtAuthFilter jwtAuthFilter;
    @MockBean
    private com.brisas.las_brisas.security.JwtService jwtService;
    @MockBean
    private com.brisas.las_brisas.auth.service.CustomUserDetailsService customUserDetailsService;

    @Test
    void testGetAll() throws Exception {
        emplo_schedule relation = new emplo_schedule();
        relation.setId(1);

        when(employeeScheduleService.getAll()).thenReturn(List.of(relation));

        mockMvc.perform(get("/api/v1/employee-schedule/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));
    }

    @Test
    void testGetById_Found() throws Exception {
        emplo_schedule relation = new emplo_schedule();
        relation.setId(1);

        when(employeeScheduleService.findById(1)).thenReturn(Optional.of(relation));

        mockMvc.perform(get("/api/v1/employee-schedule/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void testGetById_NotFound() throws Exception {
        when(employeeScheduleService.findById(99)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/employee-schedule/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Relación no encontrada"));
    }

    @Test
    void testCreate() throws Exception {
        emplo_scheduleDTO dto = new emplo_scheduleDTO(1, 1, 1);
        ResponseDTO<emplo_scheduleDTO> response = new ResponseDTO<>("Guardado correctamente", "200", dto);

        when(employeeScheduleService.save(any(emplo_scheduleDTO.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/employee-schedule/")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Guardado correctamente"));
    }

    @Test
    void testDelete() throws Exception {
        ResponseDTO<emplo_scheduleDTO> response = new ResponseDTO<>("Eliminado correctamente", "200", null);

        when(employeeScheduleService.delete(1)).thenReturn(response);

        mockMvc.perform(delete("/api/v1/employee-schedule/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Eliminado correctamente"));
    }
}
