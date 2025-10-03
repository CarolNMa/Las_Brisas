package com.brisas.las_brisas.service.employee;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.employee.emplo_locationDTO;
import com.brisas.las_brisas.DTO.location.employee_locationDetailDTO;
import com.brisas.las_brisas.model.employee.emplo_location;
import com.brisas.las_brisas.model.employee.employee;
import com.brisas.las_brisas.model.location.location;
import com.brisas.las_brisas.repository.employee.Iemplo_location;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeLocationService {

    private final Iemplo_location iEmployeeLocation;

    public List<employee_locationDetailDTO> getAll() {
        return iEmployeeLocation.findAll()
                .stream()
                .map(this::convertToDetailDTO)
                .collect(Collectors.toList());
    }

    public Optional<employee_locationDetailDTO> findById(int id) {
        return iEmployeeLocation.findById(id).map(this::convertToDetailDTO);
    }

    public ResponseDTO<emplo_locationDTO> delete(int id) {
        Optional<emplo_location> opt = iEmployeeLocation.findById(id);
        if (opt.isEmpty()) {
            return new ResponseDTO<>("La relación empleado-ubicación no existe", HttpStatus.NOT_FOUND.toString(), null);
        }
        iEmployeeLocation.deleteById(id);
        return new ResponseDTO<>("Relación eliminada correctamente", HttpStatus.OK.toString(), null);
    }

    public ResponseDTO<emplo_locationDTO> save(emplo_locationDTO dto) {
        try {
            if (dto.getEmployeeId() <= 0 || dto.getLocationId() <= 0) {
                return new ResponseDTO<>("ID de empleado y ubicación son requeridos",
                        HttpStatus.BAD_REQUEST.toString(), null);
            }

            emplo_location entity = convertToEntity(dto);
            iEmployeeLocation.save(entity);

            return new ResponseDTO<>("Relación guardada correctamente", HttpStatus.OK.toString(), dto);
        } catch (Exception e) {
            return new ResponseDTO<>("Error al guardar: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR.toString(), null);
        }
    }

    private emplo_location convertToEntity(emplo_locationDTO dto) {
        employee e = new employee();
        e.setId(dto.getEmployeeId());

        location l = new location();
        l.setId(dto.getLocationId());

        return emplo_location.builder()
                .id(dto.getId())
                .employee(e)
                .location(l)
                .build();
    }

    private employee_locationDetailDTO convertToDetailDTO(emplo_location entity) {
        return employee_locationDetailDTO.builder()
                .id(entity.getId())
                .employeeId(entity.getEmployee().getId())
                .employeeName(entity.getEmployee().getFirstName() + " " + entity.getEmployee().getLastName())
                .locationId(entity.getLocation().getId())
                .locationName(entity.getLocation().getNameLocation())
                .build();
    }
}
