package com.brisas.las_brisas.DTO.attendance;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttendanceRequest {
    private String type; // CHECK_IN o CHECK_OUT
}
