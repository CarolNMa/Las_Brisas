package com.brisas.las_brisas.service.training;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.training.inductionDTO;
import com.brisas.las_brisas.model.training.induction;
import com.brisas.las_brisas.repository.training.Iinduction;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InductionService {

    private final Iinduction iinduction;

    public List<induction> getAll() {
        return iinduction.findAll();
    }

    public Optional<induction> findById(int id) {
        return iinduction.findById(id);
    }

    public ResponseDTO<inductionDTO> delete(int id) {
        Optional<induction> opt = iinduction.findById(id);
        if (opt.isEmpty()) {
            return new ResponseDTO<>("La inducción no existe", HttpStatus.NOT_FOUND.toString(), null);
        }
        iinduction.deleteById(id);
        return new ResponseDTO<>("Inducción eliminada correctamente", HttpStatus.OK.toString(), null);
    }

    public ResponseDTO<inductionDTO> save(inductionDTO dto) {
        try {
            induction entity = convertToEntity(dto);
            if (dto.getId() == 0) {
                entity.setDateCreate(LocalDateTime.now());
            } else {
                entity.setDateUpdate(LocalDateTime.now());
            }

            iinduction.save(entity);
            return new ResponseDTO<>(HttpStatus.OK.toString(), "Inducción guardada correctamente", convertToDTO(entity));
        } catch (Exception e) {
            return new ResponseDTO<>(HttpStatus.INTERNAL_SERVER_ERROR.toString(), "Error al guardar: " + e.getMessage(), null);
        }
    }

    private induction convertToEntity(inductionDTO dto) {
        induction.type t;
        try {
            t = induction.type.valueOf(dto.getType().toLowerCase());
        } catch (Exception e) {
            t = induction.type.induction;
        }

        induction.status s;
        try {
            s = induction.status.valueOf(dto.getStatus().toLowerCase());
        } catch (Exception e) {
            s = induction.status.pendiente;
        }

        return induction.builder()
                .id(dto.getId())
                .name(dto.getName())
                .description(dto.getDescription())
                .type(t)
                .status(s)
                .dateCreate(dto.getDateCreate())
                .dateUpdate(dto.getDateUpdate())
                .build();
    }

    private inductionDTO convertToDTO(induction entity) {
        return inductionDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .type(entity.getType().name())
                .status(entity.getStatus().name())
                .dateCreate(entity.getDateCreate())
                .dateUpdate(entity.getDateUpdate())
                .build();
    }
}
