package com.Brisas.Las_Brisas.attendance;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.attendance.attendanceDTO;
import com.brisas.las_brisas.controller.attendance.AttendanceController;
import com.brisas.las_brisas.model.attendance.attendance;
import com.brisas.las_brisas.security.JwtService;
import com.brisas.las_brisas.service.attendance.AttendanceService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = AttendanceController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
@ImportAutoConfiguration(exclude = com.brisas.las_brisas.LasBrisasApplication.class)
class AttendanceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AttendanceService attendanceService;

    @MockBean
    private JwtService jwtServices;

    @MockBean
    private com.brisas.las_brisas.auth.service.CustomUserDetailsService customUserDetailsService;

    @MockBean
    private com.brisas.las_brisas.repository.user.Irol rolRepository;

    @MockBean
    private com.brisas.las_brisas.repository.user.Iuser userRepository;

    @MockBean
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Test
    void getAll_ReturnsOk() throws Exception {
        Mockito.when(attendanceService.getAll()).thenReturn(List.of());
        mockMvc.perform(get("/api/v1/attendance/all"))
                .andExpect(status().isOk());
    }

    @Test
    void getById_ReturnsRecord_WhenExists() throws Exception {
        Mockito.when(attendanceService.findById(1))
                .thenReturn(Optional.of(new attendance()));
        mockMvc.perform(get("/api/v1/attendance/1"))
                .andExpect(status().isOk());
    }

    @Test
    void getById_ReturnsNotFound_WhenMissing() throws Exception {
        Mockito.when(attendanceService.findById(99))
                .thenReturn(java.util.Optional.empty());
        mockMvc.perform(get("/api/v1/attendance/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void registerAttendance_ReturnsOk() throws Exception {
        attendanceDTO mockAttendance = new attendanceDTO();
        mockAttendance.setId(1);
        mockAttendance.setEmployee(1);

        Mockito.when(attendanceService.registerAttendance(any(String.class), any(String.class)))
                .thenReturn(mockAttendance);

        var auth = new UsernamePasswordAuthenticationToken("empleado@lasbrisas.com", null);

        mockMvc.perform(post("/api/v1/attendance/register")
                .principal(auth)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"type\":\"ENTRADA\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.employee").value(1));
    }

    @Test
    void createAttendance_ReturnsOk() throws Exception {
        Mockito.when(attendanceService.save(any(attendanceDTO.class)))
                .thenReturn(new ResponseDTO<>("Creado exitosamente", "200", new attendanceDTO()));
        mockMvc.perform(post("/api/v1/attendance")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"employeeId\":1,\"type\":\"ENTRADA\"}"))
                .andExpect(status().isOk());
    }

    @Test
    void updateAttendance_ReturnsOk() throws Exception {
        Mockito.when(attendanceService.save(any(attendanceDTO.class)))
                .thenReturn(new ResponseDTO<>("Actualizado correctamente", "200", new attendanceDTO()));

        mockMvc.perform(put("/api/v1/attendance/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"id\":1,\"employeeId\":1}"))
                .andExpect(status().isOk());
    }

    @Test
    void deleteAttendance_ReturnsOk() throws Exception {
        Mockito.when(attendanceService.delete(1))
                .thenReturn(new ResponseDTO<>("Eliminado correctamente", HttpStatus.OK.toString(), null));

        mockMvc.perform(delete("/api/v1/attendance/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Eliminado correctamente"))
                .andExpect(jsonPath("$.status").value("200 OK")) 
                .andExpect(jsonPath("$.data").isEmpty());
    }

}
