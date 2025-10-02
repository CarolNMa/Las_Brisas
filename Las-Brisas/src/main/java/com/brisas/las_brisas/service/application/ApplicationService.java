package com.brisas.las_brisas.service.application;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.application.applicationDTO;
import com.brisas.las_brisas.model.application.application;
import com.brisas.las_brisas.model.application.application_type;
import com.brisas.las_brisas.model.employee.employee;
import com.brisas.las_brisas.model.user.user;
import com.brisas.las_brisas.repository.application.Iapplication;
import com.brisas.las_brisas.repository.application.Iapplication_type;
import com.brisas.las_brisas.repository.employee.Iemployee;
import com.brisas.las_brisas.repository.user.Iuser;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final Iapplication iapplication;
    private final Iemployee iemployee;
    private final Iapplication_type itype;
    private final Iuser iuser;

    public List<application> getAll() {
        return iapplication.findAll();
    }

    public Optional<application> findById(int id) {
        return iapplication.findById(id);
    }

    public ResponseDTO<applicationDTO> delete(int id) {
        Optional<application> opt = iapplication.findById(id);
        if (opt.isEmpty()) {
            return new ResponseDTO<>("La solicitud no existe", HttpStatus.NOT_FOUND.toString(), null);
        }
        iapplication.deleteById(id);
        return new ResponseDTO<>("Solicitud eliminada correctamente", HttpStatus.OK.toString(), null);
    }

    public ResponseDTO<applicationDTO> create(applicationDTO dto, String email) {

        Optional<user> usuarioOpt = iuser.findByEmail(email);
        if (usuarioOpt.isEmpty()) {
            return new ResponseDTO<>("Usuario no encontrado: " + email, "404", null);
        }

        Optional<employee> empOpt = iemployee.findByUser_IdUser(usuarioOpt.get().getIdUser());
        if (empOpt.isEmpty()) {
            return new ResponseDTO<>("El usuario no tiene un empleado asociado", "404", null);
        }

        Optional<application_type> typeOpt = itype.findById(dto.getApplicationTypeid());
        if (typeOpt.isEmpty()) {
            return new ResponseDTO<>("El tipo de solicitud no existe", "404", null);
        }

        try {
            application entity = application.builder()
                    .date_start(dto.getDateStart())
                    .date_end(dto.getDateEnd())
                    .date_create(LocalDateTime.now())
                    .reason(dto.getReason())
                    .documentUrl(dto.getDocumentUrl())
                    .status(application.status.Pendiente)
                    .employee(empOpt.get())
                    .application_type(typeOpt.get())
                    .build();

            iapplication.save(entity);

            return new ResponseDTO<>(
                    "Solicitud creada correctamente",
                    "200",
                    convertToDTO(entity));

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseDTO<>("Error inesperado: " + e.getMessage(), "500", null);
        }
    }

    public List<application> findByUserEmail(String email) {
        return iapplication.findByEmployee_User_Email(email);
    }

    public List<application> findByEmployeeId(int employeeId) {
        return iapplication.findByEmployee_Id(employeeId);
    }

    // aprobar/rechazar solicitud
    public ResponseDTO<Object> approve(int id, boolean approved) {
        application app = iapplication.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        app.setStatus(approved ? application.status.Aprobado : application.status.Rechazado);
        iapplication.save(app);

        return new ResponseDTO<>("Solicitud " + app.getStatus(), "200", null);
    }

    public applicationDTO convertToDTO(application entity) {
        return applicationDTO.builder()
                .id(entity.getId())
                .dateStart(entity.getDate_start())
                .dateEnd(entity.getDate_end())
                .dateCreate(entity.getDate_create())
                .reason(entity.getReason())
                .documentUrl(entity.getDocumentUrl())
                .status(entity.getStatus().name())
                .employeeId(entity.getEmployee() != null ? entity.getEmployee().getId() : 0)
                .applicationTypeid(entity.getApplication_type() != null ? entity.getApplication_type().getId() : 0)
                .applicationTypeName(entity.getApplication_type() != null ? entity.getApplication_type().getName() : "")
                .build();
    }
}
