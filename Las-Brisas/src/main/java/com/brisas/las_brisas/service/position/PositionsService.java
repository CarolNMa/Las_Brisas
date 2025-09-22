package com.brisas.las_brisas.service.position;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.position.positionsDTO;
import com.brisas.las_brisas.model.position.positions;
import com.brisas.las_brisas.repository.position.Ipositions;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PositionsService {

    private final Ipositions ipositions;

    public List<positions> getAll() {
        return ipositions.findAll();
    }

    public Optional<positions> findById(int id) {
        return ipositions.findById(id);
    }

    public ResponseDTO<positionsDTO> delete(int id) {
        Optional<positions> opt = ipositions.findById(id);
        if (opt.isEmpty()) {
            return new ResponseDTO<>("El puesto no existe", HttpStatus.NOT_FOUND.toString(), null);
        }
        ipositions.deleteById(id);
        return new ResponseDTO<>("Puesto eliminado correctamente", HttpStatus.OK.toString(), null);
    }

    public ResponseDTO<positionsDTO> save(positionsDTO dto) {
        try {
            if (dto.getNamePost() == null || dto.getNamePost().trim().isEmpty()) {
                return new ResponseDTO<>("El nombre del puesto es obligatorio", HttpStatus.BAD_REQUEST.toString(),
                        null);
            }
            if (dto.getDescription() == null || dto.getDescription().trim().isEmpty()) {
                return new ResponseDTO<>("La descripción es obligatoria", HttpStatus.BAD_REQUEST.toString(), null);
            }
            if (dto.getJobFunction() == null || dto.getJobFunction().trim().isEmpty()) {
                return new ResponseDTO<>("La función del puesto es obligatoria", HttpStatus.BAD_REQUEST.toString(),
                        null);
            }
            if (dto.getRequirements() == null || dto.getRequirements().trim().isEmpty()) {
                return new ResponseDTO<>("Los requisitos del puesto son obligatorios",
                        HttpStatus.BAD_REQUEST.toString(), null);
            }

            positions entity = convertToEntity(dto);
            ipositions.save(entity);

            return new ResponseDTO<>("Puesto guardado correctamente", HttpStatus.OK.toString(), convertToDTO(entity));
        } catch (Exception e) {
            return new ResponseDTO<>("Error al guardar: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR.toString(), null);
        }
    }

    private positions convertToEntity(positionsDTO dto) {
        return positions.builder()
                .id(dto.getId())
                .namePost(dto.getNamePost())
                .description(dto.getDescription())
                .jon_function(dto.getJobFunction())
                .requirements(dto.getRequirements())
                .build();
    }

    private positionsDTO convertToDTO(positions entity) {
        return positionsDTO.builder()
                .id(entity.getId())
                .namePost(entity.getNamePost())
                .description(entity.getDescription())
                .jobFunction(entity.getJon_function())
                .requirements(entity.getRequirements())
                .build();
    }
}
