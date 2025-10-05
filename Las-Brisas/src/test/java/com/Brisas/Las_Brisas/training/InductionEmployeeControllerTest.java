package com.Brisas.Las_Brisas.training;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.training.induction_employeeDTO;
import com.brisas.las_brisas.controller.training.InductionEmployeeController;
import com.brisas.las_brisas.service.training.InductionEmployeeService;
import com.brisas.las_brisas.security.JwtService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = InductionEmployeeController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
@ImportAutoConfiguration(exclude = JwtService.class)
class InductionEmployeeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private InductionEmployeeService inductionEmployeeService;

    @MockBean
    private com.brisas.las_brisas.auth.service.CustomUserDetailsService customUserDetailsService;

    @Test
    void getAll_ShouldReturnListOfInductions() throws Exception {
        induction_employeeDTO dto = induction_employeeDTO.builder()
                .id(1)
                .employeeId(2)
                .inductionId(3)
                .employeeName("Juan Pérez")
                .inductionName("Inducción General")
                .status("pendiente")
                .points(0)
                .build();

        Mockito.when(inductionEmployeeService.getAllFormatted()).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/v1/induction-employee")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].employeeName").value("Juan Pérez"));
    }

    @Test
    void getMyInductions_ShouldReturnUserInductions() throws Exception {
        induction_employeeDTO dto = induction_employeeDTO.builder()
                .id(2)
                .employeeId(5)
                .inductionId(1)
                .employeeName("Ana López")
                .inductionName("Capacitación Seguridad")
                .status("completada")
                .points(80)
                .build();

        Mockito.when(inductionEmployeeService.findByUserEmailFormatted("empleado@correo.com"))
                .thenReturn(List.of(dto));

        mockMvc.perform(get("/api/v1/induction-employee/me")
                .principal(new UsernamePasswordAuthenticationToken("empleado@correo.com", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].inductionName").value("Capacitación Seguridad"))
                .andExpect(jsonPath("$[0].status").value("completada"));
    }

    @Test
    void save_ShouldReturnSuccessResponse() throws Exception {
        induction_employeeDTO dto = induction_employeeDTO.builder()
                .id(0)
                .employeeId(2)
                .inductionId(3)
                .employeeName("Juan Pérez")
                .inductionName("Inducción General")
                .status("pendiente")
                .points(0)
                .build();

        ResponseDTO<induction_employeeDTO> response = new ResponseDTO<>();
        response.setMessage("Asignación creada correctamente");
        response.setStatus("200");
        response.setData(dto);

        Mockito.when(inductionEmployeeService.save(any(induction_employeeDTO.class))).thenReturn(response);

        String json = """
                {
                    "id": 0,
                    "employeeId": 2,
                    "inductionId": 3,
                    "employeeName": "Juan Pérez",
                    "trainingName": "Inducción General",
                    "status": "pendiente"
                }
                """;

        mockMvc.perform(post("/api/v1/induction-employee")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json)
                .principal(new UsernamePasswordAuthenticationToken("admin", "password")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Asignación creada correctamente"))
                .andExpect(jsonPath("$.data.employeeName").value("Juan Pérez"));
    }

    @Test
    void markAsSeen_ShouldReturnSuccessResponse() throws Exception {
        ResponseDTO<induction_employeeDTO> response = new ResponseDTO<>();
        response.setMessage("Inducción marcada como vista");
        response.setStatus("200");

        Mockito.when(inductionEmployeeService.markAsSeen(eq(1))).thenReturn(response);

        mockMvc.perform(put("/api/v1/induction-employee/1/seen")
                .principal(new UsernamePasswordAuthenticationToken("empleado", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Inducción marcada como vista"));
    }

    @Test
    void completeInduction_ShouldReturnSuccessResponse() throws Exception {
        ResponseDTO<induction_employeeDTO> response = new ResponseDTO<>();
        response.setMessage("Inducción completada");
        response.setStatus("200");

        Mockito.when(inductionEmployeeService.completeInduction(eq(1), eq(85))).thenReturn(response);

        mockMvc.perform(put("/api/v1/induction-employee/1/complete")
                .param("points", "85")
                .principal(new UsernamePasswordAuthenticationToken("empleado", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Inducción completada"));
    }

    @Test
    void delete_ShouldReturnSuccessResponse() throws Exception {
        ResponseDTO<induction_employeeDTO> response = new ResponseDTO<>();
        response.setMessage("Asignación eliminada");
        response.setStatus("200");

        Mockito.when(inductionEmployeeService.delete(1)).thenReturn(response);

        mockMvc.perform(delete("/api/v1/induction-employee/1")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Asignación eliminada"));
    }

    @Test
    void completeCapacitacion_ShouldReturnSuccessResponse() throws Exception {
        ResponseDTO<induction_employeeDTO> response = new ResponseDTO<>();
        response.setMessage("Capacitación completada");
        response.setStatus("200");

        Mockito.when(inductionEmployeeService.completeCapacitacion(1)).thenReturn(response);

        mockMvc.perform(put("/api/v1/induction-employee/1/complete-training")
                .principal(new UsernamePasswordAuthenticationToken("empleado", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Capacitación completada"));
    }

}
