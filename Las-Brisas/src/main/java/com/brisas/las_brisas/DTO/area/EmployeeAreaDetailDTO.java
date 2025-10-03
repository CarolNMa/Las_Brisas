package com.brisas.las_brisas.DTO.area;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmployeeAreaDetailDTO {
    private int id;
    private int employeeId;
    private String employeeName;
    private int areaId;
    private String areaName;
}
