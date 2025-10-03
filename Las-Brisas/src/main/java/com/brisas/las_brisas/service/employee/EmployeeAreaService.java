package com.brisas.las_brisas.service.employee;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.area.EmployeeAreaDetailDTO;
import com.brisas.las_brisas.DTO.employee.employee_areaDTO;
import com.brisas.las_brisas.model.area.area;
import com.brisas.las_brisas.model.employee.employee;
import com.brisas.las_brisas.model.employee.employee_area;
import com.brisas.las_brisas.repository.employee.Iemployee_area;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeAreaService {

    private final Iemployee_area iEmployeeArea;

    public List<EmployeeAreaDetailDTO> getAll() {
        return iEmployeeArea.findAll()
                .stream()
                .map(this::convertToDetailDTO)
                .collect(Collectors.toList());
    }

    public Optional<EmployeeAreaDetailDTO> findById(int id) {
        return iEmployeeArea.findById(id).map(this::convertToDetailDTO);
    }

    public ResponseDTO<employee_areaDTO> delete(int id) {
        Optional<employee_area> opt = iEmployeeArea.findById(id);
        if (opt.isEmpty()) {
            return new ResponseDTO<>("La relación empleado-área no existe", HttpStatus.NOT_FOUND.toString(), null);
        }
        iEmployeeArea.deleteById(id);
        return new ResponseDTO<>("Relación eliminada correctamente", HttpStatus.OK.toString(), null);
    }

    public ResponseDTO<employee_areaDTO> save(employee_areaDTO dto) {
        try {
            if (dto.getEmployeeId() <= 0 || dto.getAreaId() <= 0) {
                return new ResponseDTO<>("ID de empleado y área son requeridos",
                        HttpStatus.BAD_REQUEST.toString(), null);
            }

            employee_area entity = convertToEntity(dto);
            iEmployeeArea.save(entity);

            return new ResponseDTO<>("Relación guardada correctamente", HttpStatus.OK.toString(), dto);
        } catch (Exception e) {
            return new ResponseDTO<>("Error al guardar: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR.toString(), null);
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

    private EmployeeAreaDetailDTO convertToDetailDTO(employee_area entity) {
        return EmployeeAreaDetailDTO.builder()
                .id(entity.getId())
                .employeeId(entity.getEmployee().getId())
                .employeeName(entity.getEmployee().getFirstName() + " " + entity.getEmployee().getLastName())
                .areaId(entity.getArea().getId())
                .areaName(entity.getArea().getNameArea())
                .build();
    }
}
