package com.brisas.las_brisas.controller.training;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.training.questionDTO;
import com.brisas.las_brisas.service.training.QuestionService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    // ADMIN: ver todas (en DTO)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<?> getAll() {
        List<questionDTO> list = questionService.getAll()
                .stream()
                .map(questionService::convertToDTO) // ✅ convertimos a DTO
                .toList();
        return ResponseEntity.ok(list);
    }

    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable int id) {
        return questionService.findById(id)
                .<ResponseEntity<?>>map(q -> ResponseEntity.ok(questionService.convertToDTO(q)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseDTO<>("Pregunta no encontrada", HttpStatus.NOT_FOUND.toString(), null)));
    }

    // ADMIN y EMPLEADO: ver preguntas por módulo (en DTO)
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO')")
    @GetMapping("/module/{moduleId}")
    public ResponseEntity<?> getByModule(@PathVariable int moduleId) {
        List<questionDTO> list = questionService.getQuestionsByModule(moduleId); // ✅ ya devuelve DTOs
        return ResponseEntity.ok(list);
    }

    // ADMIN: guardar
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> save(@RequestBody questionDTO dto) {
        ResponseDTO<?> response = questionService.save(dto);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // ADMIN: eliminar
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable int id) {
        ResponseDTO<?> response = questionService.delete(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
