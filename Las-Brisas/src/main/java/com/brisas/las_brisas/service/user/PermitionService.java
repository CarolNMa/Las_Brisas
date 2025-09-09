package com.brisas.las_brisas.service.user;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.user.permitionDTO;
import com.brisas.las_brisas.model.user.permition;
import com.brisas.las_brisas.repository.user.Ipermition;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PermitionService {

    private final Ipermition iPermition;

    public List<permition> getAllPermitions() {
        return iPermition.findAll();
    }

    public Optional<permition> findById(int id) {
        return iPermition.findById(id);
    }

    public ResponseDTO<permitionDTO> deletePermition(int id) {
        Optional<permition> permOpt = findById(id);
        if (permOpt.isEmpty()) {
            return new ResponseDTO<>("Permiso no existe", HttpStatus.NOT_FOUND.toString(), null);
        }
        iPermition.deleteById(id);
        return new ResponseDTO<>("Permiso eliminado correctamente", HttpStatus.OK.toString(), convertToDTO(permOpt.get()));
    }

    public ResponseDTO<permitionDTO> save(permitionDTO dto) {
        try {
            if (!StringUtils.hasText(dto.getName())) {
                return new ResponseDTO<>("El nombre del permiso no puede estar vacío", HttpStatus.BAD_REQUEST.toString(), null);
            }
            if (!StringUtils.hasText(dto.getDescription())) {
                return new ResponseDTO<>("La descripción no puede estar vacía", HttpStatus.BAD_REQUEST.toString(), null);
            }

            permition entity;
            if (dto.getId() == 0) {

                entity = convertToModel(dto);
            } else {

                Optional<permition> existing = iPermition.findById(dto.getId());
                if (existing.isEmpty()) {
                    return new ResponseDTO<>("Permiso no encontrado", HttpStatus.NOT_FOUND.toString(), null);
                }
                entity = convertToModel(dto);
            }

            permition saved = iPermition.save(entity);
            return new ResponseDTO<>("Permiso guardado correctamente", HttpStatus.OK.toString(), convertToDTO(saved));

        } catch (Exception e) {
            return new ResponseDTO<>("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.toString(), null);
        }
    }

    private permitionDTO convertToDTO(permition entity) {
        return permitionDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .build();
    }


    private permition convertToModel(permitionDTO dto) {
        return permition.builder()
                .id(dto.getId())
                .name(dto.getName())
                .description(dto.getDescription())
                .build();
    }
}
