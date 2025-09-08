package com.brisas.las_brisas.model.attendance;


import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "schedule")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private int id;

    @Column(name = "time_start", nullable = false)
    private LocalDateTime time_start;

    @Column(name = "time_end", nullable = false)
    private LocalDateTime time_end;

    @Column(name = "shift", nullable = false)
    private shift shift;

    public enum shift {
        Mañana,
        Tarde,
        Noche
    }

    @Column(name = "documentUrl", nullable = false)
    private String documentUrl;

    @Column(name = "overtime", nullable = false)
    private LocalDateTime overtime;

    @Column(name = "day_Week", nullable = false)
    private day_Week day_Week;

    public enum day_Week {
        Lunes,
        Martes,
        Miercoles,
        Jueves,
        Viernes,
        Sabado,
        Domingo
    }
}
