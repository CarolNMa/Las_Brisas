package com.brisas.las_brisas.service.employee;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.employee.resumeDTO;
import com.brisas.las_brisas.model.employee.employee;
import com.brisas.las_brisas.model.employee.resume;
import com.brisas.las_brisas.repository.employee.Iresume;

import org.springframework.util.StringUtils;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor

public class resumeService {

    private final Iresume iResume;

    public List<resume> getAllResumes() {
        return iResume.findAll();
    }

    public Optional<resume> findById(int id) {
        return iResume.findById(id);
    }

    public ResponseDTO<resumeDTO> deleteResume(int id) {
        Optional<resume> opt = findById(id);
        if (opt.isEmpty()) {
            return new ResponseDTO<>("La hoja de vida no existe", HttpStatus.NOT_FOUND.toString(), null);
        }
        iResume.deleteById(id);
        return new ResponseDTO<>("Hoja de vida eliminada", HttpStatus.OK.toString(), null);
    }

    public ResponseDTO<resumeDTO> save(resumeDTO dto) {
        try {
           
            if (dto.getEmployeeId() <= 0) {
                return new ResponseDTO<>("El ID del empleado es requerido", HttpStatus.BAD_REQUEST.toString(), null);
            }
            if (!StringUtils.hasText(dto.getDocumentUrl())) {
                return new ResponseDTO<>("El documento de la hoja de vida es obligatorio",
                        HttpStatus.BAD_REQUEST.toString(), null);
            }

           
            resume entity = convertToEntity(dto);
            if (dto.getId() == 0) {
                entity.setDate_create(LocalDateTime.now());
            } else {
                entity.setDate_update(LocalDateTime.now());
            }
            iResume.save(entity);

            return new ResponseDTO<>("Hoja de vida guardada correctamente", HttpStatus.OK.toString(),
                    convertToDTO(entity));
        } catch (Exception e) {
            return new ResponseDTO<>("Error al guardar: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.toString(),
                    null);
        }
    }

    private resume convertToEntity(resumeDTO dto) {
        employee e = new employee();
        e.setId(dto.getEmployeeId());

        return resume.builder()
                .id(dto.getId())
                .date_create(dto.getDateCreate())
                .date_update(dto.getDateUpdate())
                .document_url(dto.getDocumentUrl())
                .observations(dto.getObservations())
                .employee(e)
                .build();
    }

    private resumeDTO convertToDTO(resume entity) {
        return resumeDTO.builder()
                .id(entity.getId())
                .dateCreate(entity.getDate_create())
                .dateUpdate(entity.getDate_update())
                .documentUrl(entity.getDocument_url())
                .observations(entity.getObservations())
                .employeeId(entity.getEmployee().getId())
                .build();
    }
}
