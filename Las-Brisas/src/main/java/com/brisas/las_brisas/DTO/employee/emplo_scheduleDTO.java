package com.brisas.las_brisas.DTO.employee;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class emplo_scheduleDTO {
    private int id;
    private int employeeId;
    private int scheduleId;
}
