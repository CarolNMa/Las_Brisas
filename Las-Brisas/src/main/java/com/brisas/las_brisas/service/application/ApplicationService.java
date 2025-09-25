package com.brisas.las_brisas.service.application;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.application.applicationDTO;
import com.brisas.las_brisas.model.application.application;
import com.brisas.las_brisas.model.application.application_type;
import com.brisas.las_brisas.model.employee.employee;
import com.brisas.las_brisas.repository.application.Iapplication;
import com.brisas.las_brisas.repository.application.Iapplication_type;
import com.brisas.las_brisas.repository.employee.Iemployee;

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
        try {
            employee emp = iemployee.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Empleado no encontrado con email: " + email));

            application_type type = itype.findById(dto.getApplicationTypeid())
                    .orElseThrow(() -> new RuntimeException("Tipo de solicitud no encontrado"));

            application entity = application.builder()
                    .date_start(dto.getDateStart())
                    .date_end(dto.getDateEnd())
                    .date_create(LocalDateTime.now())
                    .reason(dto.getReason())
                    .documentUrl(dto.getDocumentUrl())
                    .status(application.status.Pendiente)
                    .employee(emp)
                    .application_type(type)
                    .build();

            iapplication.save(entity);

            return new ResponseDTO<>("Solicitud creada correctamente",
                    HttpStatus.OK.toString(), convertToDTO(entity));
        } catch (Exception e) {
            return new ResponseDTO<>("Error al crear: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR.toString(), null);
        }
    }

    public List<application> findByUserEmail(String email) {
        return iapplication.findByEmployee_User_Email(email);
    }

    // aprobar/rechazar solicitud
    public ResponseDTO<Object> approve(int id, boolean approved) {
        application app = iapplication.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        app.setStatus(approved ? application.status.Aprobado : application.status.Rechazado);
        iapplication.save(app);

        return new ResponseDTO<>("Solicitud " + app.getStatus(), "200", null);
    }


    private applicationDTO convertToDTO(application entity) {
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
                .build();
    }
}
