package com.brisas.Las_Brisas.contract;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.contract.contractDTO;
import com.brisas.las_brisas.controller.contract.ContractController;
import com.brisas.las_brisas.model.contract.contract;
import com.brisas.las_brisas.model.employee.employee;
import com.brisas.las_brisas.service.contract.ContractService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ContractController.class)
@AutoConfigureMockMvc(addFilters = false)
class ContractControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ContractService contractService;

    // ⚡ mocks de seguridad (si los exige tu proyecto)
    @MockBean
    private com.brisas.las_brisas.security.JwtAuthFilter jwtAuthFilter;
    @MockBean
    private com.brisas.las_brisas.auth.service.CustomUserDetailsService customUserDetailsService;

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetAllContracts() throws Exception {
        employee e = new employee();
        e.setId(1);

        contract c1 = contract.builder()
                .id(1)
                .fechaInicio(LocalDateTime.of(2025, 1, 10, 0, 0))
                .fechaFin(LocalDateTime.of(2025, 12, 11, 0, 0))
                .type(contract.type.temporal)
                .status(contract.status.activo)
                .employee(e)
                .build();

        when(contractService.getAll()).thenReturn(List.of(c1));

        mockMvc.perform(get("/api/v1/contracts/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetContractById_Found() throws Exception {
        employee e = new employee();
        e.setId(1);

        contract c1 = contract.builder()
                .id(1)
                .fechaInicio(LocalDateTime.of(2025, 1, 10, 0, 0))
                .fechaFin(LocalDateTime.of(2025, 12, 11, 0, 0))
                .type(contract.type.permanente)
                .status(contract.status.activo)
                .employee(e)
                .build();

        when(contractService.findById(1)).thenReturn(Optional.of(c1));

        mockMvc.perform(get("/api/v1/contracts/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetContractById_NotFound() throws Exception {
        when(contractService.findById(99)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/contracts/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Contrato no encontrado"));
    }

    // @Test
    // void testGetMyContract_Found() throws Exception {
    //     employee e = new employee();
    //     e.setId(1);

    //     contract c1 = contract.builder()
    //             .id(1)
    //             .fechaInicio(LocalDateTime.of(2025, 1, 10, 0, 0))
    //             .fechaFin(LocalDateTime.of(2025, 12, 11, 0, 0))
    //             .type(contract.type.permanente)
    //             .status(contract.status.activo)
    //             .employee(e)
    //             .build();

    //     when(contractService.findByUserEmail("empleado@test.com"))
    //             .thenReturn(Optional.of(c1));

    //     mockMvc.perform(get("/api/v1/contracts/me")
    //             .with(user("empleado@test.com").roles("EMPLEADO"))) 
    //             .andExpect(status().isOk())
    //             .andExpect(jsonPath("$.id").value(1));
    // }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testSaveContract() throws Exception {
        contractDTO dto = contractDTO.builder()
                .id(1)
                .employee(1)
                .dateStart(LocalDateTime.of(2025, 1, 11, 0, 0))
                .dateEnd(LocalDateTime.of(2025, 12, 11, 0, 0))
                .type("fijo")
                .status("activo")
                .build();

        ResponseDTO<contractDTO> response = new ResponseDTO<>("Contrato guardado correctamente", "200", dto);

        when(contractService.save(any(contractDTO.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/contracts/")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Contrato guardado correctamente"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testDeleteContract() throws Exception {
        ResponseDTO<Object> response = new ResponseDTO<>("Contrato eliminado correctamente", "200", null);

        when(contractService.delete(1)).thenReturn((ResponseDTO) response);

        mockMvc.perform(delete("/api/v1/contracts/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Contrato eliminado correctamente"));
    }
}
