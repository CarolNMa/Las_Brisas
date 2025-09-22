package com.brisas.las_brisas.service.attendance;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.attendance.attendanceDTO;
import com.brisas.las_brisas.model.attendance.attendance;
import com.brisas.las_brisas.model.employee.employee;
import com.brisas.las_brisas.repository.attendance.Iattendance;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final Iattendance iattendance;

    public List<attendance> getAll() {
        return iattendance.findAll();
    }

    public Optional<attendance> findById(int id) {
        return iattendance.findById(id);
    }

    public ResponseDTO<attendanceDTO> delete(int id) {
        Optional<attendance> opt = iattendance.findById(id);
        if (opt.isEmpty()) {
            return new ResponseDTO<>("La asistencia no existe", HttpStatus.NOT_FOUND.toString(), null);
        }
        iattendance.deleteById(id);
        return new ResponseDTO<>("Asistencia eliminada correctamente", HttpStatus.OK.toString(), null);
    }

    public ResponseDTO<attendanceDTO> save(attendanceDTO dto) {
        try {
            if (dto.getEmployee() <= 0) {
                return new ResponseDTO<>("El ID del empleado es requerido", HttpStatus.BAD_REQUEST.toString(), null);
            }
            if (dto.getDate() == null) {
                return new ResponseDTO<>("La fecha de la asistencia es obligatoria", HttpStatus.BAD_REQUEST.toString(),
                        null);
            }
            if (dto.getTimeStart() == null) {
                return new ResponseDTO<>("La hora de inicio es obligatoria", HttpStatus.BAD_REQUEST.toString(), null);
            }
            if (dto.getTimeEnd() != null && dto.getTimeStart().isAfter(dto.getTimeEnd())) {
                return new ResponseDTO<>("La hora de fin no puede ser anterior a la de inicio",
                        HttpStatus.BAD_REQUEST.toString(), null);
            }

            attendance entity = convertToEntity(dto);
            iattendance.save(entity);

            return new ResponseDTO<>("Asistencia guardada correctamente",
                    HttpStatus.OK.toString(), convertToDTO(entity));
        } catch (Exception e) {
            return new ResponseDTO<>("Error al guardar: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR.toString(), null);
        }
    }

    private attendance convertToEntity(attendanceDTO dto) {
        employee e = new employee();
        e.setId(dto.getEmployee());

        attendance.status statusEnum;
        try {
            statusEnum = attendance.status.valueOf(dto.getStatus().toUpperCase());
        } catch (Exception s) {
            statusEnum = attendance.status.presente;
        }

        return attendance.builder()
                .id(dto.getId())
                .date(dto.getDate())
                .time_start(dto.getTimeStart())
                .time_end(dto.getTimeEnd())
                .status(statusEnum)
                .employee(e)
                .build();
    }

    private attendanceDTO convertToDTO(attendance entity) {
        return attendanceDTO.builder()
                .id(entity.getId())
                .date(entity.getDate())
                .timeStart(entity.getTime_start())
                .timeEnd(entity.getTime_end())
                .status(entity.getStatus().name())
                .employee(entity.getEmployee() != null ? entity.getEmployee().getId() : 0)
                .build();
    }
}
