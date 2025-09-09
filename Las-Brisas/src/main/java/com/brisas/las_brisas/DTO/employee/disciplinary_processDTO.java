package com.brisas.las_brisas.DTO.employee;

import java.time.LocalDateTime;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class disciplinary_processDTO {
    private int id;
    private String description;
    private String documentUrl;
    private LocalDateTime date;
    private String status;
    private String type;
    private int employeeId;
    private int resumeId;
}
