package com.brisas.las_brisas.DTO.position;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class employee_postDetailDTO {
    private int id;

    private int employeeId;
    private String employeeName; 
    private int postId;
    private String postName;
}
