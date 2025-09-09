package com.brisas.las_brisas.DTO.position;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class employee_postDTO {
    private int id;
    private int employeeId;
    private int postId;
}
