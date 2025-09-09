package com.brisas.las_brisas.DTO.training;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class answerDTO {
    private int id;
    private String answer;
    private boolean responseCorrect;
    private int questionId;
}
