package com.brisas.Las_Brisas.attendance;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.attendance.attendanceDTO;
import com.brisas.las_brisas.controller.attendance.AttendanceController;
import com.brisas.las_brisas.model.attendance.attendance;
import com.brisas.las_brisas.model.employee.employee;
import com.brisas.las_brisas.service.attendance.AttendanceService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AttendanceController.class)
@AutoConfigureMockMvc(addFilters = false)
class AttendanceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AttendanceService attendanceService;

    @MockBean
    private com.brisas.las_brisas.security.JwtAuthFilter jwtAuthFilter;
    @MockBean
    private com.brisas.las_brisas.auth.service.CustomUserDetailsService customUserDetailsService;

    @Test
    void testGetAllAttendances() throws Exception {
        employee e = new employee();
        e.setId(1);

        attendance a1 = attendance.builder()
                .id(1)
                .date(LocalDate.of(2025, 1, 10))
                .time_start(LocalTime.of(8, 0))
                .time_end(LocalTime.of(17, 0))
                .status(attendance.status.presente)
                .employee(e)
                .build();

        attendance a2 = attendance.builder()
                .id(2)
                .date(LocalDate.of(2025, 1, 11))
                .time_start(LocalTime.of(9, 0))
                .time_end(LocalTime.of(18, 0))
                .status(attendance.status.ausente)
                .employee(e)
                .build();

        when(attendanceService.getAll()).thenReturn(List.of(a1, a2));

        mockMvc.perform(get("/api/v1/attendance/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status").value("presente"))
                .andExpect(jsonPath("$[1].status").value("ausente"));
    }

    @Test
    void testGetAttendanceById_Found() throws Exception {
        employee e = new employee();
        e.setId(1);

        attendance a1 = attendance.builder()
                .id(1)
                .date(LocalDate.of(2025, 1, 10))
                .time_start(LocalTime.of(8, 0))
                .time_end(LocalTime.of(17, 0))
                .status(attendance.status.presente)
                .employee(e)
                .build();

        when(attendanceService.findById(1)).thenReturn(Optional.of(a1));

        mockMvc.perform(get("/api/v1/attendance/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("presente"));
    }

    @Test
    void testGetAttendanceById_NotFound() throws Exception {
        when(attendanceService.findById(99)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/attendance/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Asistencia no encontrada"));
    }

    @Test
    void testSaveAttendance() throws Exception {
        attendanceDTO dto = attendanceDTO.builder()
                .id(1)
                .employee(1)
                .date(LocalDate.of(2025, 1, 10))
                .timeStart(LocalTime.of(8, 0))
                .timeEnd(LocalTime.of(17, 0))
                .status("presente")
                .build();

        ResponseDTO<attendanceDTO> response = new ResponseDTO<>("Asistencia guardada correctamente", "200", dto);

        when(attendanceService.save(any(attendanceDTO.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/attendance/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Asistencia guardada correctamente"));
    }

    @Test
    void testDeleteAttendance() throws Exception {
        ResponseDTO<Object> response = new ResponseDTO<>("Asistencia eliminada correctamente", "200", null);

        when(attendanceService.delete(1)).thenReturn((ResponseDTO) response);

        mockMvc.perform(delete("/api/v1/attendance/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Asistencia eliminada correctamente"));
    }
}
