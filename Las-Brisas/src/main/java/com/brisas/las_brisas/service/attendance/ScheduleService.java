package com.brisas.las_brisas.service.attendance;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.attendance.scheduleDTO;
import com.brisas.las_brisas.model.attendance.schedule;
import com.brisas.las_brisas.repository.attendance.Ischedule;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final Ischedule ischedule;

    public List<schedule> getAll() {
        return ischedule.findAll();
    }

    public Optional<schedule> findById(int id) {
        return ischedule.findById(id);
    }

    public ResponseDTO<scheduleDTO> delete(int id) {
        Optional<schedule> opt = ischedule.findById(id);
        if (opt.isEmpty()) {
            return new ResponseDTO<>("El horario no existe", HttpStatus.NOT_FOUND.toString(), null);
        }
        ischedule.deleteById(id);
        return new ResponseDTO<>("Horario eliminado correctamente", HttpStatus.OK.toString(), null);
    }

    public ResponseDTO<scheduleDTO> save(scheduleDTO dto) {
        try {
            if (dto.getTime_start() == null) {
                return new ResponseDTO<>("La hora de inicio es obligatoria", HttpStatus.BAD_REQUEST.toString(), null);
            }
            if (dto.getTime_end() == null) {
                return new ResponseDTO<>("La hora de fin es obligatoria", HttpStatus.BAD_REQUEST.toString(), null);
            }
            if (dto.getTime_start().isAfter(dto.getTime_end())) {
                return new ResponseDTO<>("La hora de inicio no puede ser mayor a la hora de fin",
                        HttpStatus.BAD_REQUEST.toString(), null);
            }
            if (dto.getDay_week() == null || dto.getDay_week().trim().isEmpty()) {
                return new ResponseDTO<>("El día de la semana es obligatorio", HttpStatus.BAD_REQUEST.toString(), null);
            }
            if (dto.getShift() == null || dto.getShift().trim().isEmpty()) {
                return new ResponseDTO<>("El turno es obligatorio", HttpStatus.BAD_REQUEST.toString(), null);
            }

            schedule entity = convertToEntity(dto);
            ischedule.save(entity);

            return new ResponseDTO<>("Horario guardado correctamente",
                    HttpStatus.OK.toString(), convertToDTO(entity));
        } catch (Exception e) {
            return new ResponseDTO<>("Error al guardar: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR.toString(), null);
        }
    }

    private schedule convertToEntity(scheduleDTO dto) {

        schedule.shift shiftEnum;
        try {
            shiftEnum = schedule.shift.valueOf(dto.getShift().toUpperCase());
        } catch (Exception s) {
            shiftEnum = schedule.shift.mañana;
        }

        schedule.day_week day_weekEnum;
        try {
            day_weekEnum = schedule.day_week.valueOf(dto.getDay_week().toUpperCase());
        } catch (Exception s) {
            day_weekEnum = schedule.day_week.lunes;
        }

        return schedule.builder()
                .id(dto.getId())
                .time_start(dto.getTime_start())
                .time_end(dto.getTime_end())
                .shift(shiftEnum)
                .documentUrl(dto.getDocumentUrl())
                .overtime(dto.getOvertime())
                .day_week(day_weekEnum)
                .build();
    }

    private scheduleDTO convertToDTO(schedule entity) {
        return scheduleDTO.builder()
                .id(entity.getId())
                .time_start(entity.getTime_start())
                .time_end(entity.getTime_end())
                .shift(entity.getShift().name())
                .documentUrl(entity.getDocumentUrl())
                .overtime(entity.getOvertime())
                .day_week(entity.getDay_week().name())
                .build();
    }
}
