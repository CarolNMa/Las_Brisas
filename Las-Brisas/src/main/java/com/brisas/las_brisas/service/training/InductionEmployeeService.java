package com.brisas.las_brisas.service.training;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.training.induction_employeeDTO;
import com.brisas.las_brisas.model.employee.employee;
import com.brisas.las_brisas.model.training.induction;
import com.brisas.las_brisas.model.training.induction_employee;
import com.brisas.las_brisas.repository.employee.Iemployee;
import com.brisas.las_brisas.repository.training.Iinduction;
import com.brisas.las_brisas.repository.training.Iinduction_employee;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InductionEmployeeService {

    private final Iinduction_employee inductionEmployeeRepository;
    private final Iemployee employeeRepository;
    private final Iinduction inductionRepository;

    // =========================================
    // LISTADOS
    // =========================================

    /** 🔹 Devuelve todas las asignaciones con nombres (solo para ADMIN) */
    public List<induction_employeeDTO> getAllFormatted() {
        return inductionEmployeeRepository.findAll()
                .stream()
                .map(this::convertToDTOWithNames)
                .toList();
    }

    /** 🔹 Devuelve asignaciones del empleado autenticado (vista EMPLEADO) */
    public List<induction_employeeDTO> findByUserEmailFormatted(String email) {
        return inductionEmployeeRepository.findByUserEmail(email)
                .stream()
                .map(this::convertToDTOWithNames)
                .toList();
    }

    public Optional<induction_employee> findById(int id) {
        return inductionEmployeeRepository.findById(id);
    }

    // =========================================
    // GUARDAR / ASIGNAR (ADMIN)
    // =========================================
    public ResponseDTO<induction_employeeDTO> save(induction_employeeDTO dto) {
        try {
            if (dto.getEmployeeId() <= 0)
                return new ResponseDTO<>("El empleado es obligatorio", "400", null);

            if (dto.getInductionId() <= 0)
                return new ResponseDTO<>("La inducción es obligatoria", "400", null);

            if (dto.getDeadline() == null)
                return new ResponseDTO<>("La fecha límite es obligatoria", "400", null);

            Optional<employee> empOpt = employeeRepository.findById(dto.getEmployeeId());
            Optional<induction> indOpt = inductionRepository.findById(dto.getInductionId());

            if (empOpt.isEmpty() || indOpt.isEmpty())
                return new ResponseDTO<>("Empleado o inducción no encontrados", "404", null);

            if (dto.getDateAssignment() == null)
                dto.setDateAssignment(LocalDateTime.now());

            if (dto.getStatus() == null || dto.getStatus().isEmpty())
                dto.setStatus("pendiente");

            if (dto.getVisto() == null || dto.getVisto().isEmpty())
                dto.setVisto("no");

            if (dto.getPoints() < 0)
                dto.setPoints(0);

            induction_employee entity = convertToEntity(dto, empOpt.get(), indOpt.get());
            inductionEmployeeRepository.saveAndFlush(entity);

            System.out.println("✅ Asignación guardada con ID: " + entity.getId());

            return new ResponseDTO<>("Asignación guardada correctamente", "200", convertToDTO(entity));

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseDTO<>("Error al guardar: " + e.getMessage(), "500", null);
        }
    }

    // =========================================
    // EMPLEADO: Marcar como vista
    // =========================================
    public ResponseDTO<induction_employeeDTO> markAsSeen(int id) {
        Optional<induction_employee> opt = inductionEmployeeRepository.findById(id);
        if (opt.isEmpty()) {
            return new ResponseDTO<>("Asignación no encontrada", "404", null);
        }

        induction_employee entity = opt.get();

        if (entity.getVisto() == induction_employee.visto.no) {
            entity.setVisto(induction_employee.visto.si);
            entity.setDateSeen(LocalDateTime.now());
            inductionEmployeeRepository.saveAndFlush(entity);
            System.out.println("👁️ Inducción marcada como vista para empleado ID " + entity.getEmployee().getId());
        }

        return new ResponseDTO<>("Inducción vista registrada", "200", convertToDTO(entity));
    }

    // =========================================
    // EMPLEADO: Completar inducción
    // =========================================
    public ResponseDTO<induction_employeeDTO> completeInduction(int id, int points) {
        Optional<induction_employee> opt = inductionEmployeeRepository.findById(id);
        if (opt.isEmpty()) {
            return new ResponseDTO<>("Asignación no encontrada", "404", null);
        }

        induction_employee entity = opt.get();

        entity.setPoints(points);

        if (points >= 50) {
            entity.setStatus(induction_employee.status.aprobado);
        } else {
            entity.setStatus(induction_employee.status.rechazado);
        }

        entity.setDateComplete(LocalDateTime.now());
        inductionEmployeeRepository.saveAndFlush(entity);

        System.out.println("🏁 Inducción completada ID " + entity.getId() + " | Puntos: " + points);

        return new ResponseDTO<>(
                points >= 50 ? "Inducción aprobada" : "Inducción reprobada",
                "200",
                convertToDTO(entity));
    }

    // =========================================
    // ELIMINAR
    // =========================================
    public ResponseDTO<induction_employeeDTO> delete(int id) {
        Optional<induction_employee> opt = inductionEmployeeRepository.findById(id);
        if (opt.isEmpty()) {
            return new ResponseDTO<>("La asignación no existe", "404", null);
        }
        inductionEmployeeRepository.deleteById(id);
        return new ResponseDTO<>("Asignación eliminada correctamente", "200", null);
    }

    public ResponseDTO<induction_employeeDTO> completeCapacitacion(int id) {
        Optional<induction_employee> opt = inductionEmployeeRepository.findById(id);
        if (opt.isEmpty()) {
            return new ResponseDTO<>("Asignación no encontrada", "404", null);
        }

        induction_employee entity = opt.get();

        // Solo marcar como vista y aprobar con 100 puntos
        entity.setVisto(induction_employee.visto.si);
        entity.setDateSeen(LocalDateTime.now());
        entity.setStatus(induction_employee.status.aprobado);
        entity.setPoints(100);
        entity.setDateComplete(LocalDateTime.now());

        inductionEmployeeRepository.saveAndFlush(entity);

        System.out.println("🎓 Capacitación completada y aprobada automáticamente ID " + entity.getId());

        return new ResponseDTO<>("Capacitación completada correctamente con 100 puntos", "200", convertToDTO(entity));
    }

    // =========================================
    // CONVERSORES
    // =========================================
    private induction_employee convertToEntity(induction_employeeDTO dto, employee emp, induction ind) {
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
                .employee(emp)
                .induction(ind)
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

    private induction_employeeDTO convertToDTOWithNames(induction_employee entity) {
        return induction_employeeDTO.builder()
                .id(entity.getId())
                .employeeId(entity.getEmployee() != null ? entity.getEmployee().getId() : 0)
                .inductionId(entity.getInduction() != null ? entity.getInduction().getId() : 0)
                .employeeName(entity.getEmployee() != null
                        ? entity.getEmployee().getFirstName() + " " + entity.getEmployee().getLastName()
                        : "")
                .inductionName(entity.getInduction() != null ? entity.getInduction().getName() : "")
                .inductionType(entity.getInduction() != null ? entity.getInduction().getType().name() : "")

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
