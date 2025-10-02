package com.brisas.las_brisas.controller.training;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.training.questionDTO;
import com.brisas.las_brisas.service.training.QuestionService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/question")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    // ADMIN: ver todas
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(questionService.getAll());
    }

    // EMPLEADO y ADMIN: ver una
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable int id) {
        return questionService.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseDTO<>("Pregunta no encontrada", HttpStatus.NOT_FOUND.toString(), null)));
    }

    // ADMIN y EMPLEADO: ver preguntas por módulo
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO')")
    @GetMapping("/module/{moduleId}")
    public ResponseEntity<?> getByModule(@PathVariable int moduleId) {
        return ResponseEntity.ok(questionService.getQuestionsByModule(moduleId));
    }

    // ADMIN: guardar
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/")
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
