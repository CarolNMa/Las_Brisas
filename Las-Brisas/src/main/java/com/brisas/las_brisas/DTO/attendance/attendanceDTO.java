package com.brisas.las_brisas.DTO.attendance;

import java.time.LocalDate;
import java.time.LocalTime;

import com.brisas.las_brisas.model.employee.employee;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class attendanceDTO {

    private int id;
    private LocalDate date;
    private LocalTime timeStart;
    private LocalTime timeEnd;
    private String status;
    private employee employee;
}
