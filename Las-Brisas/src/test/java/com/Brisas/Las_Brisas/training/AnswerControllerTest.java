package com.Brisas.Las_Brisas.training;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.training.answerDTO;
import com.brisas.las_brisas.controller.training.AnswerController;
import com.brisas.las_brisas.model.training.answer;
import com.brisas.las_brisas.model.training.question;
import com.brisas.las_brisas.security.JwtService;
import com.brisas.las_brisas.service.training.AnswerService;

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

@WebMvcTest(controllers = AnswerController.class)
@AutoConfigureMockMvc(addFilters = false)
@ImportAutoConfiguration(exclude = {
        SecurityAutoConfiguration.class,
        SecurityFilterAutoConfiguration.class
})
@ActiveProfiles("test")
public class AnswerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AnswerService answerService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private com.brisas.las_brisas.auth.service.CustomUserDetailsService customUserDetailsService;

    @Test
    void getAll_ShouldReturnListOfAnswers() throws Exception {
        question mockQuestion = question.builder()
                .id(1)
                .question("¿Cuál es la capital de Colombia?")
                .build();

        List<answer> mockList = List.of(
                answer.builder().id(1).answer("Opción A").responseCorrect(true).question(mockQuestion).build(),
                answer.builder().id(2).answer("Opción B").responseCorrect(false).question(mockQuestion).build());

        Mockito.when(answerService.getAll()).thenReturn(mockList);

        mockMvc.perform(get("/api/v1/answers")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].answer").value("Opción A"))
                .andExpect(jsonPath("$[1].answer").value("Opción B"));
    }

    @Test
    void getByQuestion_ShouldReturnAnswersForQuestion() throws Exception {
        question mockQuestion = question.builder()
                .id(5)
                .question("¿Está de acuerdo con la política de seguridad?")
                .build();

        List<answer> mockList = List.of(
                answer.builder().id(1).answer("Sí").responseCorrect(true).question(mockQuestion).build(),
                answer.builder().id(2).answer("No").responseCorrect(false).question(mockQuestion).build());

        Mockito.when(answerService.getAnswersByQuestion(eq(5))).thenReturn(mockList);

        mockMvc.perform(get("/api/v1/answers/question/5")
                .principal(new UsernamePasswordAuthenticationToken("empleado", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].answer").value("Sí"))
                .andExpect(jsonPath("$[1].answer").value("No"));
    }

    @Test
    void getById_ShouldReturnAnswer_WhenFound() throws Exception {
        // Simula una entidad answer real
        answer entity = answer.builder()
                .id(1)
                .answer("Correcta")
                .responseCorrect(true)
                .build();

        Mockito.when(answerService.findById(1)).thenReturn(Optional.of(entity));

        mockMvc.perform(get("/api/v1/answers/1")
                .principal(new UsernamePasswordAuthenticationToken("empleado", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.answer").value("Correcta"));
    }

    @Test
    void getById_ShouldReturnNotFound_WhenNotExists() throws Exception {
        Mockito.when(answerService.findById(99)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/answers/99")
                .principal(new UsernamePasswordAuthenticationToken("empleado", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Respuesta no encontrada"));
    }

    @Test
    void save_ShouldReturnSuccessResponse() throws Exception {
        answerDTO dto = new answerDTO(1, "Respuesta A", true, 2);

        ResponseDTO<answerDTO> mockResponse = new ResponseDTO<>(
                "Respuesta guardada correctamente",
                HttpStatus.OK.toString(),
                dto);

        Mockito.when(answerService.save(any(answerDTO.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/v1/answers")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                            "answer": "Respuesta A",
                            "responseCorrect": true,
                            "questionId": 2
                        }
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Respuesta guardada correctamente"))
                .andExpect(jsonPath("$.data.answer").value("Respuesta A"));
    }

    @Test
    void delete_ShouldReturnSuccessResponse() throws Exception {
        ResponseDTO<answerDTO> mockResponse = new ResponseDTO<>(
                "Respuesta eliminada correctamente",
                HttpStatus.OK.toString(),
                null);

        Mockito.when(answerService.delete(eq(1))).thenReturn(mockResponse);

        mockMvc.perform(delete("/api/v1/answers/1")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Respuesta eliminada correctamente"));
    }
}
