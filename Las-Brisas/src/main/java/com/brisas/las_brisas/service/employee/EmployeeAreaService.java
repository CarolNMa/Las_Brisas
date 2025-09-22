package com.brisas.las_brisas.service.employee;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.employee.employee_areaDTO;
import com.brisas.las_brisas.model.employee.employee;
import com.brisas.las_brisas.model.employee.employee_area;
import com.brisas.las_brisas.model.area.area;
import com.brisas.las_brisas.repository.employee.Iemployee_area;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EmployeeAreaService {

    private final Iemployee_area iemployee_area;

    public List<employee_area> getAll() {
        return iemployee_area.findAll();
    }

    public Optional<employee_area> findById(int id) {
        return iemployee_area.findById(id);
    }

    public ResponseDTO<employee_areaDTO> delete(int id) {
        Optional<employee_area> opt = iemployee_area.findById(id);
        if (opt.isEmpty()) {
            return new ResponseDTO<>("La relación empleado-área no existe", HttpStatus.NOT_FOUND.toString(), null);
        }
        iemployee_area.deleteById(id);
        return new ResponseDTO<>("Relación eliminada correctamente", HttpStatus.OK.toString(), null);
    }

    public ResponseDTO<employee_areaDTO> save(employee_areaDTO dto) {
        try {
            if (dto.getEmployeeId() <= 0) {
                return new ResponseDTO<>("El ID del empleado es requerido", HttpStatus.BAD_REQUEST.toString(), null);
            }
            if (dto.getAreaId() <= 0) {
                return new ResponseDTO<>("El ID del área es requerido", HttpStatus.BAD_REQUEST.toString(), null);
            }

            employee_area entity = convertToEntity(dto);
            iemployee_area.save(entity);

            return new ResponseDTO<>("Relación guardada correctamente", HttpStatus.OK.toString(), convertToDTO(entity));
        } catch (Exception e) {
            return new ResponseDTO<>("Error al guardar: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.toString(),
                    null);
        }
    }

    private employee_area convertToEntity(employee_areaDTO dto) {
        employee e = new employee();
        e.setId(dto.getEmployeeId());

        area a = new area();
        a.setId(dto.getAreaId());

        return employee_area.builder()
                .id(dto.getId())
                .employee(e)
                .area(a)
                .build();
    }

    private employee_areaDTO convertToDTO(employee_area entity) {
        return employee_areaDTO.builder()
                .id(entity.getId())
                .employeeId(entity.getEmployee() != null ? entity.getEmployee().getId() : 0)
                .areaId(entity.getArea() != null ? entity.getArea().getId() : 0)
                .build();
    }
}
