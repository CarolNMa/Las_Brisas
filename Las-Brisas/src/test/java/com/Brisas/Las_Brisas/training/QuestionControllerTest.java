package com.Brisas.Las_Brisas.training;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.training.questionDTO;
import com.brisas.las_brisas.controller.training.QuestionController;
import com.brisas.las_brisas.model.training.question;
import com.brisas.las_brisas.security.JwtService;
import com.brisas.las_brisas.service.training.QuestionService;
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

@WebMvcTest(QuestionController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
@ImportAutoConfiguration(exclude = JwtService.class)
class QuestionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private QuestionService questionService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private com.brisas.las_brisas.auth.service.CustomUserDetailsService customUserDetailsService;

    @Test
    void getAll_ShouldReturnListOfQuestions() throws Exception {
        List<question> list = List.of(
                question.builder()
                        .id(1)
                        .question("¿Qué es la inducción?")
                        .build(),
                question.builder()
                        .id(2)
                        .question("¿Qué hacer en caso de accidente?")
                        .build());

        Mockito.when(questionService.getAll()).thenReturn(list);

        Mockito.when(questionService.convertToDTO(Mockito.any(question.class)))
                .thenAnswer(invocation -> {
                    question q = invocation.getArgument(0);
                    return questionDTO.builder()
                            .id(q.getId())
                            .question(q.getQuestion())
                            .moduleInductionId(2)
                            .build();
                });

        mockMvc.perform(get("/api/v1/questions")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].question").value("¿Qué es la inducción?"))
                .andExpect(jsonPath("$[1].question").value("¿Qué hacer en caso de accidente?"));
    }

    @Test
    void getById_ShouldReturnQuestion_WhenFound() throws Exception {
        question entity = question.builder()
                .id(3)
                .question("¿Qué hacer en una emergencia?")
                .build();

        questionDTO dto = questionDTO.builder()
                .id(3)
                .question("¿Qué hacer en una emergencia?")
                .moduleInductionId(2)
                .build();

        Mockito.when(questionService.findById(3)).thenReturn(Optional.of(entity)); // entidad
        Mockito.when(questionService.convertToDTO(entity)).thenReturn(dto); // convierte entidad → dto

        mockMvc.perform(get("/api/v1/questions/3")
                .principal(new UsernamePasswordAuthenticationToken("empleado", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.question").value("¿Qué hacer en una emergencia?"));
    }

    @Test
    void getById_ShouldReturnNotFound_WhenMissing() throws Exception {
        Mockito.when(questionService.findById(10)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/questions/10")
                .principal(new UsernamePasswordAuthenticationToken("empleado", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Pregunta no encontrada"));
    }

    @Test
    void save_ShouldReturnSuccessResponse() throws Exception {
        // DTO de ejemplo
        questionDTO dto = questionDTO.builder()
                .id(1)
                .question("¿Qué es seguridad laboral?")
                .moduleInductionId(3)
                .build();

        ResponseDTO<questionDTO> response = new ResponseDTO<>(
                "Guardado correctamente",
                HttpStatus.OK.toString(),
                dto);

        Mockito.when(questionService.save(any(questionDTO.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/questions")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                            {
                                "id": 1,
                                "question": "¿Qué es seguridad laboral?",
                                "description": "Descripción breve",
                                "moduleInductionId": 3
                            }
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Guardado correctamente"));
    }

    @Test
    void delete_ShouldReturnSuccessResponse() throws Exception {
        ResponseDTO<questionDTO> response = new ResponseDTO<>(
                "Eliminado correctamente",
                HttpStatus.OK.toString(),
                null);

        Mockito.when(questionService.delete(eq(2))).thenReturn(response);

        mockMvc.perform(delete("/api/v1/questions/2")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Eliminado correctamente"));
    }

}
