package com.Brisas.Las_Brisas.contract;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.contract.contractDTO;
import com.brisas.las_brisas.controller.contract.ContractController;
import com.brisas.las_brisas.model.application.application.status;
import com.brisas.las_brisas.model.contract.contract;
import com.brisas.las_brisas.model.contract.contract.type;
import com.brisas.las_brisas.security.JwtService;
import com.brisas.las_brisas.service.contract.ContractService;
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
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = ContractController.class)
@AutoConfigureMockMvc(addFilters = false)
@ImportAutoConfiguration(exclude = {
        SecurityAutoConfiguration.class,
        SecurityFilterAutoConfiguration.class
})
@ActiveProfiles("test")
public class ContractControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ContractService contractService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private com.brisas.las_brisas.auth.service.CustomUserDetailsService customUserDetailsService;

    @Test
    void getAll_ShouldReturnListOfContracts() throws Exception {
        List<contractDTO> mockList = List.of(
                contractDTO.builder().id(1).type("Fijo").status("Activo").build(),
                contractDTO.builder().id(2).type("Temporal").status("Finalizado").build());

        Mockito.when(contractService.getAll()).thenReturn(mockList);

        mockMvc.perform(get("/api/v1/contracts/all")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].type").value("Fijo"))
                .andExpect(jsonPath("$[1].type").value("Temporal"));
    }

    @Test
    void getById_ShouldReturnContract_WhenFound() throws Exception {
        contract entity = contract.builder()
                .id(1)
                .type(contract.type.temporal)
                .status(contract.status.activo)
                .build();

        Mockito.when(contractService.findById(1)).thenReturn(Optional.of(entity));

        mockMvc.perform(get("/api/v1/contracts/1")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.type").value("temporal"));
    }

    @Test
    void getById_ShouldReturnNotFound_WhenNotExists() throws Exception {
        Mockito.when(contractService.findById(99)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/contracts/99")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Contrato no encontrado"));
    }

    @Test
    void createContract_ShouldReturnSuccessResponse() throws Exception {
        MockMultipartFile document = new MockMultipartFile(
                "document", "contrato.pdf", "application/pdf", "contenido".getBytes());

        contractDTO dto = contractDTO.builder()
                .id(1)
                .type("Fijo")
                .status("Activo")
                .build();

        ResponseDTO<contractDTO> mockResponse = new ResponseDTO<>(
                "Contrato creado correctamente",
                "200",
                dto);

        Mockito.when(contractService.saveWithDocument(any(contractDTO.class), any()))
                .thenReturn(mockResponse);

        mockMvc.perform(multipart("/api/v1/contracts")
                .file(document)
                .param("employeeId", "1")
                .param("dateStart", LocalDate.now().toString())
                .param("dateEnd", LocalDate.now().plusMonths(6).toString())
                .param("type", "Fijo")
                .param("status", "Activo")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Contrato creado correctamente"))
                .andExpect(jsonPath("$.data.type").value("Fijo"));
    }

    @Test
    void deleteContract_ShouldReturnSuccessResponse() throws Exception {
        ResponseDTO<contractDTO> mockResponse = new ResponseDTO<>(
                "Contrato eliminado correctamente",
                "200", 
                null);

        Mockito.when(contractService.delete(eq(1))).thenReturn(mockResponse);

        mockMvc.perform(delete("/api/v1/contracts/1")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Contrato eliminado correctamente"));
    }

    @Test
    void update_ShouldReturnUpdatedContract() throws Exception {
        contractDTO dto = contractDTO.builder()
                .id(1)
                .type("Fijo")
                .status("Renovado")
                .build();

        ResponseDTO<contractDTO> mockResponse = new ResponseDTO<>(
                "Contrato actualizado correctamente",
                HttpStatus.OK.toString(),
                dto);

        Mockito.when(contractService.save(any(contractDTO.class))).thenReturn(mockResponse);

        mockMvc.perform(put("/api/v1/contracts/1")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                            "type": "Fijo",
                            "status": "Renovado"
                        }
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Contrato actualizado correctamente"))
                .andExpect(jsonPath("$.data.status").value("Renovado"));
    }

}
