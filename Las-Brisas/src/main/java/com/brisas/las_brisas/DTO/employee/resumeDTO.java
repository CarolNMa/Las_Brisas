package com.brisas.las_brisas.DTO.employee;

import java.time.LocalDateTime;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class resumeDTO {
    private int id;
    private LocalDateTime dateCreate;
    private LocalDateTime dateUpdate;
    private String documentUrl;
    private String observations;
    private int employeeId;
}
