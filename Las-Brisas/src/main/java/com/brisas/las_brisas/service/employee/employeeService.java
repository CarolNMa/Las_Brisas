package com.brisas.las_brisas.service.employee;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.employee.employeeDTO;
import com.brisas.las_brisas.model.employee.employee;
import com.brisas.las_brisas.model.user.user;
import com.brisas.las_brisas.repository.employee.Iemployee;
import com.brisas.las_brisas.repository.user.Iuser;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class employeeService {

    private final Iemployee iEmployee;
    private final Iuser userRepo;

    public List<employee> getAllEmployees() {
        return iEmployee.findAll();
    }

    public Optional<employee> findById(int id) {
        return iEmployee.findById(id);
    }

    public Optional<employee> findByEmail(String email) {
        return iEmployee.findByEmail(email);
    }

    public employee saveEntity(employee emp) {
        return iEmployee.save(emp);
    }

    public ResponseDTO<employeeDTO> deleteEmployee(int id) {
        Optional<employee> empOpt = findById(id);
        if (empOpt.isEmpty()) {
            return new ResponseDTO<>("El empleado no existe", HttpStatus.NOT_FOUND.toString(), null);
        }
        iEmployee.deleteById(id);
        return new ResponseDTO<>("Empleado eliminado correctamente", HttpStatus.OK.toString(), null);
    }

    public ResponseDTO<employeeDTO> save(employeeDTO dto) {
        try {
            if (!StringUtils.hasText(dto.getFirstName())) {
                return new ResponseDTO<>("El nombre no puede estar vacío", HttpStatus.BAD_REQUEST.toString(), null);
            }
            if (!StringUtils.hasText(dto.getLastName())) {
                return new ResponseDTO<>("El apellido no puede estar vacío", HttpStatus.BAD_REQUEST.toString(), null);
            }
            if (dto.getEmail() == null || !dto.getEmail().matches("^[A-Za-z0-9._%+-]+@gmail\\.com$")) {
                return new ResponseDTO<>("El email debe ser válido y pertenecer a Gmail.com",
                        HttpStatus.BAD_REQUEST.toString(), null);
            }
            if (dto.getPhone() == null || !dto.getPhone().matches("3[0-9]{9}")) {
                return new ResponseDTO<>("El teléfono debe empezar con 3 y tener 10 dígitos",
                        HttpStatus.BAD_REQUEST.toString(), null);
            }
            if (!StringUtils.hasText(dto.getDocumentNumber())) {
                return new ResponseDTO<>("El número de documento no puede estar vacío",
                        HttpStatus.BAD_REQUEST.toString(), null);
            }

            employee entity = convertToEntity(dto);
            if (dto.getId() == 0) {
                entity.setCreatedAt(LocalDateTime.now());
            }
            entity.setUpdatedAt(LocalDateTime.now());
            iEmployee.save(entity);

            return new ResponseDTO<>("Empleado guardado correctamente", HttpStatus.OK.toString(), convertToDTO(entity));
        } catch (Exception e) {
            return new ResponseDTO<>("Error al guardar: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.toString(),
                    null);
        }
    }

    private employee convertToEntity(employeeDTO dto) {
        employee.tipo_documento docType;
        try {
            docType = employee.tipo_documento.valueOf(dto.getTipoDocumento().toLowerCase());
        } catch (Exception e) {
            docType = employee.tipo_documento.cc;
        }

        employee.gender genderEnum;
        try {
            genderEnum = employee.gender.valueOf(dto.getGender().toLowerCase());
        } catch (Exception e) {
            genderEnum = employee.gender.other;
        }

        employee.civil_status civilStatusEnum;
        try {
            civilStatusEnum = employee.civil_status.valueOf(dto.getCivilStatus().toLowerCase());
        } catch (Exception e) {
            civilStatusEnum = employee.civil_status.single;
        }

        user u = null;
        if (dto.getUserId() != 0) {
            u = userRepo.findById(dto.getUserId())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id " + dto.getUserId()));
        } else {
            throw new RuntimeException("El empleado debe estar vinculado a un usuario existente");
        }

        return employee.builder()
                .id(dto.getId())
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .tipoDocumento(docType)
                .documentNumber(dto.getDocumentNumber())
                .birthdate(dto.getBirthdate())
                .photoProfile(dto.getPhotoProfile())
                .gender(genderEnum)
                .phone(dto.getPhone())
                .email(dto.getEmail())
                .civilStatus(civilStatusEnum)
                .address(dto.getAddress())
                .createdAt(dto.getCreatedAt())
                .updatedAt(dto.getUpdatedAt())
                .user(u)
                .build();

    }

    private employeeDTO convertToDTO(employee entity) {
        return employeeDTO.builder()
                .id(entity.getId())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .tipoDocumento(entity.getTipoDocumento().name())
                .documentNumber(entity.getDocumentNumber())
                .birthdate(entity.getBirthdate())
                .photoProfile(entity.getPhotoProfile())
                .gender(entity.getGender().name())
                .phone(entity.getPhone())
                .email(entity.getEmail())
                .civilStatus(entity.getCivilStatus().name())
                .address(entity.getAddress())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .userId(entity.getUser() != null ? entity.getUser().getIdUser() : 0)
                .build();
    }
}
