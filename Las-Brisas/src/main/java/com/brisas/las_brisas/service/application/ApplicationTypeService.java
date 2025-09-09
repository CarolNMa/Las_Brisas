package com.brisas.las_brisas.service.application;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.application.application_typeDTO;
import com.brisas.las_brisas.model.application.application_type;
import com.brisas.las_brisas.repository.application.Iapplication_type;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ApplicationTypeService {

    private final Iapplication_type iapplication_type;

    public List<application_type> getAll() {
        return iapplication_type.findAll();
    }

    public Optional<application_type> findById(int id) {
        return iapplication_type.findById(id);
    }

    public ResponseDTO<application_typeDTO> delete(int id) {
        Optional<application_type> opt = iapplication_type.findById(id);
        if (opt.isEmpty()) {
            return new ResponseDTO<>("El tipo de solicitud no existe", HttpStatus.NOT_FOUND.toString(), null);
        }
        iapplication_type.deleteById(id);
        return new ResponseDTO<>("Tipo de solicitud eliminado", HttpStatus.OK.toString(), null);
    }

    public ResponseDTO<application_typeDTO> save(application_typeDTO dto) {
        try {
            application_type entity = convertToEntity(dto);
            iapplication_type.save(entity);
            return new ResponseDTO<>(HttpStatus.OK.toString(), "Tipo de solicitud guardado correctamente", convertToDTO(entity));
        } catch (Exception e) {
            return new ResponseDTO<>(HttpStatus.INTERNAL_SERVER_ERROR.toString(), "Error al guardar: " + e.getMessage(), null);
        }
    }

    private application_type convertToEntity(application_typeDTO dto) {
        return application_type.builder()
                .id(dto.getId())
                .name(dto.getName())
                .required(dto.isRequired())
                .build();
    }

    private application_typeDTO convertToDTO(application_type entity) {
        return application_typeDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .required(entity.isRequired())
                .build();
    }
}
