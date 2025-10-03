package com.brisas.las_brisas.service.employee;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.employee.resumeDTO;
import com.brisas.las_brisas.model.employee.employee;
import com.brisas.las_brisas.model.employee.resume;
import com.brisas.las_brisas.repository.employee.Iemployee;
import com.brisas.las_brisas.repository.employee.Iresume;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class resumeService {

    private final Iresume iResume;
    private final Iemployee iEmployee;

    // 🔹 Listar todas las hojas de vida
    public List<resumeDTO> getAllResumesDTO() {
        return iResume.findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    // 🔹 Buscar por ID
    public Optional<resume> findById(int id) {
        return iResume.findById(id);
    }

    // 🔹 Validar existencia de empleado
    public boolean existsEmployee(int id) {
        return iEmployee.existsById(id);
    }

    // 🔹 Buscar DTO por ID
    public Optional<resumeDTO> getResumeDTOById(int id) {
        return iResume.findById(id).map(this::convertToDTO);
    }

    // 🔹 Buscar hoja de vida de un empleado por email (para rol EMPLEADO)
    public Optional<resumeDTO> getResumeDTOByUserEmail(String email) {
        return iResume.findByEmployee_User_Email(email).map(this::convertToDTO);
    }

    public Optional<resume> findByUserEmail(String email) {
        return iResume.findByEmployee_User_Email(email);
    }

    // 🔹 Guardar hoja de vida (crear o actualizar)
    public ResponseDTO<resumeDTO> save(resumeDTO dto) {
        try {
            // Validación: empleado válido
            if (dto.getEmployeeId() <= 0) {
                return new ResponseDTO<>(
                        "El ID del empleado es requerido",
                        String.valueOf(HttpStatus.BAD_REQUEST.value()),
                        null);
            }

            // Validación: documento obligatorio
            if (!StringUtils.hasText(dto.getDocumentUrl())) {
                return new ResponseDTO<>(
                        "El documento de la hoja de vida es obligatorio",
                        String.valueOf(HttpStatus.BAD_REQUEST.value()),
                        null);
            }

            Optional<employee> empOpt = iEmployee.findById(dto.getEmployeeId());
            if (empOpt.isEmpty()) {
                return new ResponseDTO<>(
                        "El empleado con ID " + dto.getEmployeeId() + " no existe",
                        String.valueOf(HttpStatus.NOT_FOUND.value()),
                        null);
            }

            // Validar si ya existe hoja de vida para ese empleado (solo creación)
            if (dto.getId() == 0) {
                Optional<resume> existingResume = iResume.findByEmployee_Id(dto.getEmployeeId());
                if (existingResume.isPresent()) {
                    return new ResponseDTO<>(
                            "El empleado ya tiene una hoja de vida registrada",
                            String.valueOf(HttpStatus.CONFLICT.value()),
                            null);
                }
            }

            // Construcción entidad
            resume entity = convertToEntity(dto);
            entity.setEmployee(empOpt.get());

            // Manejo de fechas
            if (dto.getId() == 0) {
                entity.setDate_create(LocalDateTime.now());
                entity.setDate_update(LocalDateTime.now());
            } else {
                Optional<resume> existing = iResume.findById(dto.getId());
                if (existing.isEmpty()) {
                    return new ResponseDTO<>(
                            "La hoja de vida no existe",
                            String.valueOf(HttpStatus.NOT_FOUND.value()),
                            null);
                }
                entity.setDate_create(existing.get().getDate_create());
                entity.setDate_update(LocalDateTime.now());
            }

            // Guardar
            resume saved = iResume.save(entity);

            return new ResponseDTO<>(
                    "Hoja de vida guardada correctamente",
                    String.valueOf(HttpStatus.OK.value()),
                    convertToDTO(saved));

        } catch (Exception e) {
            return new ResponseDTO<>(
                    "Error al guardar: " + e.getMessage(),
                    String.valueOf(HttpStatus.INTERNAL_SERVER_ERROR.value()),
                    null);
        }
    }

    public ResponseDTO<resumeDTO> update(resumeDTO dto) {
        try {
            Optional<resume> existingOpt = iResume.findById(dto.getId());
            if (existingOpt.isEmpty()) {
                return new ResponseDTO<>(
                        "La hoja de vida con ID " + dto.getId() + " no existe",
                        String.valueOf(HttpStatus.NOT_FOUND.value()),
                        null);
            }

            Optional<employee> empOpt = iEmployee.findById(dto.getEmployeeId());
            if (empOpt.isEmpty()) {
                return new ResponseDTO<>(
                        "El empleado con ID " + dto.getEmployeeId() + " no existe",
                        String.valueOf(HttpStatus.NOT_FOUND.value()),
                        null);
            }

            resume existing = existingOpt.get();

            // Mantener la fecha de creación
            LocalDateTime dateCreate = existing.getDate_create();

            // ✅ Solo reemplaza documento si vino un archivo nuevo (documentUrl no null)
            if (StringUtils.hasText(dto.getDocumentUrl())) {
                existing.setDocument_url(dto.getDocumentUrl());
            }

            // ✅ Siempre actualiza observaciones, empleado y fecha update
            existing.setObservations(dto.getObservations());
            existing.setEmployee(empOpt.get());
            existing.setDate_update(LocalDateTime.now());
            existing.setDate_create(dateCreate);

            iResume.save(existing);

            return new ResponseDTO<>(
                    "Hoja de vida actualizada correctamente",
                    String.valueOf(HttpStatus.OK.value()),
                    convertToDTO(existing));

        } catch (Exception e) {
            return new ResponseDTO<>(
                    "Error al actualizar: " + e.getMessage(),
                    String.valueOf(HttpStatus.INTERNAL_SERVER_ERROR.value()),
                    null);
        }
    }

    // 🔹 Eliminar hoja de vida
    public ResponseDTO<resumeDTO> deleteResume(int id) {
        Optional<resume> opt = findById(id);
        if (opt.isEmpty()) {
            return new ResponseDTO<>(
                    "La hoja de vida no existe",
                    String.valueOf(HttpStatus.NOT_FOUND.value()),
                    null);
        }
        iResume.deleteById(id);
        return new ResponseDTO<>(
                "Hoja de vida eliminada",
                String.valueOf(HttpStatus.OK.value()),
                null);
    }

    // 🔹 Convertir DTO -> Entidad
    private resume convertToEntity(resumeDTO dto) {
        return resume.builder()
                .id(dto.getId())
                .date_create(dto.getDateCreate())
                .date_update(dto.getDateUpdate())
                .document_url(dto.getDocumentUrl()) // Ruta física del archivo
                .observations(dto.getObservations())
                .build();
    }

    // 🔹 Convertir Entidad -> DTO
    private resumeDTO convertToDTO(resume entity) {
        return resumeDTO.builder()
                .id(entity.getId())
                .dateCreate(entity.getDate_create())
                .dateUpdate(entity.getDate_update())
                // aquí devolvemos un endpoint de descarga, no la ruta física
                .documentUrl("/api/v1/resumes/" + entity.getId() + "/download")
                .observations(entity.getObservations())
                .employeeId(entity.getEmployee().getId())
                .build();
    }
}
