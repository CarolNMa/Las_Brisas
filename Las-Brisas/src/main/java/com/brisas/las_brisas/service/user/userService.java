package com.brisas.las_brisas.service.user;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.user.userDTO;
import com.brisas.las_brisas.model.user.user;
import com.brisas.las_brisas.repository.user.Iuser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

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

    public Optional<user> findByEmail(String email) {
        return iUser.findByEmail(email);
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
            if (dto.getUsername() == null || dto.getUsername().trim().isEmpty()) {
                return new ResponseDTO<>("El username no puede estar vacío", HttpStatus.BAD_REQUEST.toString(), null);
            }
            if (dto.getEmail() == null || !dto.getEmail().matches("^[A-Za-z0-9._%+-]+@gmail\\.com$")) {
                return new ResponseDTO<>("El email debe ser válido y pertenecer a Gmail.com",
                        HttpStatus.BAD_REQUEST.toString(), null);
            }
            if (dto.getIdUser() == 0 && (dto.getPassword() == null || dto.getPassword().length() < 8)) {
                return new ResponseDTO<>("La contraseña debe tener al menos 8 caracteres",
                        HttpStatus.BAD_REQUEST.toString(), null);
            }

            user entity = convertToEntity(dto);
            if (dto.getIdUser() == 0) {
                entity.setCreatedAt(LocalDateTime.now());
            }
            iUser.save(entity);

            return new ResponseDTO<>("Usuario guardado correctamente", HttpStatus.OK.toString(), convertToDTO(entity));
        } catch (Exception e) {
            return new ResponseDTO<>("Error al guardar: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.toString(),
                    null);
        }
    }

    private user convertToEntity(userDTO dto) {

        user.status userStatus;

        if (dto.getIdUser() == 0) {
            userStatus = user.status.active;
        } else {
            userStatus = user.status.inactive;
        }

        return user.builder()
                .idUser(dto.getIdUser())
                .username(dto.getUsername())
                .email(dto.getEmail())
                .password(dto.getPassword())
                .status(userStatus)
                .createdAt(dto.getIdUser() == 0 ? LocalDateTime.now() : null)
                .build();
    }

    private userDTO convertToDTO(user entity) {
        return userDTO.builder()
                .idUser(entity.getIdUser())
                .username(entity.getUsername())
                .email(entity.getEmail())
                .password(entity.getPassword())
                .build();
    }
}
