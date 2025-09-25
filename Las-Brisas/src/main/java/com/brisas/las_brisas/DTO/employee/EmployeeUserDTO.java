package com.brisas.las_brisas.DTO.employee;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmployeeUserDTO {
    private Integer id;
    private String username;
    private String email;
    private String status;
    private String area;
    private String cargo;
    private List<String> roles;
}
