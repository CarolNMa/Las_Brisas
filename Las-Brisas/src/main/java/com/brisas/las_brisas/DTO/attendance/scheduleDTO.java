package com.brisas.las_brisas.DTO.attendance;

import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class scheduleDTO {

   private int id;
   private LocalTime time_start;
   private LocalTime time_end;
   private String shift;
   private String documentUrl;
   private LocalTime overtime;
   private String day_week;
}
