package com.brisas.las_brisas.auth.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RegisterRequestDTO {

    private String username;
    private String email;
    private String password;
    private String rol; // ADMIN o EMPLEADO

}
