package com.brisas.las_brisas.DTO.location;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class locationDTO {
    private int id;
    private String nameLocation;
    private String address;
}
