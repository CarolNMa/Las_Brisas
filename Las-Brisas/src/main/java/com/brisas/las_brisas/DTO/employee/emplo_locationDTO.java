package com.brisas.las_brisas.DTO.employee;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class emplo_locationDTO {
    private int id;
    private int employeeId;
    private int locationId;
}
