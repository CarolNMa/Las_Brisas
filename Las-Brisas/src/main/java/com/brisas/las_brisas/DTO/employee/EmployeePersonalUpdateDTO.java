package com.brisas.las_brisas.DTO.employee;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmployeePersonalUpdateDTO {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 50, message = "El nombre no puede superar los 50 caracteres")
    private String firstName;

    @NotBlank(message = "El apellido es obligatorio")
    @Size(max = 50, message = "El apellido no puede superar los 50 caracteres")
    private String lastName;

    @NotBlank(message = "El teléfono es obligatorio")
    @Pattern(regexp = "^[0-9]{7,15}$", message = "El teléfono debe tener entre 7 y 15 dígitos")
    private String phone;

    @NotBlank(message = "La dirección es obligatoria")
    @Size(max = 100, message = "La dirección no puede superar los 100 caracteres")
    private String address;


    @NotBlank(message = "El estado civil es obligatorio")
    private String civilStatus; 

    @NotBlank(message = "El género es obligatorio")
    private String gender; 
}
