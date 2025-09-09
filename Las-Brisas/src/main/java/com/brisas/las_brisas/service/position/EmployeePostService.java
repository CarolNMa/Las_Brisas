package com.brisas.las_brisas.service.position;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.position.employee_postDTO;
import com.brisas.las_brisas.model.employee.employee;
import com.brisas.las_brisas.model.position.employee_post;
import com.brisas.las_brisas.model.position.positions;
import com.brisas.las_brisas.repository.position.Iemployee_post;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EmployeePostService {

    private final Iemployee_post iemployeepost;

    public List<employee_post> getAll() {
        return iemployeepost.findAll();
    }

    public Optional<employee_post> findById(int id) {
        return iemployeepost.findById(id);
    }

    public ResponseDTO<employee_postDTO> delete(int id) {
        Optional<employee_post> opt = iemployeepost.findById(id);
        if (opt.isEmpty()) {
            return new ResponseDTO<>("La relación empleado-puesto no existe", HttpStatus.NOT_FOUND.toString(), null);
        }
        iemployeepost.deleteById(id);
        return new ResponseDTO<>("Relación eliminada correctamente", HttpStatus.OK.toString(), null);
    }

    public ResponseDTO<employee_postDTO> save(employee_postDTO dto) {
        try {
            employee_post entity = convertToEntity(dto);
            iemployeepost.save(entity);
            return new ResponseDTO<>(HttpStatus.OK.toString(), "Relación guardada correctamente", convertToDTO(entity));
        } catch (Exception e) {
            return new ResponseDTO<>(HttpStatus.INTERNAL_SERVER_ERROR.toString(), "Error al guardar: " + e.getMessage(), null);
        }
    }

    private employee_post convertToEntity(employee_postDTO dto) {
        employee e = new employee();
        e.setId(dto.getEmployeeId());

        positions p = new positions();
        p.setId(dto.getPostId());

        return employee_post.builder()
                .id(dto.getId())
                .employee(e)
                .post(p)
                .build();
    }

    private employee_postDTO convertToDTO(employee_post entity) {
        return employee_postDTO.builder()
                .id(entity.getId())
                .employeeId(entity.getEmployee() != null ? entity.getEmployee().getId() : 0)
                .postId(entity.getPost() != null ? entity.getPost().getId() : 0)
                .build();
    }
}
