package com.Brisas.Las_Brisas.position;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.position.positionsDTO;
import com.brisas.las_brisas.controller.position.PositionsController;
import com.brisas.las_brisas.model.position.positions;
import com.brisas.las_brisas.security.JwtService;
import com.brisas.las_brisas.service.position.PositionsService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
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
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = PositionsController.class)
@AutoConfigureMockMvc(addFilters = false)
@ImportAutoConfiguration(exclude = {
                SecurityAutoConfiguration.class,
                SecurityFilterAutoConfiguration.class
})
@ActiveProfiles("test")
public class PositionsControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @MockBean
        private PositionsService positionsService;

        @MockBean
        private JwtService jwtService;

        @MockBean
        private com.brisas.las_brisas.auth.service.CustomUserDetailsService customUserDetailsService;

        @Test
        void getAll_ShouldReturnListOfPositions() throws Exception {
                List<positions> mockList = List.of(
                                positions.builder()
                                                .id(1)
                                                .namePost("Director de Talento Humano")
                                                .description("Supervisa toda la gestión del personal y define estrategias para optimizar el talento humano.")
                                                .jon_function("Definir políticas de recursos humanos. Aprobar contrataciones y despidos.")
                                                .requirements("Profesional en Psicología, RRHH o Administración.")
                                                .build(),
                                positions.builder()
                                                .id(2)
                                                .namePost("Asistente de Nómina")
                                                .description("Gestiona pagos, deducciones y aportes de los empleados.")
                                                .jon_function("Registrar novedades de nómina. Calcular salarios y aportes.")
                                                .requirements("Técnico o tecnólogo en contabilidad o administración.")
                                                .build());

                Mockito.when(positionsService.getAll()).thenReturn(mockList);

                mockMvc.perform(get("/api/v1/positions/all")
                                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                                .contentType(MediaType.APPLICATION_JSON))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$[0].namePost").value("Director de Talento Humano"))
                                .andExpect(jsonPath("$[1].namePost").value("Asistente de Nómina"));
        }

        @Test
        void getById_ShouldReturnPosition_WhenFound() throws Exception {
                positions entity = positions.builder()
                                .id(1)
                                .namePost("Director de Talento Humano")
                                .description("Supervisa toda la gestión del personal y define estrategias para optimizar el talento humano.")
                                .jon_function("Definir políticas de recursos humanos. Aprobar contrataciones y despidos.")
                                .requirements("Profesional en Psicología, RRHH o Administración.")
                                .build();

                Mockito.when(positionsService.findById(1)).thenReturn(Optional.of(entity));

                mockMvc.perform(get("/api/v1/positions/1")
                                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                                .contentType(MediaType.APPLICATION_JSON))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.namePost").value("Director de Talento Humano"));
        }

        @Test
        void getById_ShouldReturnNotFound_WhenNotExists() throws Exception {
                Mockito.when(positionsService.findById(99)).thenReturn(Optional.empty());

                mockMvc.perform(get("/api/v1/positions/99")
                                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                                .contentType(MediaType.APPLICATION_JSON))
                                .andExpect(status().isNotFound())
                                .andExpect(jsonPath("$.message").value("Puesto no encontrado"));
        }

        @Test
        void save_ShouldReturnSuccessResponse() throws Exception {
                positionsDTO dto = new positionsDTO(
                                1,
                                "Coordinador de Producción",
                                "Supervisa procesos productivos.",
                                "Controlar operaciones, garantizar cumplimiento de metas.",
                                "Profesional en Ingeniería Industrial o afines.");

                ResponseDTO<positionsDTO> mockResponse = new ResponseDTO<>(
                                "Puesto guardado correctamente",
                                HttpStatus.OK.toString(),
                                dto);

                Mockito.when(positionsService.save(any(positionsDTO.class))).thenReturn(mockResponse);

                mockMvc.perform(post("/api/v1/positions/")
                                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                                {
                                                    "namePost": "Coordinador de Producción",
                                                    "description": "Supervisa procesos productivos.",
                                                    "jon_function": "Controlar operaciones, garantizar cumplimiento de metas.",
                                                    "requirements": "Profesional en Ingeniería Industrial o afines."
                                                }
                                                """))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.message").value("Puesto guardado correctamente"))
                                .andExpect(jsonPath("$.data.namePost").value("Coordinador de Producción"));
        }

        @Test
        void delete_ShouldReturnSuccessResponse() throws Exception {
                ResponseDTO<positionsDTO> mockResponse = new ResponseDTO<>(
                                "Puesto eliminado correctamente",
                                "200",
                                null);

                Mockito.when(positionsService.delete(eq(1))).thenReturn(mockResponse);

                mockMvc.perform(delete("/api/v1/positions/1")
                                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                                .contentType(MediaType.APPLICATION_JSON))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.message").value("Puesto eliminado correctamente"));
        }
}
