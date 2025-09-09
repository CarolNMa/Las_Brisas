package com.brisas.las_brisas.service.application;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.application.applicationDTO;
import com.brisas.las_brisas.model.application.application;
import com.brisas.las_brisas.model.application.application_type;
import com.brisas.las_brisas.model.employee.employee;
import com.brisas.las_brisas.repository.application.Iapplication;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final Iapplication iapplication;

    public List<application> getAll() {
        return iapplication.findAll();
    }

    public Optional<application> findById(int id) {
        return iapplication.findById(id);
    }

    public ResponseDTO<applicationDTO> delete(int id) {
        Optional<application> opt = iapplication.findById(id);
        if (opt.isEmpty()) {
            return new ResponseDTO<>("La solicitud no existe", HttpStatus.NOT_FOUND.toString(), null);
        }
        iapplication.deleteById(id);
        return new ResponseDTO<>("Solicitud eliminada correctamente", HttpStatus.OK.toString(), null);
    }

    public ResponseDTO<applicationDTO> save(applicationDTO dto) {
        try {
            application entity = convertToEntity(dto);
            iapplication.save(entity);
            return new ResponseDTO<>(HttpStatus.OK.toString(), "Solicitud guardada correctamente", convertToDTO(entity));
        } catch (Exception e) {
            return new ResponseDTO<>(HttpStatus.INTERNAL_SERVER_ERROR.toString(), "Error al guardar: " + e.getMessage(), null);
        }
    }

    private application convertToEntity(applicationDTO dto) {
        employee e = new employee();
        e.setId(dto.getEmployeeId()); 

        application_type t = new application_type();
        t.setId(dto.getApplicationTypeid());

        application.status statusEnum;
        try {
            statusEnum = application.status.valueOf(dto.getStatus().toUpperCase());
        } catch (Exception s) {
            statusEnum = application.status.Pendiente;
        }

        return application.builder()
                .id(dto.getId())
                .date_start(dto.getDateStart())
                .date_end(dto.getDateEnd())
                .date_create(dto.getDateCreate())
                .reason(dto.getReason())
                .documentUrl(dto.getDocumentUrl())
                .status(statusEnum)
                .employee(e)
                .application_type(t)
                .build();
    }

    private applicationDTO convertToDTO(application entity) {
        return applicationDTO.builder()
                .id(entity.getId())
                .dateStart(entity.getDate_start())
                .dateEnd(entity.getDate_end())
                .dateCreate(entity.getDate_create())
                .reason(entity.getReason())
                .documentUrl(entity.getDocumentUrl())
                .status(entity.getStatus().name())
                .employeeId(entity.getEmployee() != null ? entity.getEmployee().getId() : 0)
                .applicationTypeid(entity.getApplication_type() != null ? entity.getApplication_type().getId() : 0)
                .build();
    }
}
