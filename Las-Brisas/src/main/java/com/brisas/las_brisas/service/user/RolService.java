package com.brisas.las_brisas.service.user;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.user.rolDTO;
import com.brisas.las_brisas.model.user.rol;
import com.brisas.las_brisas.repository.user.Irol;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

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
            if (dto.getName() == null || dto.getName().trim().isEmpty()) {
                return new ResponseDTO<>("El nombre no puede estar vacío", HttpStatus.BAD_REQUEST.toString(), null);
            }
            if (dto.getName().length() < 3) {
                return new ResponseDTO<>("El nombre del rol debe tener al menos 3 caracteres",
                        HttpStatus.BAD_REQUEST.toString(), null);
            }
            if (dto.getDescription() == null || dto.getDescription().trim().isEmpty()) {
                return new ResponseDTO<>("La descripción no puede estar vacía", HttpStatus.BAD_REQUEST.toString(),
                        null);
            }
            if (dto.getDescription().length() > 200) {
                return new ResponseDTO<>("La descripción no puede superar 200 caracteres",
                        HttpStatus.BAD_REQUEST.toString(), null);
            }

            rol entity = convertToEntity(dto);
            iRol.save(entity);

            return new ResponseDTO<>("Rol guardado correctamente", HttpStatus.OK.toString(), convertToDTO(entity));
        } catch (Exception e) {
            return new ResponseDTO<>("Error al guardar: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.toString(),
                    null);
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
