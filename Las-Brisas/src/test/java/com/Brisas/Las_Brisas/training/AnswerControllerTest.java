package com.brisas.las_brisas.training;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.training.answerDTO;
import com.brisas.las_brisas.controller.training.AnswerController;
import com.brisas.las_brisas.model.training.answer;
import com.brisas.las_brisas.model.training.question;
import com.brisas.las_brisas.service.training.AnswerService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AnswerController.class)
@AutoConfigureMockMvc(addFilters = false)

class AnswerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AnswerService answerService;

    @Autowired
    private ObjectMapper objectMapper;

    // mocks de seguridad
    @MockBean
    private com.brisas.las_brisas.security.JwtAuthFilter jwtAuthFilter;
    @MockBean
    private com.brisas.las_brisas.auth.service.CustomUserDetailsService customUserDetailsService;

    @Test
    @WithMockUser
    void testGetAll() throws Exception {
        // Crear entidad de prueba
        answer entity = new answer();
        entity.setId(1);
        entity.setAnswer("Respuesta A");
        entity.setResponse_correct(true);
        question q = new question();
        q.setId(10);
        entity.setQuestion(q);

        Mockito.when(answerService.getAll()).thenReturn(Arrays.asList(entity));

        mockMvc.perform(get("/api/v1/answers/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].answer").value("Respuesta A"))
                .andExpect(jsonPath("$[0].response_correct").value(true));
    }

    @Test
    void testGetByIdFound() throws Exception {
        answer entity = new answer();
        entity.setId(1);
        entity.setAnswer("Correcta");
        entity.setResponse_correct(true);
        question q = new question();
        q.setId(10);

        Mockito.when(answerService.findById(1)).thenReturn(Optional.of(entity));

        mockMvc.perform(get("/api/v1/answers/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.answer").value("Correcta"));
    }

    @Test
    void testGetByIdNotFound() throws Exception {
        Mockito.when(answerService.findById(99)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/answers/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Respuesta no encontrada"));
    }

    @Test
    void testDelete() throws Exception {
        ResponseDTO<?> response = new ResponseDTO<>("Eliminado", HttpStatus.OK.toString(), null);
        Mockito.when(answerService.delete(1)).thenReturn((ResponseDTO) response);

        mockMvc.perform(delete("/api/v1/answers/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Eliminado"));
    }

    @Test
    @WithMockUser
    void testSave() throws Exception {
        answerDTO dto = new answerDTO(1, "Nueva respuesta", false, 3);
        ResponseDTO<answerDTO> response = new ResponseDTO<>("Guardado", HttpStatus.OK.toString(), dto);

        Mockito.when(answerService.save(any(answerDTO.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/answers/")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Guardado"))
                .andExpect(jsonPath("$.data.answer").value("Nueva respuesta"));
    }

}
