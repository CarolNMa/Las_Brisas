package com.Brisas.Las_Brisas.employee;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.employee.resumeDTO;
import com.brisas.las_brisas.controller.employee.ResumeController;
import com.brisas.las_brisas.model.employee.resume;
import com.brisas.las_brisas.security.JwtService;
import com.brisas.las_brisas.service.employee.resumeService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.io.File;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ResumeController.class)
@ActiveProfiles("test")
@ImportAutoConfiguration(exclude = JwtService.class)
@AutoConfigureMockMvc(addFilters = false)
class ResumeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private resumeService resumeService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private com.brisas.las_brisas.auth.service.CustomUserDetailsService customUserDetailsService;

    @Test
    void getAllResumes_ShouldReturnListOfResumes() throws Exception {
        List<resumeDTO> list = List.of(
                resumeDTO.builder().id(1).employeeId(10).documentUrl("file1.pdf").observations("ok").build(),
                resumeDTO.builder().id(2).employeeId(20).documentUrl("file2.pdf").observations("none").build());

        Mockito.when(resumeService.getAllResumesDTO()).thenReturn(list);

        mockMvc.perform(get("/api/v1/resumes")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].employeeId").value(10))
                .andExpect(jsonPath("$[1].documentUrl").value("file2.pdf"));
    }

    @Test
    void downloadResume_ShouldReturnFile_WhenExists() throws Exception {
        File tempFile = File.createTempFile("test", ".pdf");
        resume res = resume.builder()
                .id(1)
                .document_url(tempFile.getAbsolutePath())
                .build();

        Mockito.when(resumeService.findById(1)).thenReturn(Optional.of(res));

        mockMvc.perform(get("/api/v1/resumes/1/download")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password")))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", org.hamcrest.Matchers.containsString(".pdf")));
    }

    @Test
    void getMyResume_ShouldReturnResume_WhenFound() throws Exception {
        resumeDTO dto = resumeDTO.builder()
                .id(3)
                .employeeId(2)
                .documentUrl("uploads/resumes/file.pdf")
                .observations("Archivo actualizado")
                .build();

        Mockito.when(resumeService.getResumeDTOByUserEmail("empleado@lasbrisas.com"))
                .thenReturn(Optional.of(dto));

        mockMvc.perform(get("/api/v1/resumes/me")
                .principal(new UsernamePasswordAuthenticationToken("empleado@lasbrisas.com", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.employeeId").value(2))
                .andExpect(jsonPath("$.documentUrl").value("uploads/resumes/file.pdf"));
    }

    @Test
    void getMyResume_ShouldReturnNotFound_WhenMissing() throws Exception {
        Mockito.when(resumeService.getResumeDTOByUserEmail("empleado@lasbrisas.com"))
                .thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/resumes/me")
                .principal(new UsernamePasswordAuthenticationToken("empleado@lasbrisas.com", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Hoja de vida no encontrada"));
    }

    @Test
    void uploadResume_ShouldReturnSuccessResponse() throws Exception {
        MockMultipartFile mockFile = new MockMultipartFile(
                "file", "cv.pdf", MediaType.APPLICATION_PDF_VALUE, "contenido".getBytes());

        Mockito.when(resumeService.existsEmployee(5)).thenReturn(true);

        resumeDTO dto = resumeDTO.builder()
                .id(1)
                .employeeId(5)
                .documentUrl("uploads/resumes/cv.pdf")
                .observations("correcto")
                .dateCreate(LocalDateTime.now())
                .build();

        ResponseDTO<resumeDTO> response = new ResponseDTO<>(
                "Hoja de vida subida correctamente",
                HttpStatus.OK.toString(),
                dto);

        Mockito.when(resumeService.save(any(resumeDTO.class))).thenReturn(response);

        mockMvc.perform(multipart("/api/v1/resumes/upload")
                .file(mockFile)
                .param("employeeId", "5")
                .param("observations", "correcto")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Hoja de vida subida correctamente"));
    }

    @Test
    void deleteResume_ShouldReturnSuccessResponse() throws Exception {
        ResponseDTO<resumeDTO> response = new ResponseDTO<>(
                "Eliminado correctamente",
                String.valueOf(HttpStatus.OK.value()),
                null);

        Mockito.when(resumeService.deleteResume(eq(1))).thenReturn(response);

        mockMvc.perform(delete("/api/v1/resumes/1")
                .principal(new UsernamePasswordAuthenticationToken("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Eliminado correctamente"));
    }

    @Test
    void updateResume_ShouldReturnSuccessResponse() throws Exception {
        MockMultipartFile mockFile = new MockMultipartFile(
                "file", "cv_nuevo.pdf", MediaType.APPLICATION_PDF_VALUE, "nuevo".getBytes());

        resumeDTO dto = resumeDTO.builder()
                .id(1)
                .employeeId(3)
                .documentUrl("uploads/resumes/cv_nuevo.pdf")
                .observations("actualizado")
                .dateUpdate(LocalDateTime.now())
                .build();

        ResponseDTO<resumeDTO> response = new ResponseDTO<>(
                "Actualizado correctamente",
                String.valueOf(HttpStatus.OK.value()), 
                dto);

        Mockito.when(resumeService.update(any(resumeDTO.class))).thenReturn(response);

        mockMvc.perform(multipart("/api/v1/resumes/1")
                .file(mockFile)
                .param("employeeId", "3")
                .param("observations", "actualizado")
                .with(request -> {
                    request.setMethod("PUT");
                    return request;
                })
                .principal(new UsernamePasswordAuthenticationToken("admin", "password")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Actualizado correctamente"));
    }
}
