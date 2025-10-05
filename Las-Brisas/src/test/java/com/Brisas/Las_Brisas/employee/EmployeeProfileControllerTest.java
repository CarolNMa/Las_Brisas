package com.Brisas.Las_Brisas.employee;

import com.brisas.las_brisas.DTO.employee.EmployeePersonalUpdateDTO;
import com.brisas.las_brisas.DTO.employee.EmployeeProfileDTO;
import com.brisas.las_brisas.model.user.user;
import com.brisas.las_brisas.repository.user.Iuser;
import com.brisas.las_brisas.security.JwtService;
import com.brisas.las_brisas.service.employee.employeeProfileService;
import com.brisas.las_brisas.controller.employee.EmployeeProfileController;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EmployeeProfileController.class)
@AutoConfigureMockMvc(addFilters = false)
@ImportAutoConfiguration(exclude = JwtService.class)
@ActiveProfiles("test")
class EmployeeProfileControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private employeeProfileService employeeProfileService;

    @MockBean
    private Iuser userRepo;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private com.brisas.las_brisas.auth.service.CustomUserDetailsService customUserDetailsService;

    @Test
    void getMyProfile_ShouldReturnEmployeeProfile() throws Exception {
        Authentication auth = new UsernamePasswordAuthenticationToken("empleado@lasbrisas.com", "password");

        user fakeUser = new user();
        fakeUser.setIdUser(5);
        fakeUser.setEmail("empleado@lasbrisas.com");

        EmployeeProfileDTO profile = EmployeeProfileDTO.builder()
                .id(1)
                .firstName("Ana")
                .lastName("Gómez")
                .email("empleado@lasbrisas.com")
                .phone("3201234567")
                .tipoDocumento("CC")
                .documentNumber("12345")
                .birthdate(LocalDate.of(1995, 5, 20))
                .address("Calle 10 #20-30")
                .areas(java.util.List.of("Administración"))
                .cargos(java.util.List.of("Asistente"))
                .build();

        Mockito.when(userRepo.findByEmail("empleado@lasbrisas.com")).thenReturn(Optional.of(fakeUser));
        Mockito.when(employeeProfileService.getFullProfile(5)).thenReturn(profile);

        mockMvc.perform(get("/api/v1/employees/me")
                .principal(auth)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("Ana"))
                .andExpect(jsonPath("$.lastName").value("Gómez"))
                .andExpect(jsonPath("$.areas[0]").value("Administración"));
    }

    @Test
    void updateMyProfile_ShouldUpdateAndReturnProfile() throws Exception {
        Authentication auth = new UsernamePasswordAuthenticationToken("empleado@lasbrisas.com", "password");

        user fakeUser = new user();
        fakeUser.setIdUser(5);
        fakeUser.setEmail("empleado@lasbrisas.com");

        EmployeePersonalUpdateDTO updateDTO = new EmployeePersonalUpdateDTO();
        updateDTO.setPhone("3209998888");
        updateDTO.setAddress("ana.actualizada@lasbrisas.com");
        updateDTO.setAddress("Carrera 15 #5-12");

        EmployeeProfileDTO updatedProfile = EmployeeProfileDTO.builder()
                .id(1)
                .firstName("Ana")
                .lastName("Gómez")
                .email("ana.actualizada@lasbrisas.com")
                .phone("3209998888")
                .address("Carrera 15 #5-12")
                .areas(java.util.List.of("Administración"))
                .cargos(java.util.List.of("Asistente"))
                .build();

        // Mocks
        Mockito.when(userRepo.findByEmail("empleado@lasbrisas.com")).thenReturn(Optional.of(fakeUser));
        Mockito.doNothing().when(employeeProfileService).updatePersonalInfo(eq(5),
                any(EmployeePersonalUpdateDTO.class));
        Mockito.when(employeeProfileService.getFullProfile(5)).thenReturn(updatedProfile);

        String json = """
                {
                  "phone": "3209998888",
                  "email": "ana.actualizada@lasbrisas.com",
                  "address": "Carrera 15 #5-12"
                }
                """;

        mockMvc.perform(put("/api/v1/employees/me")
                .principal(auth)
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("ana.actualizada@lasbrisas.com"))
                .andExpect(jsonPath("$.phone").value("3209998888"))
                .andExpect(jsonPath("$.address").value("Carrera 15 #5-12"));
    }
}
