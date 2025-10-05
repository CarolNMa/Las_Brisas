package com.Brisas.Las_Brisas.employee;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.area.EmployeeAreaDetailDTO;
import com.brisas.las_brisas.DTO.employee.employee_areaDTO;
import com.brisas.las_brisas.controller.employee.EmployeeAreaController;
import com.brisas.las_brisas.security.JwtService;
import com.brisas.las_brisas.service.employee.EmployeeAreaService;

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

@WebMvcTest(EmployeeAreaController.class)
@AutoConfigureMockMvc(addFilters = false)
@ImportAutoConfiguration(exclude = JwtService.class)
@ActiveProfiles("test")
class EmployeeAreaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EmployeeAreaService employeeAreaService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private com.brisas.las_brisas.auth.service.CustomUserDetailsService customUserDetailsService;

    @Test
    void getAll_ShouldReturnListOfRelations() throws Exception {
        EmployeeAreaDetailDTO dto1 = EmployeeAreaDetailDTO.builder()
                .id(1)
                .employeeId(3)
                .employeeName("Ana Gómez")
                .areaId(2)
                .areaName("Administración")
                .build();

        Mockito.when(employeeAreaService.getAll()).thenReturn(List.of(dto1));

        mockMvc.perform(get("/api/v1/employee-areas")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].employeeId").value(3))
                .andExpect(jsonPath("$[0].areaName").value("Administración"));
    }

    @Test
    void getById_ShouldReturnRelation_WhenFound() throws Exception {
        EmployeeAreaDetailDTO dto = EmployeeAreaDetailDTO.builder()
                .id(1)
                .employeeId(3)
                .employeeName("Ana Gómez")
                .areaId(2)
                .areaName("Administración")
                .build();

        Mockito.when(employeeAreaService.findById(1)).thenReturn(Optional.of(dto));

        mockMvc.perform(get("/api/v1/employee-areas/1")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.employeeId").value(3))
                .andExpect(jsonPath("$.areaName").value("Administración"));
    }

    @Test
    void getById_ShouldReturnNotFound_WhenMissing() throws Exception {
        Mockito.when(employeeAreaService.findById(99)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/employee-areas/99")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password")))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Relación no encontrada"));
    }

    @Test
    void save_ShouldReturnSuccessResponse() throws Exception {
        employee_areaDTO dto = employee_areaDTO.builder()
                .id(1)
                .employeeId(3)
                .areaId(2)
                .build();

        // ✅ Tipo genérico correcto
        ResponseDTO<employee_areaDTO> response = new ResponseDTO<>("Asignación creada correctamente",
                HttpStatus.OK.toString(), dto);

        // ✅ Mock con el mismo tipo de retorno
        Mockito.when(employeeAreaService.save(any(employee_areaDTO.class))).thenReturn(response);

        String json = """
                {
                  "employeeId": 3,
                  "areaId": 2
                }
                """;

        mockMvc.perform(post("/api/v1/employee-areas")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Asignación creada correctamente"));
    }

    @Test
    void delete_ShouldReturnSuccessResponse() throws Exception {
        ResponseDTO<employee_areaDTO> response = new ResponseDTO<>(
                "Relación eliminada correctamente",
                HttpStatus.OK.toString(),
                null);

        Mockito.when(employeeAreaService.delete(1)).thenReturn(response);

        mockMvc.perform(delete("/api/v1/employee-areas/1")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Relación eliminada correctamente"));
    }

}
