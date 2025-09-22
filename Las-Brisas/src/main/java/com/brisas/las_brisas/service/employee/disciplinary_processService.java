package com.brisas.las_brisas.service.employee;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.employee.disciplinary_processDTO;
import com.brisas.las_brisas.model.employee.disciplinary_process;
import com.brisas.las_brisas.model.employee.employee;
import com.brisas.las_brisas.model.employee.resume;
import com.brisas.las_brisas.repository.employee.Idisciplinary_process;

import org.springframework.util.StringUtils;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor

public class disciplinary_processService {
    private final Idisciplinary_process iProcess;

    public List<disciplinary_process> getAllProcesses() {
        return iProcess.findAll();
    }

    public Optional<disciplinary_process> findById(int id) {
        return iProcess.findById(id);
    }

    public ResponseDTO<disciplinary_processDTO> delete(int id) {
        Optional<disciplinary_process> opt = iProcess.findById(id);
        if (opt.isEmpty()) {
            return new ResponseDTO<>("El proceso disciplinario no existe", HttpStatus.NOT_FOUND.toString(), null);
        }
        iProcess.deleteById(id);
        return new ResponseDTO<>("Proceso disciplinario eliminado", HttpStatus.OK.toString(), null);
    }

    public ResponseDTO<disciplinary_processDTO> save(disciplinary_processDTO dto) {
        try {
            
            if (dto.getEmployeeId() <= 0) {
                return new ResponseDTO<>("El ID del empleado es requerido", HttpStatus.BAD_REQUEST.toString(), null);
            }
            if (!StringUtils.hasText(dto.getDescription())) {
                return new ResponseDTO<>("La descripción no puede estar vacía", HttpStatus.BAD_REQUEST.toString(),
                        null);
            }

          
            disciplinary_process entity = convertToEntity(dto);
            iProcess.save(entity);

            return new ResponseDTO<>("Proceso disciplinario guardado correctamente", HttpStatus.OK.toString(),
                    convertToDTO(entity));
        } catch (Exception e) {
            return new ResponseDTO<>("Error al guardar: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.toString(),
                    null);
        }
    }

    private disciplinary_process convertToEntity(disciplinary_processDTO dto) {
        employee e = new employee();
        e.setId(dto.getEmployeeId());

        resume r = new resume();
        r.setId(dto.getResumeId());

        disciplinary_process.status statusEnum;
        try {
            statusEnum = disciplinary_process.status.valueOf(dto.getStatus().toUpperCase());
        } catch (Exception s) {
            statusEnum = disciplinary_process.status.pendiente;
        }

        disciplinary_process.type typeEnum;
        try {
            typeEnum = disciplinary_process.type.valueOf(dto.getType().toUpperCase());
        } catch (Exception t) {
            typeEnum = disciplinary_process.type.llamado_atencion;
        }

        return disciplinary_process.builder()
                .id(dto.getId())
                .description(dto.getDescription())
                .documentUrl(dto.getDocumentUrl())
                .date(dto.getDate())
                .status(statusEnum)
                .type(typeEnum)
                .employee(e)
                .resume(r)
                .build();
    }

    private disciplinary_processDTO convertToDTO(disciplinary_process entity) {
        return disciplinary_processDTO.builder()
                .id(entity.getId())
                .description(entity.getDescription())
                .documentUrl(entity.getDocumentUrl())
                .date(entity.getDate())
                .status(entity.getStatus().name())
                .type(entity.getType().name())
                .employeeId(entity.getEmployee() != null ? entity.getEmployee().getId() : 0)
                .resumeId(entity.getResume() != null ? entity.getResume().getId() : 0)
                .build();
    }
}
