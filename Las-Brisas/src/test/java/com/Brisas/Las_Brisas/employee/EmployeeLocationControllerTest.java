package com.Brisas.Las_Brisas.employee;


import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.employee.emplo_locationDTO;
import com.brisas.las_brisas.DTO.location.employee_locationDetailDTO;
import com.brisas.las_brisas.controller.employee.EmployeeLocationController;
import com.brisas.las_brisas.security.JwtService;
import com.brisas.las_brisas.service.employee.EmployeeLocationService;

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

@WebMvcTest(EmployeeLocationController.class)
@AutoConfigureMockMvc(addFilters = false)
@ImportAutoConfiguration(exclude = JwtService.class)
@ActiveProfiles("test")
class EmployeeLocationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EmployeeLocationService employeeLocationService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private com.brisas.las_brisas.auth.service.CustomUserDetailsService customUserDetailsService;


    @Test
    void getAll_ShouldReturnListOfRelations() throws Exception {
        employee_locationDetailDTO dto1 = employee_locationDetailDTO.builder()
                .id(1)
                .employeeId(3)
                .employeeName("Ana Gómez")
                .locationId(2)
                .locationName("Sede Principal")
                .build();

        Mockito.when(employeeLocationService.getAll()).thenReturn(List.of(dto1));

        mockMvc.perform(get("/api/v1/employee-locations")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].employeeId").value(3))
                .andExpect(jsonPath("$[0].locationName").value("Sede Principal"));
    }


    @Test
    void getById_ShouldReturnRelation_WhenFound() throws Exception {
        employee_locationDetailDTO dto = employee_locationDetailDTO.builder()
                .id(1)
                .employeeId(3)
                .employeeName("Ana Gómez")
                .locationId(2)
                .locationName("Sede Principal")
                .build();

        Mockito.when(employeeLocationService.findById(1)).thenReturn(Optional.of(dto));

        mockMvc.perform(get("/api/v1/employee-locations/1")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.employeeId").value(3))
                .andExpect(jsonPath("$.locationName").value("Sede Principal"));
    }


    @Test
    void getById_ShouldReturnNotFound_WhenMissing() throws Exception {
        Mockito.when(employeeLocationService.findById(99)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/employee-locations/99")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password")))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Relación no encontrada"));
    }


    @Test
    void save_ShouldReturnSuccessResponse() throws Exception {
        emplo_locationDTO dto = emplo_locationDTO.builder()
                .id(1)
                .employeeId(3)
                .locationId(2)
                .build();

        ResponseDTO<emplo_locationDTO> response = new ResponseDTO<>("Asignación creada correctamente",
                HttpStatus.OK.toString(), dto);

        Mockito.when(employeeLocationService.save(any(emplo_locationDTO.class))).thenReturn(response);

        String json = """
                {
                  "employeeId": 3,
                  "locationId": 2
                }
                """;

        mockMvc.perform(post("/api/v1/employee-locations")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Asignación creada correctamente"));
    }


    @Test
    void delete_ShouldReturnSuccessResponse() throws Exception {
        ResponseDTO<emplo_locationDTO> response = new ResponseDTO<>("Relación eliminada correctamente",
                HttpStatus.OK.toString(), null);

        Mockito.when(employeeLocationService.delete(1)).thenReturn(response);

        mockMvc.perform(delete("/api/v1/employee-locations/1")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Relación eliminada correctamente"));
    }
}
