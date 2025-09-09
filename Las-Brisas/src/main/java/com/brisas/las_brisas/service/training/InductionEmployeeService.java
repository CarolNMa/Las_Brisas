package com.brisas.las_brisas.service.training;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.training.induction_employeeDTO;
import com.brisas.las_brisas.model.employee.employee;
import com.brisas.las_brisas.model.training.induction_employee;
import com.brisas.las_brisas.repository.training.Iinduction_employee;
import com.brisas.las_brisas.model.training.induction;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InductionEmployeeService {

    private final Iinduction_employee IintroduEmployee;

    public List<induction_employee> getAll() {
        return IintroduEmployee.findAll();
    }

    public Optional<induction_employee> findById(int id) {
        return IintroduEmployee.findById(id);
    }

    public ResponseDTO<induction_employeeDTO> delete(int id) {
        Optional<induction_employee> opt = IintroduEmployee.findById(id);
        if (opt.isEmpty()) {
            return new ResponseDTO<>("La asignación de inducción no existe", HttpStatus.NOT_FOUND.toString(), null);
        }
        IintroduEmployee.deleteById(id);
        return new ResponseDTO<>("Asignación eliminada correctamente", HttpStatus.OK.toString(), null);
    }

    public ResponseDTO<induction_employeeDTO> save(induction_employeeDTO dto) {
        try {
            induction_employee entity = convertToEntity(dto);
            IintroduEmployee.save(entity);
            return new ResponseDTO<>(HttpStatus.OK.toString(), "Asignación guardada correctamente", convertToDTO(entity));
        } catch (Exception e) {
            return new ResponseDTO<>(HttpStatus.INTERNAL_SERVER_ERROR.toString(), "Error al guardar: " + e.getMessage(), null);
        }
    }

    private induction_employee convertToEntity(induction_employeeDTO dto) {
        employee e = new employee();
        e.setId(dto.getEmployeeId());

        induction i = new induction();
        i.setId(dto.getInductionId());

        induction_employee.status s;
        try {
            s = induction_employee.status.valueOf(dto.getStatus().toLowerCase());
        } catch (Exception ex) {
            s = induction_employee.status.pendiente;
        }

        induction_employee.visto v;
        try {
            v = induction_employee.visto.valueOf(dto.getVisto().toLowerCase());
        } catch (Exception ex) {
            v = induction_employee.visto.no;
        }

        return induction_employee.builder()
                .id(dto.getId())
                .employee(e)
                .induction(i)
                .dateAssignment(dto.getDateAssignment())
                .dateComplete(dto.getDateComplete())
                .deadline(dto.getDeadline())
                .dateSeen(dto.getDateSeen())
                .status(s)
                .visto(v)
                .points(dto.getPoints())
                .build();
    }

    private induction_employeeDTO convertToDTO(induction_employee entity) {
        return induction_employeeDTO.builder()
                .id(entity.getId())
                .employeeId(entity.getEmployee() != null ? entity.getEmployee().getId() : 0)
                .inductionId(entity.getInduction() != null ? entity.getInduction().getId() : 0)
                .dateAssignment(entity.getDateAssignment())
                .dateComplete(entity.getDateComplete())
                .deadline(entity.getDeadline())
                .dateSeen(entity.getDateSeen())
                .status(entity.getStatus().name())
                .visto(entity.getVisto().name())
                .points(entity.getPoints())
                .build();
    }
}
