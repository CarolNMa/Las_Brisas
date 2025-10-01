package com.brisas.las_brisas.DTO.contract;

import java.time.LocalDate;

import lombok.*;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class contractDTO {

    private int id;
    private LocalDate dateStart;
    private LocalDate dateEnd;
    private LocalDate dateUpdate;
    private String type;
    private String status;
    private String documentUrl;
    private int employee;
}
