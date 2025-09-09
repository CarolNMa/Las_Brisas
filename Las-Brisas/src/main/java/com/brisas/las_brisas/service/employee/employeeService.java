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

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class employeeService {

    private final Iemployee iEmployee;

    public List<employee> getAllEmployees() {
        return iEmployee.findAll();
    }

    public Optional<employee> findById(int id) {
        return iEmployee.findById(id);
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
                return new ResponseDTO<>(HttpStatus.BAD_REQUEST.toString(), "El nombre no puede estar vacío", null);
            }
            if (!StringUtils.hasText(dto.getLastName())) {
                return new ResponseDTO<>(HttpStatus.BAD_REQUEST.toString(), "El apellido no puede estar vacío", null);
            }

            employee entity = convertToEntity(dto);
            if (dto.getId() == 0) {
                entity.setCreatedAt(LocalDateTime.now());
            } else {
                entity.setUpdatedAt(LocalDateTime.now());
            }

            iEmployee.save(entity);
            return new ResponseDTO<>(HttpStatus.OK.toString(), "Empleado guardado correctamente", convertToDTO(entity));

        } catch (Exception e) {
            return new ResponseDTO<>(HttpStatus.INTERNAL_SERVER_ERROR.toString(), "Error al guardar: " + e.getMessage(),
                    null);
        }
    }

    private employee convertToEntity(employeeDTO dto) {
        employee.tipo_documento docType;
        try {
            docType = employee.tipo_documento.valueOf(dto.getTipoDocumento().toUpperCase());
        } catch (Exception e) {
            docType = employee.tipo_documento.cc;
        }

        employee.gender genderEnum;
        try {
            genderEnum = employee.gender.valueOf(dto.getGender().toUpperCase());
        } catch (Exception e) {
            genderEnum = employee.gender.other;
        }

        employee.civil_status civilStatusEnum;
        try {
            civilStatusEnum = employee.civil_status.valueOf(dto.getCivilStatus().toUpperCase());
        } catch (Exception e) {
            civilStatusEnum = employee.civil_status.single;
        }

        user u = new user();
        u.setIdUser(dto.getUserId());

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
                .createdAt(dto.getCreatedAt() != null ? dto.getCreatedAt() : LocalDateTime.now())
                .updatedAt(dto.getUpdatedAt())
                .user(u)
                .build();
    }

    private employeeDTO convertToDTO(employee entity) {
        return employeeDTO.builder()
                .id(entity.getId())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .tipoDocumento(entity.getTipoDocumento().name()) // enum → string
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
                .userId(0)
                .build();
    }
}
