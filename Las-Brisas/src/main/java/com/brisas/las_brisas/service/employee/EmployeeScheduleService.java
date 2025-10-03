package com.brisas.las_brisas.service.employee;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.attendance.employee_scheduleDetailDTO;
import com.brisas.las_brisas.DTO.employee.emplo_scheduleDTO;
import com.brisas.las_brisas.model.attendance.schedule;
import com.brisas.las_brisas.model.employee.emplo_schedule;
import com.brisas.las_brisas.model.employee.employee;
import com.brisas.las_brisas.repository.employee.Iemplo_schedule;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeScheduleService {

    private final Iemplo_schedule iEmployeeSchedule;

    public List<employee_scheduleDetailDTO> getAll() {
        return iEmployeeSchedule.findAll()
                .stream()
                .map(this::convertToDetailDTO)
                .collect(Collectors.toList());
    }

    public Optional<employee_scheduleDetailDTO> findById(int id) {
        return iEmployeeSchedule.findById(id).map(this::convertToDetailDTO);
    }

    public ResponseDTO<emplo_scheduleDTO> delete(int id) {
        Optional<emplo_schedule> opt = iEmployeeSchedule.findById(id);
        if (opt.isEmpty()) {
            return new ResponseDTO<>("La relación empleado-horario no existe", HttpStatus.NOT_FOUND.toString(), null);
        }
        iEmployeeSchedule.deleteById(id);
        return new ResponseDTO<>("Relación eliminada correctamente", HttpStatus.OK.toString(), null);
    }

    public ResponseDTO<emplo_scheduleDTO> save(emplo_scheduleDTO dto) {
        try {
            if (dto.getEmployeeId() <= 0 || dto.getScheduleId() <= 0) {
                return new ResponseDTO<>("ID de empleado y horario son requeridos",
                        HttpStatus.BAD_REQUEST.toString(), null);
            }

            emplo_schedule entity = convertToEntity(dto);
            iEmployeeSchedule.save(entity);

            return new ResponseDTO<>("Relación guardada correctamente", HttpStatus.OK.toString(), dto);
        } catch (Exception e) {
            return new ResponseDTO<>("Error al guardar: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR.toString(), null);
        }
    }

    private emplo_schedule convertToEntity(emplo_scheduleDTO dto) {
        employee e = new employee();
        e.setId(dto.getEmployeeId());

        schedule s = new schedule();
        s.setId(dto.getScheduleId());

        return emplo_schedule.builder()
                .id(dto.getId())
                .employee(e)
                .schedule(s)
                .build();
    }

    private employee_scheduleDetailDTO convertToDetailDTO(emplo_schedule entity) {
        String scheduleName = entity.getSchedule().getShift() + " - "
                + entity.getSchedule().getDayWeek()
                + " (" + entity.getSchedule().getTime_start()
                + " a " + entity.getSchedule().getTime_end() + ")";

        return employee_scheduleDetailDTO.builder()
                .id(entity.getId())
                .employeeId(entity.getEmployee().getId())
                .employeeName(entity.getEmployee().getFirstName() + " " + entity.getEmployee().getLastName())
                .scheduleId(entity.getSchedule().getId())
                .scheduleName(scheduleName)
                .build();
    }

}
