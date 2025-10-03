package com.brisas.las_brisas.DTO.location;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class employee_locationDetailDTO {
    private int id;

    private int employeeId;
    private String employeeName;
    private int locationId;
    private String locationName; 
}
