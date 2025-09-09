package com.brisas.las_brisas.DTO.employee;

import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class employeeDTO {
    private int id;
    private String firstName;
    private String lastName;
    private String tipoDocumento;
    private String documentNumber;
    private LocalDate birthdate;
    private String photoProfile;
    private String gender;
    private String phone;
    private String email;
    private String civilStatus;
    private String address;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int userId;
}
