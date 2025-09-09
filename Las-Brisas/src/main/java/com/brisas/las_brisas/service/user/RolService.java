package com.brisas.las_brisas.service.user;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.user.rolDTO;
import com.brisas.las_brisas.model.user.rol;
import com.brisas.las_brisas.repository.user.Irol;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RolService {

    private final Irol iRol;

    public List<rol> getAllRoles() {
        return iRol.findAll();
    }

    public Optional<rol> findById(int id) {
        return iRol.findById(id);
    }

    public ResponseDTO<rolDTO> deleteRole(int id) {
        Optional<rol> opt = findById(id);
        if (opt.isEmpty()) {
            return new ResponseDTO<>("El rol no existe", HttpStatus.NOT_FOUND.toString(), null);
        }
        iRol.deleteById(id);
        return new ResponseDTO<>("Rol eliminado correctamente", HttpStatus.OK.toString(), null);
    }

    public ResponseDTO<rolDTO> save(rolDTO dto) {
        try {
            if (!StringUtils.hasText(dto.getName())) {
                return new ResponseDTO<>(HttpStatus.BAD_REQUEST.toString(), "El nombre no puede ser nulo", null);
            }
            if (!StringUtils.hasText(dto.getDescription())) {
                return new ResponseDTO<>(HttpStatus.BAD_REQUEST.toString(), "La descripción no puede ser nula", null);
            }

            rol entity = convertToEntity(dto);
            iRol.save(entity);

            return new ResponseDTO<>(HttpStatus.OK.toString(), "Rol guardado correctamente", convertToDTO(entity));

        } catch (Exception e) {
            return new ResponseDTO<>(HttpStatus.INTERNAL_SERVER_ERROR.toString(), "Error al guardar: " + e.getMessage(), null);
        }
    }

    private rol convertToEntity(rolDTO dto) {
        return rol.builder()
                .id(dto.getId())
                .name(dto.getName())
                .description(dto.getDescription())
                .build();
    }

    private rolDTO convertToDTO(rol entity) {
        return rolDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .build();
    }
}
