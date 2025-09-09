package com.brisas.las_brisas.DTO.application;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class application_typeDTO {
    
    private int id;
    private String name;
    private boolean required;
}
