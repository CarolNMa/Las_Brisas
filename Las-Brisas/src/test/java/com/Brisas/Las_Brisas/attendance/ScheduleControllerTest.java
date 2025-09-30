package com.brisas.Las_Brisas.attendance;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.attendance.scheduleDTO;
import com.brisas.las_brisas.controller.attendance.ScheduleController;
import com.brisas.las_brisas.model.attendance.schedule;
import com.brisas.las_brisas.service.attendance.ScheduleService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ScheduleController.class)
@AutoConfigureMockMvc(addFilters = false)
class ScheduleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ScheduleService scheduleService;

    @MockBean
    private com.brisas.las_brisas.security.JwtAuthFilter jwtAuthFilter;
    @MockBean
    private com.brisas.las_brisas.auth.service.CustomUserDetailsService customUserDetailsService;

    @Test
    void testGetAllSchedules() throws Exception {
        schedule s1 = schedule.builder()
                .id(1)
                .time_start(LocalTime.of(8, 0))
                .time_end(LocalTime.of(17, 0))
                .shift(schedule.shift.mañana)
                .documentUrl("doc1.pdf")
                .overtime(LocalTime.of(1, 0))
                .day_week(schedule.day_week.lunes)
                .build();

        schedule s2 = schedule.builder()
                .id(2)
                .time_start(LocalTime.of(9, 0))
                .time_end(LocalTime.of(18, 0))
                .shift(schedule.shift.tarde)
                .documentUrl("doc2.pdf")
                .overtime(LocalTime.of(2, 0))
                .day_week(schedule.day_week.martes)
                .build();

        when(scheduleService.getAll()).thenReturn(List.of(s1, s2));

        mockMvc.perform(get("/api/v1/schedule/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].day_week").value("lunes"))
                .andExpect(jsonPath("$[1].day_week").value("martes"));
    }

    @Test
    void testGetScheduleById_Found() throws Exception {
        schedule s1 = schedule.builder()
                .id(1)
                .time_start(LocalTime.of(8, 0))
                .time_end(LocalTime.of(17, 0))
                .shift(schedule.shift.mañana)
                .documentUrl("doc1.pdf")
                .overtime(LocalTime.of(1, 0))
                .day_week(schedule.day_week.lunes)
                .build();

        when(scheduleService.findById(1)).thenReturn(Optional.of(s1));

        mockMvc.perform(get("/api/v1/schedule/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.day_week").value("lunes"));
    }

    @Test
    void testGetScheduleById_NotFound() throws Exception {
        when(scheduleService.findById(99)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/schedule/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Horario no encontrado"));
    }

    @Test
    void testSaveSchedule() throws Exception {
        scheduleDTO dto = scheduleDTO.builder()
                .id(1)
                .time_start(LocalTime.of(8, 0))
                .time_end(LocalTime.of(17, 0))
                .shift("Mañana")
                .day_week("Lunes a Viernes")
                .build();

        ResponseDTO<scheduleDTO> response = new ResponseDTO<>("Horario guardado correctamente", "200", dto);

        when(scheduleService.save(any(scheduleDTO.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/schedule/")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Horario guardado correctamente"));
    }

    @Test
    void testDeleteSchedule() throws Exception {
        ResponseDTO<Object> response = new ResponseDTO<>("Horario eliminado correctamente", "200", null);
        when(scheduleService.delete(1)).thenReturn((ResponseDTO) response);

        mockMvc.perform(delete("/api/v1/schedule/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Horario eliminado correctamente"));
    }
}
