package com.brisas.las_brisas.service.employee;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.employee.emplo_locationDTO;
import com.brisas.las_brisas.model.employee.emplo_location;
import com.brisas.las_brisas.model.employee.employee;
import com.brisas.las_brisas.model.location.location;
import com.brisas.las_brisas.repository.employee.Iemplo_location;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EmployeeLocationService {

    private final Iemplo_location iemplo_location;

    public List<emplo_location> getAll() {
        return iemplo_location.findAll();
    }

    public Optional<emplo_location> findById(int id) {
        return iemplo_location.findById(id);
    }

    public ResponseDTO<emplo_locationDTO> delete(int id) {
        Optional<emplo_location> opt = iemplo_location.findById(id);
        if (opt.isEmpty()) {
            return new ResponseDTO<>("La relación empleado-ubicación no existe", HttpStatus.NOT_FOUND.toString(), null);
        }
        iemplo_location.deleteById(id);
        return new ResponseDTO<>("Relación eliminada correctamente", HttpStatus.OK.toString(), null);
    }

    public ResponseDTO<emplo_locationDTO> save(emplo_locationDTO dto) {
        try {
            if (dto.getEmployeeId() <= 0) {
                return new ResponseDTO<>("El ID del empleado es requerido", HttpStatus.BAD_REQUEST.toString(), null);
            }
            if (dto.getLocationId() <= 0) {
                return new ResponseDTO<>("El ID de la ubicación es requerido", HttpStatus.BAD_REQUEST.toString(), null);
            }

            emplo_location entity = convertToEntity(dto);
            iemplo_location.save(entity);

            return new ResponseDTO<>("Relación guardada correctamente", HttpStatus.OK.toString(), convertToDTO(entity));
        } catch (Exception e) {
            return new ResponseDTO<>("Error al guardar: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.toString(),
                    null);
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

    private emplo_locationDTO convertToDTO(emplo_location entity) {
        return emplo_locationDTO.builder()
                .id(entity.getId())
                .employeeId(entity.getEmployee() != null ? entity.getEmployee().getId() : 0)
                .locationId(entity.getLocation() != null ? entity.getLocation().getId() : 0)
                .build();
    }
}
