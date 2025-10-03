package com.brisas.las_brisas.service.attendance;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.attendance.scheduleDTO;
import com.brisas.las_brisas.model.attendance.schedule;
import com.brisas.las_brisas.model.attendance.schedule.DayWeek;
import com.brisas.las_brisas.model.attendance.schedule.Shift;
import com.brisas.las_brisas.repository.attendance.Ischedule;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final Ischedule scheduleRepo;

    public List<schedule> getAll() {
        return scheduleRepo.findAll();
    }

    public Optional<schedule> findById(int id) {
        return scheduleRepo.findById(id);
    }

    public ResponseDTO<scheduleDTO> delete(int id) {
        Optional<schedule> opt = scheduleRepo.findById(id);
        if (opt.isEmpty()) {
            return new ResponseDTO<>("El horario no existe", HttpStatus.NOT_FOUND.toString(), null);
        }
        scheduleRepo.deleteById(id);
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
            if (dto.getDayWeek() == null || dto.getDayWeek().trim().isEmpty()) {
                return new ResponseDTO<>("El día de la semana es obligatorio", HttpStatus.BAD_REQUEST.toString(), null);
            }
            if (dto.getShift() == null || dto.getShift().trim().isEmpty()) {
                return new ResponseDTO<>("El turno es obligatorio", HttpStatus.BAD_REQUEST.toString(), null);
            }

            schedule entity = convertToEntity(dto);
            scheduleRepo.save(entity);

            return new ResponseDTO<>("Horario guardado correctamente",
                    HttpStatus.OK.toString(), convertToDTO(entity));
        } catch (Exception e) {
            return new ResponseDTO<>("Error al guardar: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR.toString(), null);
        }
    }

    private schedule convertToEntity(scheduleDTO dto) {
        Shift shiftEnum;
        try {
            shiftEnum = Shift.valueOf(dto.getShift().toUpperCase());
        } catch (Exception e) {
            shiftEnum = Shift.MANANA;
        }

        DayWeek dayEnum;
        try {
            dayEnum = DayWeek.valueOf(dto.getDayWeek().toUpperCase());
        } catch (Exception e) {
            dayEnum = DayWeek.LUNES;
        }

        return schedule.builder()
                .id(dto.getId())
                .time_start(dto.getTime_start())
                .time_end(dto.getTime_end())
                .shift(shiftEnum)
                .overtime(dto.getOvertime())
                .dayWeek(dayEnum) 
                .build();
    }

    private scheduleDTO convertToDTO(schedule entity) {
        return scheduleDTO.builder()
                .id(entity.getId())
                .time_start(entity.getTime_start())
                .time_end(entity.getTime_end())
                .shift(entity.getShift().name())
                .overtime(entity.getOvertime())
                .dayWeek(entity.getDayWeek().name())
                .build();
    }
}
