package com.brisas.las_brisas.service.user;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.user.rol_permitionDTO;
import com.brisas.las_brisas.model.user.permition;
import com.brisas.las_brisas.model.user.rol;
import com.brisas.las_brisas.model.user.rol_permition;
import com.brisas.las_brisas.repository.user.Irol_permition;
import com.brisas.las_brisas.repository.user.Irol;
import com.brisas.las_brisas.repository.user.Ipermition;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RolPermitionService {

    private final Irol_permition iRolPermition;
    private final Irol rolRepository;
    private final Ipermition permitionRepository;

    public List<rol_permition> getAll() {
        return iRolPermition.findAll();
    }

    public Optional<rol_permition> findById(int id) {
        return iRolPermition.findById(id);
    }

    public ResponseDTO<rol_permitionDTO> delete(int id) {
        Optional<rol_permition> entityOpt = findById(id);
        if (entityOpt.isEmpty()) {
            return new ResponseDTO<>("RolPermition no encontrado", HttpStatus.NOT_FOUND.toString(), null);
        }
        iRolPermition.deleteById(id);
        return new ResponseDTO<>("RolPermition eliminado correctamente", HttpStatus.OK.toString(),
                convertToDTO(entityOpt.get()));
    }

    public ResponseDTO<rol_permitionDTO> save(rol_permitionDTO dto) {
        try {
          
            if (dto.getRolId() <= 0) {
                return new ResponseDTO<>("El ID del rol es requerido y debe ser mayor a 0",
                        HttpStatus.BAD_REQUEST.toString(), null);
            }
            if (dto.getPermitionId() <= 0) {
                return new ResponseDTO<>("El ID del permiso es requerido y debe ser mayor a 0",
                        HttpStatus.BAD_REQUEST.toString(), null);
            }

            Optional<rol> rolOpt = rolRepository.findById(dto.getRolId());
            if (rolOpt.isEmpty()) {
                return new ResponseDTO<>("El rol no existe", HttpStatus.NOT_FOUND.toString(), null);
            }

            Optional<permition> permOpt = permitionRepository.findById(dto.getPermitionId());
            if (permOpt.isEmpty()) {
                return new ResponseDTO<>("El permiso no existe", HttpStatus.NOT_FOUND.toString(), null);
            }

            if (dto.getId() == 0 && iRolPermition.existsByRolIdAndPermisionId(dto.getRolId(), dto.getPermitionId())) {
                return new ResponseDTO<>("Ya existe esta relación rol-permiso", HttpStatus.CONFLICT.toString(), null);
            }

           
            rol_permition entity = convertToModel(dto, rolOpt.get(), permOpt.get());
            rol_permition saved = iRolPermition.save(entity);

            return new ResponseDTO<>("RolPermition guardado correctamente", HttpStatus.OK.toString(),
                    convertToDTO(saved));
        } catch (Exception e) {
            return new ResponseDTO<>("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.toString(), null);
        }
    }

    public List<rol_permition> findPermitionsByRolId(int rolId) {
        return iRolPermition.findByRolId(rolId);
    }

    public List<rol_permition> findRolesByPermitionId(int permitionId) {
        return iRolPermition.findByPermisionId(permitionId);
    }

    private rol_permition convertToModel(rol_permitionDTO dto, rol rol, permition permition) {
        return rol_permition.builder()
                .id(dto.getId())
                .rol(rol)
                .permision(permition)
                .build();
    }

    private rol_permitionDTO convertToDTO(rol_permition entity) {
        return rol_permitionDTO.builder()
                .id(entity.getId())
                .rolId(entity.getRol().getId())
                .permitionId(entity.getPermision().getId())
                .build();
    }
}
