package com.brisas.las_brisas.service.training;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.training.answerDTO;
import com.brisas.las_brisas.model.training.answer;
import com.brisas.las_brisas.repository.training.Ianswer;
import com.brisas.las_brisas.model.training.question;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AnswerService {

    private final Ianswer ianswer;

    public List<answer> getAll() {
        return ianswer.findAll();
    }

    public Optional<answer> findById(int id) {
        return ianswer.findById(id);
    }

    public List<answer> getAnswersByQuestion(int questionId) {
        return ianswer.findByQuestionId(questionId);
    }

    public ResponseDTO<answerDTO> delete(int id) {
        Optional<answer> opt = ianswer.findById(id);
        if (opt.isEmpty()) {
            return new ResponseDTO<>("La respuesta no existe", HttpStatus.NOT_FOUND.toString(), null);
        }
        ianswer.deleteById(id);
        return new ResponseDTO<>("Respuesta eliminada correctamente", HttpStatus.OK.toString(), null);
    }

    public ResponseDTO<answerDTO> save(answerDTO dto) {
        try {
            if (dto.getQuestionId() <= 0) {
                return new ResponseDTO<>("El ID de la pregunta es requerido", HttpStatus.BAD_REQUEST.toString(), null);
            }
            if (dto.getAnswer() == null || dto.getAnswer().trim().isEmpty()) {
                return new ResponseDTO<>("La respuesta no puede estar vacía", HttpStatus.BAD_REQUEST.toString(), null);
            }

            answer entity = convertToEntity(dto);
            ianswer.save(entity);

            return new ResponseDTO<>("Respuesta guardada correctamente", HttpStatus.OK.toString(),
                    convertToDTO(entity));
        } catch (Exception e) {
            return new ResponseDTO<>("Error al guardar: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.toString(),
                    null);
        }
    }

    private answer convertToEntity(answerDTO dto) {
        question q = new question();
        q.setId(dto.getQuestionId());

        return answer.builder()
                .id(dto.getId())
                .answer(dto.getAnswer())
                .response_correct(dto.isResponseCorrect())
                .question(q)
                .build();
    }

    private answerDTO convertToDTO(answer entity) {
        return answerDTO.builder()
                .id(entity.getId())
                .answer(entity.getAnswer())
                .responseCorrect(entity.isResponse_correct())
                .questionId(entity.getQuestion() != null ? entity.getQuestion().getId() : 0)
                .build();
    }
}
