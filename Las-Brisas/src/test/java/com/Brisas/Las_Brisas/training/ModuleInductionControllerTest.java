package com.Brisas.Las_Brisas.training;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.training.module_inductionDTO;
import com.brisas.las_brisas.controller.training.ModuleInductionController;
import com.brisas.las_brisas.model.training.moduleInduction;
import com.brisas.las_brisas.security.JwtService;
import com.brisas.las_brisas.service.training.ModuleInductionService;

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

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = ModuleInductionController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
@ImportAutoConfiguration(exclude = JwtService.class)
class ModuleInductionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private com.brisas.las_brisas.auth.service.CustomUserDetailsService customUserDetailsService;

    @MockBean
    private ModuleInductionService moduleInductionService;

    @Test
    void getAll_ShouldReturnListOfModules() throws Exception {
        List<moduleInduction> list = List.of(
                moduleInduction.builder()
                        .id(1)
                        .name("Introducción")
                        .description("Video inicial")
                        .video_url("intro.mp4")
                        .build(),
                moduleInduction.builder()
                        .id(2)
                        .name("Seguridad Laboral")
                        .description("Normas básicas")
                        .video_url("seguridad.mp4")
                        .build());

        Mockito.when(moduleInductionService.getAll()).thenReturn(list);

        mockMvc.perform(get("/api/v1/modules")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Introducción"))
                .andExpect(jsonPath("$[1].name").value("Seguridad Laboral"));
    }

    @Test
    void getByInduction_ShouldReturnModulesForInduction() throws Exception {
        List<moduleInduction> list = List.of(
                moduleInduction.builder()
                        .id(1)
                        .name("Módulo 1")
                        .description("Descripción 1")
                        .video_url("video1.mp4")
                        .build());

        Mockito.when(moduleInductionService.findByInductionId(5)).thenReturn(list);

        mockMvc.perform(get("/api/v1/modules/induction/5")
                .principal(new UsernamePasswordAuthenticationToken("empleado", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Módulo 1"));
    }

    @Test
    void getById_ShouldReturnModule_WhenFound() throws Exception {
        moduleInduction module = moduleInduction.builder()
                .id(3)
                .name("Video Introductorio")
                .description("Bienvenida")
                .video_url("intro.mp4")
                .build();

        Mockito.when(moduleInductionService.findById(3)).thenReturn(Optional.of(module));

        mockMvc.perform(get("/api/v1/modules/3")
                .principal(new UsernamePasswordAuthenticationToken("empleado", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Video Introductorio"));
    }

    @Test
    void getById_ShouldReturnNotFound_WhenNotExists() throws Exception {
        Mockito.when(moduleInductionService.findById(999)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/modules/999")
                .principal(new UsernamePasswordAuthenticationToken("empleado", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Módulo no encontrado"));
    }

    @Test
    void save_ShouldReturnSuccessResponse() throws Exception {
        module_inductionDTO dto = new module_inductionDTO(1, "Seguridad Básica", "Video sobre normas", "seguridad.mp4",
                1);
        ResponseDTO<module_inductionDTO> response = new ResponseDTO<>();
        response.setMessage("Módulo guardado correctamente");
        response.setStatus("200");
        response.setData(dto);

        Mockito.when(moduleInductionService.save(any(module_inductionDTO.class))).thenReturn(response);

        String json = """
                {
                    "id": 1,
                    "name": "Seguridad Básica",
                    "description": "Video sobre normas",
                    "filePath": "seguridad.mp4",
                    "inductionId": 1
                }
                """;

        mockMvc.perform(post("/api/v1/modules")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json)
                .principal(new UsernamePasswordAuthenticationToken("admin", "password")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Módulo guardado correctamente"))
                .andExpect(jsonPath("$.data.name").value("Seguridad Básica"));
    }

    @Test
    void update_ShouldReturnUpdatedResponse() throws Exception {
        module_inductionDTO dto = new module_inductionDTO(2, "Actualizado", "Nuevo contenido", "nuevo.mp4", 1);
        ResponseDTO<module_inductionDTO> response = new ResponseDTO<>();
        response.setMessage("Módulo actualizado");
        response.setStatus("200");
        response.setData(dto);

        Mockito.when(moduleInductionService.save(any(module_inductionDTO.class))).thenReturn(response);

        String json = """
                {
                    "name": "Actualizado",
                    "description": "Nuevo contenido",
                    "filePath": "nuevo.mp4",
                    "inductionId": 1
                }
                """;

        mockMvc.perform(put("/api/v1/modules/2")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json)
                .principal(new UsernamePasswordAuthenticationToken("admin", "password")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Módulo actualizado"))
                .andExpect(jsonPath("$.data.name").value("Actualizado"));
    }

    @Test
    void delete_ShouldReturnSuccessResponse() throws Exception {
        ResponseDTO<module_inductionDTO> response = new ResponseDTO<>();
        response.setMessage("Módulo eliminado");
        response.setStatus("200");

        Mockito.when(moduleInductionService.delete(1)).thenReturn(response);

        mockMvc.perform(delete("/api/v1/modules/1")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Módulo eliminado"));
    }
}
