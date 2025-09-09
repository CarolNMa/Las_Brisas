package com.brisas.las_brisas.DTO.contract;

import java.time.LocalDateTime;

import lombok.*;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class contractDTO {

    private int id;
    private LocalDateTime dateStart;
    private LocalDateTime dateEnd;
    private LocalDateTime dateUpdate;
    private String type;
    private String status;
    private int employee;
}
