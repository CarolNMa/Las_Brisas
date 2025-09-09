package com.brisas.las_brisas.DTO.contract;

import java.time.LocalDateTime;


import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class certificateDTO {

    private int id;
    private LocalDateTime dateCertificate;
    private String documentUrl;
    private String status;
    private String type;
    private int employee;
    
}
