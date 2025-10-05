package com.Brisas.Las_Brisas.employee;


import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.attendance.employee_scheduleDetailDTO;
import com.brisas.las_brisas.DTO.employee.emplo_scheduleDTO;
import com.brisas.las_brisas.controller.employee.EmployeeScheduleController;
import com.brisas.las_brisas.security.JwtService;
import com.brisas.las_brisas.service.employee.EmployeeScheduleService;

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

@WebMvcTest(EmployeeScheduleController.class)
@AutoConfigureMockMvc(addFilters = false)
@ImportAutoConfiguration(exclude = JwtService.class)
@ActiveProfiles("test")
class EmployeeScheduleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EmployeeScheduleService employeeScheduleService;

    @MockBean
    private JwtService jwtService;
    
    @MockBean
    private com.brisas.las_brisas.auth.service.CustomUserDetailsService customUserDetailsService;

   
    @Test
    void getAll_ShouldReturnListOfRelations() throws Exception {
        employee_scheduleDetailDTO dto1 = employee_scheduleDetailDTO.builder()
                .id(1)
                .employeeId(3)
                .employeeName("Ana Gómez")
                .scheduleId(2)
                .scheduleName("Turno Mañana")
                .build();

        Mockito.when(employeeScheduleService.getAll()).thenReturn(List.of(dto1));

        mockMvc.perform(get("/api/v1/employee-schedules")
                        .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].employeeId").value(3))
                .andExpect(jsonPath("$[0].scheduleName").value("Turno Mañana"));
    }

    @Test
    void getById_ShouldReturnRelation_WhenFound() throws Exception {
        employee_scheduleDetailDTO dto = employee_scheduleDetailDTO.builder()
                .id(1)
                .employeeId(3)
                .employeeName("Ana Gómez")
                .scheduleId(2)
                .scheduleName("Turno Mañana")
                .build();

        Mockito.when(employeeScheduleService.findById(1)).thenReturn(Optional.of(dto));

        mockMvc.perform(get("/api/v1/employee-schedules/1")
                        .principal(new UsernamePasswordAuthenticationToken("admin", "password")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.employeeId").value(3))
                .andExpect(jsonPath("$.scheduleName").value("Turno Mañana"));
    }


    @Test
    void getById_ShouldReturnNotFound_WhenMissing() throws Exception {
        Mockito.when(employeeScheduleService.findById(99)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/employee-schedules/99")
                        .principal(new UsernamePasswordAuthenticationToken("admin", "password")))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Relación no encontrada"));
    }


    @Test
    void save_ShouldReturnSuccessResponse() throws Exception {
        emplo_scheduleDTO dto = emplo_scheduleDTO.builder()
                .id(1)
                .employeeId(3)
                .scheduleId(2)
                .build();

        ResponseDTO<emplo_scheduleDTO> response =
                new ResponseDTO<>("Asignación creada correctamente", HttpStatus.OK.toString(), dto);

        Mockito.when(employeeScheduleService.save(any(emplo_scheduleDTO.class))).thenReturn(response);

        String json = """
                {
                  "employeeId": 3,
                  "scheduleId": 2
                }
                """;

        mockMvc.perform(post("/api/v1/employee-schedules")
                        .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Asignación creada correctamente"));
    }

    @Test
    void delete_ShouldReturnSuccessResponse() throws Exception {
        ResponseDTO<emplo_scheduleDTO> response =
                new ResponseDTO<>("Relación eliminada correctamente", HttpStatus.OK.toString(), null);

        Mockito.when(employeeScheduleService.delete(1)).thenReturn(response);

        mockMvc.perform(delete("/api/v1/employee-schedules/1")
                        .principal(new UsernamePasswordAuthenticationToken("admin", "password")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Relación eliminada correctamente"));
    }
}

