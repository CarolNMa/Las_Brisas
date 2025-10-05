package com.Brisas.Las_Brisas.training;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.training.inductionDTO;
import com.brisas.las_brisas.controller.training.InductionController;
import com.brisas.las_brisas.model.training.induction;
import com.brisas.las_brisas.service.training.InductionService;
import com.brisas.las_brisas.security.JwtService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import com.brisas.las_brisas.model.training.induction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = InductionController.class)
@AutoConfigureMockMvc(addFilters = false)
@ImportAutoConfiguration(exclude = {
        SecurityAutoConfiguration.class,
        SecurityFilterAutoConfiguration.class
})
@ActiveProfiles("test")
class InductionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private InductionService inductionService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private com.brisas.las_brisas.auth.service.CustomUserDetailsService customUserDetailsService;

    @Test
    void getAllInductions_ShouldReturnListOfInductions() throws Exception {

        List<induction> list = List.of(
                new induction(
                        1,
                        "Inducción General",
                        "Video introductorio",
                        induction.type.induction,
                        induction.status.aprobado,
                        LocalDateTime.now(),
                        LocalDateTime.now()),
                new induction(
                        2,
                        "Seguridad Laboral",
                        "Capacitación sobre normas",
                        induction.type.capacitacion,
                        induction.status.aprobado,
                        LocalDateTime.now(),
                        LocalDateTime.now()));

        Mockito.when(inductionService.getAll()).thenReturn(list);

        mockMvc.perform(get("/api/v1/inductions")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Inducción General"))
                .andExpect(jsonPath("$[1].type").value("capacitacion"));
    }

    @Test
    void getInductionById_ShouldReturnInduction_WhenFound() throws Exception {
        induction entity = new induction(
                1,
                "Inducción General",
                "Video introductorio",
                induction.type.induction,
                induction.status.aprobado,
                LocalDateTime.now(),
                LocalDateTime.now());

        Mockito.when(inductionService.findById(1)).thenReturn(Optional.of(entity));

        mockMvc.perform(get("/api/v1/inductions/1")
                .principal(new UsernamePasswordAuthenticationToken("empleado", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Inducción General"));
    }

    @Test
    void createOrUpdateInduction_ShouldReturnResponseDTO() throws Exception {
        inductionDTO dto = new inductionDTO(
                1,
                "Inducción General",
                "Video introductorio",
                "induccion",
                "activa",
                LocalDateTime.now(),
                LocalDateTime.now());

        ResponseDTO<inductionDTO> response = new ResponseDTO<>();
        response.setMessage("Guardado correctamente");
        response.setStatus(String.valueOf(HttpStatus.OK.value())); // 👈 convertido a String
        response.setData(dto);

        Mockito.when(inductionService.save(any(inductionDTO.class))).thenReturn(response);

        String json = """
                {
                    "id": 1,
                    "name": "Inducción General",
                    "description": "Video introductorio",
                    "type": "induccion",
                    "status": "activa"
                }
                """;

        mockMvc.perform(post("/api/v1/inductions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json)
                .principal(new UsernamePasswordAuthenticationToken("admin", "password")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Guardado correctamente"))
                .andExpect(jsonPath("$.data.name").value("Inducción General"));
    }

    @Test
    void deleteInduction_ShouldReturnSuccessResponse() throws Exception {
        ResponseDTO<inductionDTO> response = new ResponseDTO<>();
        response.setMessage("Eliminado correctamente");
        response.setStatus(String.valueOf(HttpStatus.OK.value())); // convertir a String
        response.setData(null);

        Mockito.when(inductionService.delete(1)).thenReturn(response);

        mockMvc.perform(delete("/api/v1/inductions/1")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Eliminado correctamente"));
    }

    @Test
    void getAllCapacitaciones_ShouldReturnList() throws Exception {
        List<induction> list = List.of(
                new induction(
                        1,
                        "Capacitación Seguridad",
                        "Normas de seguridad",
                        induction.type.capacitacion, // 👈 enum de la entidad
                        induction.status.aprobado, // 👈 enum de la entidad
                        LocalDateTime.now(),
                        LocalDateTime.now()));

        Mockito.when(inductionService.getAllCapacitaciones()).thenReturn(list);

        mockMvc.perform(get("/api/v1/inductions/capacitaciones")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].type").value("capacitacion"));
    }

    @Test
    void createOrUpdateCapacitacion_ShouldReturnResponseDTO() throws Exception {
        inductionDTO dto = new inductionDTO(
                3,
                "Capacitación Seguridad",
                "Normas básicas",
                "capacitacion",
                "activa",
                LocalDateTime.now(),
                LocalDateTime.now());

        ResponseDTO<inductionDTO> response = new ResponseDTO<>();
        response.setMessage("Capacitación guardada");
        response.setStatus(String.valueOf(HttpStatus.OK.value())); // porque tu status es String
        response.setData(dto);

        Mockito.when(inductionService.saveCapacitacion(any(inductionDTO.class))).thenReturn(response);

        String json = """
                {
                    "id": 3,
                    "name": "Capacitación Seguridad",
                    "description": "Normas básicas",
                    "type": "capacitacion",
                    "status": "activa"
                }
                """;

        mockMvc.perform(post("/api/v1/inductions/capacitaciones")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json)
                .principal(new UsernamePasswordAuthenticationToken("admin", "password")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Capacitación guardada"))
                .andExpect(jsonPath("$.data.type").value("capacitacion"));
    }

}
