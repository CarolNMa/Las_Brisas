package com.brisas.las_brisas.controller.training;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.training.answerDTO;
import com.brisas.las_brisas.service.training.AnswerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/answers")
@RequiredArgsConstructor
public class AnswerController {

    private final AnswerService answerService;

    // 🔹 ADMIN: Ver todas las respuestas
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(answerService.getAll());
    }

    // 🔹 EMPLEADO o ADMIN: Ver respuestas por pregunta
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO')")
    @GetMapping("/question/{questionId}")
    public ResponseEntity<?> getByQuestion(@PathVariable int questionId) {
        return ResponseEntity.ok(answerService.getAnswersByQuestion(questionId));
    }

    // 🔹 EMPLEADO o ADMIN: Ver una respuesta por ID
    @PreAuthorize("hasAnyRole('ADMIN','EMPLEADO')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable int id) {
        return answerService.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseDTO<>("Respuesta no encontrada", HttpStatus.NOT_FOUND.toString(), null)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> save(@RequestBody answerDTO dto) {
        ResponseDTO<?> response = answerService.save(dto);

        // Extraer solo el número si la cadena tiene "200 OK"
        HttpStatus status = HttpStatus.OK;
        try {
            String code = response.getStatus().split(" ")[0]; // 👈 toma solo "200"
            status = HttpStatus.resolve(Integer.parseInt(code));
        } catch (Exception e) {
            status = HttpStatus.OK;
        }

        return new ResponseEntity<>(response, status != null ? status : HttpStatus.OK);
    }

    // 🔹 ADMIN: Eliminar respuesta
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable int id) {
        ResponseDTO<?> response = answerService.delete(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
