package com.brisas.las_brisas.DTO.attendance;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class employee_scheduleDetailDTO {
    private int id;

    private int employeeId;
    private String employeeName; 

    private int scheduleId;
    private String scheduleName; 
}
