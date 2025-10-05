package com.Brisas.Las_Brisas.attendance;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.attendance.scheduleDTO;
import com.brisas.las_brisas.model.attendance.schedule;
import com.brisas.las_brisas.controller.attendance.ScheduleController;
import com.brisas.las_brisas.security.JwtService;
import com.brisas.las_brisas.service.attendance.ScheduleService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ActiveProfiles("test")
@WebMvcTest(ScheduleController.class)
@AutoConfigureMockMvc(addFilters = false)
class ScheduleControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @MockBean
        private ScheduleService scheduleService;

        @MockBean
        private JwtService jwtService;

        @MockBean
        private com.brisas.las_brisas.auth.service.CustomUserDetailsService customUserDetailsService;

        @Test
        void getAll_ReturnsOk() throws Exception {
                schedule mockSchedule = new schedule();
                mockSchedule.setId(1);
                mockSchedule.setTime_start(LocalTime.of(8, 0));

                Mockito.when(scheduleService.getAll()).thenReturn(List.of(mockSchedule));

                mockMvc.perform(get("/api/v1/schedules"))
                                .andExpect(status().isOk());
        }

        @Test
        void getById_ReturnsOk_WhenExists() throws Exception {
                schedule mockSchedule = new schedule();
                mockSchedule.setId(1);
                mockSchedule.setTime_start(LocalTime.of(9, 0));

                Mockito.when(scheduleService.findById(1)).thenReturn(Optional.of(mockSchedule));

                mockMvc.perform(get("/api/v1/schedules/1"))
                                .andExpect(status().isOk());
        }

        @Test
        void getById_ReturnsNotFound_WhenMissing() throws Exception {
                Mockito.when(scheduleService.findById(99)).thenReturn(Optional.empty());

                mockMvc.perform(get("/api/v1/schedules/99"))
                                .andExpect(status().isNotFound());
        }

        @Test
        void save_ReturnsOk() throws Exception {
                scheduleDTO mockSchedule = new scheduleDTO();
                mockSchedule.setId(1);
                mockSchedule.setDayWeek("Miércoles");
                mockSchedule.setTime_start(LocalTime.of(10, 0));

                Mockito.when(scheduleService.save(any(scheduleDTO.class)))
                                .thenReturn(new ResponseDTO<>("Guardado correctamente", HttpStatus.OK.toString(),
                                                mockSchedule));

                mockMvc.perform(post("/api/v1/schedules")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{\"dayWeek\":\"Miércoles\",\"time_start\":\"10:00:00\"}"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.message").value("Guardado correctamente"))
                                .andExpect(jsonPath("$.status").value("200 OK"))
                                .andExpect(jsonPath("$.data.dayWeek").value("Miércoles"));
        }

        @Test
        void delete_ReturnsOk() throws Exception {
                Mockito.when(scheduleService.delete(1))
                                .thenReturn(new ResponseDTO<>("Eliminado correctamente", HttpStatus.OK.toString(),
                                                null));

                mockMvc.perform(delete("/api/v1/schedules/1"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.message").value("Eliminado correctamente"))
                                .andExpect(jsonPath("$.status").value("200 OK"))
                                .andExpect(jsonPath("$.data").isEmpty());
        }

}
