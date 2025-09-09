package com.brisas.las_brisas.DTO.area;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class areaDTO {
    private int id;
    private String name;
    private String description;
   
}
