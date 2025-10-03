package com.brisas.las_brisas.service.position;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.position.employee_postDTO;
import com.brisas.las_brisas.DTO.position.employee_postDetailDTO;
import com.brisas.las_brisas.model.employee.employee;
import com.brisas.las_brisas.model.position.EmployeePost;
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

    public List<employee_postDetailDTO> getAllDetails() {
        return iemployeepost.findAll()
                .stream()
                .map(this::convertToDetailDTO)
                .toList();
    }

    public Optional<EmployeePost> findById(int id) {
        return iemployeepost.findById(id);
    }

    public Optional<EmployeePost> findLatestByEmployee(int employeeId) {
        return iemployeepost.findTopByEmployee_IdOrderByIdDesc(employeeId);
    }

    public ResponseDTO<employee_postDTO> delete(int id) {
        Optional<EmployeePost> opt = iemployeepost.findById(id);
        if (opt.isEmpty()) {
            return new ResponseDTO<>("La relación empleado-puesto no existe",
                    HttpStatus.NOT_FOUND.toString(), null);
        }
        iemployeepost.deleteById(id);
        return new ResponseDTO<>("Relación eliminada correctamente",
                HttpStatus.OK.toString(), null);
    }

    public ResponseDTO<employee_postDTO> save(employee_postDTO dto) {
        try {
            if (dto.getEmployeeId() <= 0) {
                return new ResponseDTO<>("El ID del empleado es requerido",
                        HttpStatus.BAD_REQUEST.toString(), null);
            }
            if (dto.getPostId() <= 0) {
                return new ResponseDTO<>("El ID del puesto es requerido",
                        HttpStatus.BAD_REQUEST.toString(), null);
            }

            EmployeePost entity = convertToEntity(dto);
            iemployeepost.save(entity);

            return new ResponseDTO<>("Relación guardada correctamente",
                    HttpStatus.OK.toString(), convertToDTO(entity));
        } catch (Exception e) {
            return new ResponseDTO<>("Error al guardar: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR.toString(), null);
        }
    }

    private EmployeePost convertToEntity(employee_postDTO dto) {
        employee e = new employee();
        e.setId(dto.getEmployeeId());

        positions p = new positions();
        p.setId(dto.getPostId());

        return EmployeePost.builder()
                .id(dto.getId())
                .employee(e)
                .post(p)
                .build();
    }

    private employee_postDTO convertToDTO(EmployeePost entity) {
        return employee_postDTO.builder()
                .id(entity.getId())
                .employeeId(entity.getEmployee() != null ? entity.getEmployee().getId() : 0)
                .postId(entity.getPost() != null ? entity.getPost().getId() : 0)
                .build();
    }

    private employee_postDetailDTO convertToDetailDTO(EmployeePost entity) {
        return employee_postDetailDTO.builder()
                .id(entity.getId())
                .employeeId(entity.getEmployee() != null ? entity.getEmployee().getId() : 0)
                .employeeName(entity.getEmployee() != null
                        ? entity.getEmployee().getFirstName() + " " + entity.getEmployee().getLastName()
                        : "Desconocido")
                .postId(entity.getPost() != null ? entity.getPost().getId() : 0)
                .postName(entity.getPost() != null ? entity.getPost().getNamePost() : "Sin cargo")
                .build();
    }
}
