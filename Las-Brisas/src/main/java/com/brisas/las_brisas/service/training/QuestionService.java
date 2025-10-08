package com.brisas.las_brisas.service.training;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.training.questionDTO;
import com.brisas.las_brisas.model.training.answer;
import com.brisas.las_brisas.model.training.moduleInduction;
import com.brisas.las_brisas.model.training.question;
import com.brisas.las_brisas.repository.training.Ianswer;
import com.brisas.las_brisas.repository.training.Imodule_induction;
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
    private final Ianswer ianswer;
    private final Imodule_induction imoduleInduction;

    public List<question> getAll() {
        return iquestion.findAll();
    }

    public Optional<question> findById(int id) {
        return iquestion.findById(id);
    }

    public List<questionDTO> getQuestionsByModule(int moduleId) {
        return iquestion.findByModuleInductionId(moduleId)
                .stream()
                .map(this::convertToDTO)
                .toList();
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
            if (dto.getQuestion() == null || dto.getQuestion().trim().isEmpty()) {
                return new ResponseDTO<>("La pregunta es obligatoria", HttpStatus.BAD_REQUEST.toString(), null);
            }

            Optional<moduleInduction> moduleOpt = imoduleInduction.findById(dto.getModuleInductionId());
            if (moduleOpt.isEmpty()) {
                return new ResponseDTO<>("El módulo no existe", HttpStatus.BAD_REQUEST.toString(), null);
            }

            question entity = convertToEntity(dto, moduleOpt.get());
            question saved = iquestion.save(entity);

            if (saved.getType() == question.type.TRUEFALSE) {
                if (ianswer.findByQuestionId(saved.getId()).isEmpty()) {
                    ianswer.save(answer.builder()
                            .answer("Verdadero")
                            .responseCorrect(true)
                            .question(saved)
                            .build());
                    ianswer.save(answer.builder()
                            .answer("Falso")
                            .responseCorrect(false)
                            .question(saved)
                            .build());
                }
            }

            return new ResponseDTO<>("Pregunta guardada correctamente", HttpStatus.OK.toString(),
                    convertToDTO(saved));

        } catch (Exception e) {
            return new ResponseDTO<>("Error al guardar: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR.toString(), null);
        }
    }

    private question convertToEntity(questionDTO dto, moduleInduction module) {
        question.type qType;
        try {
            qType = question.type.valueOf(dto.getType().toUpperCase());
        } catch (Exception e) {
            qType = question.type.MULTIPLECHOICE;
        }

        return question.builder()
                .id(dto.getId())
                .question(dto.getQuestion())
                .type(qType)
                .moduleInduction(module)
                .build();
    }

    public questionDTO convertToDTO(question entity) {
        return questionDTO.builder()
                .id(entity.getId())
                .question(entity.getQuestion())
                .type(entity.getType().name().toLowerCase())
                .moduleInductionId(entity.getModuleInduction() != null ? entity.getModuleInduction().getId() : 0)
                .build();
    }

}
