package com.brisas.las_brisas.service.employee;

import com.brisas.las_brisas.DTO.ResponseDTO;
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

@Service
@RequiredArgsConstructor
public class EmployeeScheduleService {

    private final Iemplo_schedule iemplo_schedule;

    public List<emplo_schedule> getAll() {
        return iemplo_schedule.findAll();
    }

    public Optional<emplo_schedule> findById(int id) {
        return iemplo_schedule.findById(id);
    }

    public ResponseDTO<emplo_scheduleDTO> delete(int id) {
        Optional<emplo_schedule> opt = iemplo_schedule.findById(id);
        if (opt.isEmpty()) {
            return new ResponseDTO<>("La relación empleado-horario no existe", HttpStatus.NOT_FOUND.toString(), null);
        }
        iemplo_schedule.deleteById(id);
        return new ResponseDTO<>("Relación eliminada correctamente", HttpStatus.OK.toString(), null);
    }

    public ResponseDTO<emplo_scheduleDTO> save(emplo_scheduleDTO dto) {
        try {
            emplo_schedule entity = convertToEntity(dto);
            iemplo_schedule.save(entity);
            return new ResponseDTO<>(HttpStatus.OK.toString(), "Relación guardada correctamente", convertToDTO(entity));
        } catch (Exception e) {
            return new ResponseDTO<>(HttpStatus.INTERNAL_SERVER_ERROR.toString(), "Error al guardar: " + e.getMessage(), null);
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

    private emplo_scheduleDTO convertToDTO(emplo_schedule entity) {
        return emplo_scheduleDTO.builder()
                .id(entity.getId())
                .employeeId(entity.getEmployee() != null ? entity.getEmployee().getId() : 0)
                .scheduleId(entity.getSchedule() != null ? entity.getSchedule().getId() : 0)
                .build();
    }
}
