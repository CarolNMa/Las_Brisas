package com.brisas.las_brisas.DTO.employee;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class employee_areaDTO {
    private int id;
    private int employeeId;
    private int areaId;
}
