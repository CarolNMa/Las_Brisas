package com.brisas.las_brisas.DTO.training;

import lombok.*;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class inductionDTO {
    private int id;
    private String name;
    private String description;
    private String type;   
    private String status; 
    private LocalDateTime dateCreate;
    private LocalDateTime dateUpdate;
}
