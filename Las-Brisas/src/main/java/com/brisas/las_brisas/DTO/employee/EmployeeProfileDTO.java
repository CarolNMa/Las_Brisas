package com.brisas.las_brisas.DTO.employee;

import java.time.LocalDate;
import java.util.List;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmployeeProfileDTO {
    private int id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String tipoDocumento;
    private String documentNumber;
    private LocalDate birthdate;
    private String gender;
    private String civilStatus;
    private String bloodType;
    private String address;
    private String photoProfile;

    private List<String> cargos;
    private List<String> areas;
    private List<String> locations;
    private List<String> horarios;
    private List<String> contratos;
    private List<String> certificados;

    
    private String supervisor;
    private List<String> documentos; 
}
