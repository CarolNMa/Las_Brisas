package com.brisas.las_brisas.DTO.training;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class module_inductionDTO {
    private int id;
    private String name;
    private String description;
    private String videoUrl;
    private int inductionId; // referencia
}
