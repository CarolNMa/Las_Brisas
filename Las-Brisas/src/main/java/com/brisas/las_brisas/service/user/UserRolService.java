package com.brisas.las_brisas.service.user;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.user.user_rolDTO;
import com.brisas.las_brisas.model.user.rol;
import com.brisas.las_brisas.model.user.user;
import com.brisas.las_brisas.model.user.user_rol;
import com.brisas.las_brisas.repository.user.Iuser;
import com.brisas.las_brisas.repository.user.Irol;
import com.brisas.las_brisas.repository.user.Iuser_rol;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserRolService {

    private final Iuser_rol userRolRepository;
    private final Iuser userRepository;
    private final Irol rolRepository;

    public List<user_rol> getAllUserRoles() {
        return userRolRepository.findAll();
    }

    public Optional<user_rol> findById(int id) {
        return userRolRepository.findById(id);
    }

    public ResponseDTO<user_rolDTO> deleteUserRol(int id) {
        Optional<user_rol> userRolOpt = findById(id);
        if (userRolOpt.isEmpty()) {
            return new ResponseDTO<>("La relación usuario-rol no existe", HttpStatus.NOT_FOUND.toString(), null);
        }
        userRolRepository.deleteById(id);
        return new ResponseDTO<>("La relación usuario-rol ha sido eliminada correctamente", HttpStatus.OK.toString(), null);
    }

    public ResponseDTO<user_rolDTO> save(user_rolDTO dto) {
        try {
            if (dto.getIdUser() <= 0) {
                return new ResponseDTO<>("El ID del usuario es requerido y debe ser mayor a 0", HttpStatus.BAD_REQUEST.toString(), null);
            }
            if (dto.getIdRol() <= 0) {
                return new ResponseDTO<>("El ID del rol es requerido y debe ser mayor a 0", HttpStatus.BAD_REQUEST.toString(), null);
            }

            Optional<user> userOpt = userRepository.findById(dto.getIdUser());
            if (userOpt.isEmpty()) {
                return new ResponseDTO<>("El usuario no existe", HttpStatus.NOT_FOUND.toString(), null);
            }

            Optional<rol> rolOpt = rolRepository.findById(dto.getIdRol());
            if (rolOpt.isEmpty()) {
                return new ResponseDTO<>("El rol no existe", HttpStatus.NOT_FOUND.toString(), null);
            }

            if (dto.getId() == 0 && userRolRepository.existsByUserIdUserAndRolId(dto.getIdUser(), dto.getIdRol())) {
                return new ResponseDTO<>("Ya existe esta relación usuario-rol", HttpStatus.CONFLICT.toString(), null);
            }

            user_rol entity = convertToEntity(dto, userOpt.get(), rolOpt.get());
            user_rol savedEntity = userRolRepository.save(entity);

            return new ResponseDTO<>("Relación usuario-rol guardada correctamente", HttpStatus.OK.toString(), convertToDTO(savedEntity));

        } catch (Exception e) {
            return new ResponseDTO<>("Error al guardar: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.toString(), null);
        }
    }

    public List<user_rol> findRolesByUserId(int userId) {
        return userRolRepository.findByUserIdUser(userId);
    }

    public List<user_rol> findUsersByRolId(int rolId) {
        return userRolRepository.findByRolId(rolId);
    }

    public ResponseDTO<user_rolDTO> assignRoleToUser(int userId, int rolId) {
        user_rolDTO dto = new user_rolDTO();
        dto.setIdUser(userId);
        dto.setIdRol(rolId);
        return save(dto);
    }

    public ResponseDTO<user_rolDTO> removeRoleFromUser(int userId, int rolId) {
        Optional<user_rol> userRolOpt = userRolRepository.findByUserIdUserAndRolId(userId, rolId);
        if (userRolOpt.isEmpty()) {
            return new ResponseDTO<>("La relación usuario-rol no existe", HttpStatus.NOT_FOUND.toString(), null);
        }
        userRolRepository.delete(userRolOpt.get());
        return new ResponseDTO<>("Rol removido del usuario correctamente", HttpStatus.OK.toString(), null);
    }

    public boolean existsUserRolRelation(int userId, int rolId) {
        return userRolRepository.existsByUserIdUserAndRolId(userId, rolId);
    }

    private user_rol convertToEntity(user_rolDTO dto, user user, rol rol) {
        return user_rol.builder()
                .id(dto.getId())
                .user(user)
                .rol(rol)
                .build();
    }

    private user_rolDTO convertToDTO(user_rol entity) {
        return user_rolDTO.builder()
                .id(entity.getId())
                .idUser(entity.getUser().getIdUser())
                .idRol(entity.getRol().getId())
                .build();
    }
}
