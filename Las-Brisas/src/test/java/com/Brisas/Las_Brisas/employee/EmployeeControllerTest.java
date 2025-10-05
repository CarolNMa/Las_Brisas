package com.Brisas.Las_Brisas.employee;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.employee.EmployeeProfileDTO;
import com.brisas.las_brisas.DTO.employee.employeeDTO;
import com.brisas.las_brisas.controller.employee.EmployeeController;
import com.brisas.las_brisas.security.JwtService;
import com.brisas.las_brisas.service.employee.employeeService;
import com.brisas.las_brisas.service.employee.employeeProfileService;

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
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EmployeeController.class)
@ActiveProfiles("test")
@ImportAutoConfiguration(exclude = JwtService.class)
@AutoConfigureMockMvc(addFilters = false)
class EmployeeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private employeeService employeeService;

    @MockBean
    private employeeProfileService employeeProfileService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private com.brisas.las_brisas.auth.service.CustomUserDetailsService customUserDetailsService;

    @Test
    void getAllEmployees_ShouldReturnListOfEmployees() throws Exception {
        employeeDTO e1 = employeeDTO.builder()
                .id(1)
                .firstName("Ana")
                .lastName("Gómez")
                .tipoDocumento("CC")
                .documentNumber("12345")
                .build();

        employeeDTO e2 = employeeDTO.builder()
                .id(2)
                .firstName("Carlos")
                .lastName("Pérez")
                .tipoDocumento("CC")
                .documentNumber("67890")
                .build();

        Mockito.when(employeeService.getAllEmployees()).thenReturn(List.of());
        Mockito.when(employeeService.convertToDTO(any())).thenReturn(e1, e2);

        mockMvc.perform(get("/api/v1/employees/all")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void getEmployeeById_ShouldReturnEmployee_WhenFound() throws Exception {
        employeeDTO dto = employeeDTO.builder()
                .id(1)
                .firstName("Ana")
                .lastName("Gómez")
                .tipoDocumento("CC")
                .documentNumber("12345")
                .build();

        com.brisas.las_brisas.model.employee.employee fakeEmployee = new com.brisas.las_brisas.model.employee.employee();

        Mockito.when(employeeService.findById(1)).thenReturn(Optional.of(fakeEmployee));
        Mockito.when(employeeService.convertToDTO(fakeEmployee)).thenReturn(dto);

        mockMvc.perform(get("/api/v1/employees/1")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("Ana"));
    }

    @Test
    void getEmployeeById_ShouldReturnNotFound_WhenNotFound() throws Exception {
        Mockito.when(employeeService.findById(99)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/employees/99")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password")))
                .andExpect(status().isNotFound());
    }

    @Test
    void getEmployeeProfile_ShouldReturnProfile() throws Exception {
        EmployeeProfileDTO profile = EmployeeProfileDTO.builder()
                .id(1)
                .firstName("Ana")
                .lastName("Gómez")
                .email("ana.gomez@lasbrisas.com")
                .phone("3201234567")
                .tipoDocumento("CC")
                .documentNumber("12345")
                .address("Calle 10 #20-30")
                .cargos(List.of("Director de Talento Humano"))
                .areas(List.of("Administración"))
                .locations(List.of("Sede Principal"))
                .contratos(List.of("Contrato indefinido"))
                .supervisor("Carlos Pérez")
                .build();

        Mockito.when(employeeProfileService.getFullProfile(1)).thenReturn(profile);

        mockMvc.perform(get("/api/v1/employees/1/profile")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("Ana"))
                .andExpect(jsonPath("$.lastName").value("Gómez"))
                .andExpect(jsonPath("$.areas[0]").value("Administración"));
    }

    @Test
    void createEmployee_ShouldReturnSuccessResponse() throws Exception {
        employeeDTO dto = employeeDTO.builder()
                .id(1)
                .firstName("Ana")
                .lastName("Gómez")
                .tipoDocumento("CC")
                .documentNumber("12345")
                .birthdate(LocalDate.now())
                .civilStatus("ACTIVO")
                .userId(1)
                .build();

        ResponseDTO<employeeDTO> response = new ResponseDTO<>("Empleado creado", HttpStatus.OK.toString(), dto);

        Mockito.when(employeeService.save(any(employeeDTO.class))).thenReturn(response);

        String json = """
                {
                  "firstName": "Ana",
                  "lastName": "Gómez",
                  "tipoDocumento": "CC",
                  "documentNumber": "12345"
                }
                """;

        mockMvc.perform(post("/api/v1/employees")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Empleado creado"));
    }

    @Test
    void updateEmployee_ShouldReturnUpdatedResponse() throws Exception {
        employeeDTO dto = employeeDTO.builder()
                .id(1)
                .firstName("Ana")
                .lastName("Gómez Actualizada")
                .tipoDocumento("CC")
                .documentNumber("12345")
                .birthdate(LocalDate.now())
                .userId(1)
                .build();

        ResponseDTO<employeeDTO> response = new ResponseDTO<>("Empleado actualizado", HttpStatus.OK.toString(), dto);

        Mockito.when(employeeService.updateEmployee(eq(1), any(employeeDTO.class))).thenReturn(response);

        String json = """
                {
                  "firstName": "Ana",
                  "lastName": "Gómez Actualizada"
                }
                """;

        mockMvc.perform(put("/api/v1/employees/1")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Empleado actualizado"));
    }

    @Test
    void deleteEmployee_ShouldReturnSuccessMessage() throws Exception {
        Mockito.when(employeeService.deleteEmployee(1)).thenReturn(
                new ResponseDTO<>("Empleado eliminado", HttpStatus.OK.toString(), null));

        mockMvc.perform(delete("/api/v1/employees/1")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("Empleado eliminado")); // 👈 ya no se usa jsonPath
    }

}
