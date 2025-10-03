package com.brisas.las_brisas.model.attendance;

import java.time.LocalTime;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "schedule")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "time_start", nullable = false)
    private LocalTime time_start;

    @Column(name = "time_end", nullable = false)
    private LocalTime time_end;

    @Enumerated(EnumType.STRING)
    @Column(name = "shift", nullable = false)
    private Shift shift;

    public enum Shift {
        MANANA,
        TARDE,
        NOCHE
    }

    @Column(name = "overtime", nullable = false)
    private LocalTime overtime;

    @Enumerated(EnumType.STRING)
    @Column(name = "day_week", nullable = false)
    private DayWeek dayWeek;

    public enum DayWeek {
        LUNES,
        MARTES,
        MIERCOLES,
        JUEVES,
        VIERNES,
        SABADO,
        DOMINGO
    }
}
