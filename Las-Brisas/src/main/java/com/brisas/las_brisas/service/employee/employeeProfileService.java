package com.brisas.las_brisas.service.employee;

import com.brisas.las_brisas.DTO.employee.EmployeePersonalUpdateDTO;
import com.brisas.las_brisas.DTO.employee.EmployeeProfileDTO;
import com.brisas.las_brisas.model.employee.employee;
import com.brisas.las_brisas.repository.employee.Iemployee;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class employeeProfileService {

        private final Iemployee iEmployee;
        
        public EmployeeProfileDTO getFullProfile(int userId) {
                employee emp = iEmployee.findByUser_IdUser(userId)
                                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

                List<String> areas = emp.getEmployeeAreas().stream()
                                .map(ea -> ea.getArea().getNameArea())
                                .toList();

                List<String> cargos = emp.getEmployeePosts().stream()
                                .map(ep -> ep.getPost().getNamePost())
                                .toList();

                List<String> ubicaciones = emp.getEmploLocations().stream()
                                .map(el -> el.getLocation().getNameLocation())
                                .toList();

                List<String> horarios = emp.getEmploSchedules().stream()
                                .map(es -> es.getSchedule().getShift().name() + " " +
                                                es.getSchedule().getDay_week().name() +
                                                " (" + es.getSchedule().getTime_start() + " - "
                                                + es.getSchedule().getTime_end() + ")")
                                .toList();

                List<String> contratos = emp.getContracts().stream()
                                .map(c -> c.getType().name() + " (" + c.getStatus().name() +
                                                ") desde " + c.getFechaInicio() + " hasta " + c.getFechaFin())
                                .toList();

                List<String> certificados = emp.getCertificates().stream()
                                .map(cert -> cert.getType().name() + " [" + cert.getStatus().name() + "]")
                                .toList();

                return EmployeeProfileDTO.builder()
                                .id(emp.getId())
                                .firstName(emp.getFirstName())
                                .lastName(emp.getLastName())
                                .email(emp.getEmail())
                                .phone(emp.getPhone())
                                .tipoDocumento(emp.getTipoDocumento().name())
                                .documentNumber(emp.getDocumentNumber())
                                .birthdate(emp.getBirthdate())
                                .gender(emp.getGender().name())
                                .civilStatus(emp.getCivilStatus().name())
                                .address(emp.getAddress())
                                .photoProfile(emp.getPhotoProfile())

                                .cargos(cargos)
                                .areas(areas)
                                .locations(ubicaciones)
                                .horarios(horarios)
                                .contratos(contratos)
                                .certificados(certificados)

                                .supervisor(null)
                                .documentos(List.of())
                                .build();
        }

        @Transactional
        public void updatePersonalInfo(int userId, EmployeePersonalUpdateDTO dto) {
                employee emp = iEmployee.findByUser_IdUser(userId)
                                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

                emp.setFirstName(dto.getFirstName());
                emp.setLastName(dto.getLastName());
                emp.setPhone(dto.getPhone());
                emp.setAddress(dto.getAddress());

                emp.setCivilStatus(employee.civil_status.valueOf(dto.getCivilStatus()));
                emp.setGender(employee.gender.valueOf(dto.getGender()));

                iEmployee.save(emp);
        }
}
