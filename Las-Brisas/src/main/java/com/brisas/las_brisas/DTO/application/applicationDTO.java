package com.brisas.las_brisas.DTO.application;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class applicationDTO {

    private int id;
    private LocalDateTime dateStart;
    private LocalDateTime dateEnd;
    private LocalDateTime dateCreate;
    private String reason;
    private String documentUrl;
    private String status;
    private int employeeId;
    private int applicationTypeid;
}
