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
            positions entity = convertToEntity(dto);
            ipositions.save(entity);
            return new ResponseDTO<>(HttpStatus.OK.toString(), "Puesto guardado correctamente", convertToDTO(entity));
        } catch (Exception e) {
            return new ResponseDTO<>(HttpStatus.INTERNAL_SERVER_ERROR.toString(), "Error al guardar: " + e.getMessage(), null);
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
