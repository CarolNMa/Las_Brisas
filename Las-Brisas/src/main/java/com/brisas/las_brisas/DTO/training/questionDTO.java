package com.brisas.las_brisas.DTO.training;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class questionDTO {
    private int id;
    private String question;
    private String type; // multiplechoice, singlechoice, open
    private int moduleInductionId;
}
