package com.brisas.Las_Brisas.training;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.training.questionDTO;
import com.brisas.las_brisas.service.training.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/question")
@RequiredArgsConstructor
public class QuestionControllerTest {

    private final QuestionService questionService;

    @GetMapping("/")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(questionService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable int id) {
        return questionService.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseDTO<>("Pregunta no encontrada", HttpStatus.NOT_FOUND.toString(), null)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable int id) {
        ResponseDTO<?> response = questionService.delete(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/")
    public ResponseEntity<?> save(@RequestBody questionDTO dto) {
        ResponseDTO<?> response = questionService.save(dto);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
