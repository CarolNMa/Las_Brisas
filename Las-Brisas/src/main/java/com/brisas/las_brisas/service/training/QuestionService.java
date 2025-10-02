package com.brisas.las_brisas.service.training;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.training.questionDTO;
import com.brisas.las_brisas.model.training.moduleInduction;
import com.brisas.las_brisas.model.training.question;
import com.brisas.las_brisas.repository.training.Iquestion;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final Iquestion iquestion;

    public List<question> getAll() {
        return iquestion.findAll();
    }

    public Optional<question> findById(int id) {
        return iquestion.findById(id);
    }

    public List<question> getQuestionsByModule(int moduleId) {
        return iquestion.findByModuleInductionId(moduleId);
    }

    public ResponseDTO<questionDTO> delete(int id) {
        Optional<question> opt = iquestion.findById(id);
        if (opt.isEmpty()) {
            return new ResponseDTO<>("La pregunta no existe", HttpStatus.NOT_FOUND.toString(), null);
        }
        iquestion.deleteById(id);
        return new ResponseDTO<>("Pregunta eliminada correctamente", HttpStatus.OK.toString(), null);
    }

    public ResponseDTO<questionDTO> save(questionDTO dto) {
        try {
            if (dto.getModuleInductionId() <= 0) {
                return new ResponseDTO<>("El ID del módulo de inducción es requerido",
                        HttpStatus.BAD_REQUEST.toString(), null);
            }
            if (dto.getQuestion() == null || dto.getQuestion().trim().isEmpty()) {
                return new ResponseDTO<>("La pregunta no puede estar vacía", HttpStatus.BAD_REQUEST.toString(), null);
            }

            question entity = convertToEntity(dto);
            iquestion.save(entity);

            return new ResponseDTO<>("Pregunta guardada correctamente", HttpStatus.OK.toString(), convertToDTO(entity));
        } catch (Exception e) {
            return new ResponseDTO<>("Error al guardar: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.toString(),
                    null);
        }
    }

    private question convertToEntity(questionDTO dto) {
        moduleInduction module = new moduleInduction();
        module.setId(dto.getModuleInductionId());

        question.type t;
        try {
            t = question.type.valueOf(dto.getType().toLowerCase());
        } catch (Exception e) {
            t = question.type.open; // valor por defecto
        }

        return question.builder()
                .id(dto.getId())
                .question(dto.getQuestion())
                .type(t)
                .moduleInduction(module)
                .build();
    }

    private questionDTO convertToDTO(question entity) {
        return questionDTO.builder()
                .id(entity.getId())
                .question(entity.getQuestion())
                .type(entity.getType().name())
                .moduleInductionId(entity.getModuleInduction() != null ? entity.getModuleInduction().getId() : 0)
                .build();
    }
}
