package com.brisas.las_brisas.service.user;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.user.userDTO;
import com.brisas.las_brisas.model.user.user;
import com.brisas.las_brisas.repository.user.Iuser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class userService {

    private final Iuser iUser;

    public List<user> getAllUsers() {
        return iUser.findAll();
    }

    public Optional<user> findById(int id) {
        return iUser.findById(id);
    }

    public ResponseDTO<userDTO> deleteUser(int id) {
        Optional<user> userOpt = findById(id);
        if (userOpt.isEmpty()) {
            return new ResponseDTO<>("El usuario no existe", HttpStatus.NOT_FOUND.toString(), null);
        }
        iUser.deleteById(id);
        return new ResponseDTO<>("Usuario eliminado correctamente", HttpStatus.OK.toString(), null);
    }

    public ResponseDTO<userDTO> save(userDTO dto) {
        try {

            if (!StringUtils.hasText(dto.getUsername())) {
                return new ResponseDTO<>(HttpStatus.BAD_REQUEST.toString(), "El username no puede ser vacío", null);
            }
            if (!StringUtils.hasText(dto.getEmail())) {
                return new ResponseDTO<>(HttpStatus.BAD_REQUEST.toString(), "El email no puede ser vacío", null);
            }

            user entity = convertToEntity(dto);
            if (dto.getIdUser() == 0) {
                entity.setCreatedAt(LocalDateTime.now());

                if (!StringUtils.hasText(entity.getPassword())) {
                    entity.setPassword("defaultPassword"); 
                }
            }

            iUser.save(entity);
            return new ResponseDTO<>(HttpStatus.OK.toString(), "Usuario guardado correctamente", convertToDTO(entity));

        } catch (Exception e) {
            return new ResponseDTO<>(HttpStatus.INTERNAL_SERVER_ERROR.toString(), "Error al guardar: " + e.getMessage(), null);
        }
    }

    private user convertToEntity(userDTO dto) {
        user.status userStatus;
        try {
            userStatus = user.status.valueOf(dto.getStatus().toLowerCase());
        } catch (Exception e) {
            userStatus = user.status.active;
        }

        return user.builder()
                .idUser(dto.getIdUser())
                .username(dto.getUsername())
                .email(dto.getEmail())
                .status(userStatus)
                .createdAt(dto.getCreatedAt() != null ? dto.getCreatedAt() : LocalDateTime.now())
                .build();
    }

    private userDTO convertToDTO(user entity) {
        return userDTO.builder()
                .idUser(entity.getIdUser())
                .username(entity.getUsername())
                .email(entity.getEmail())
                .status(entity.getStatus().name())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
