package com.brisas.las_brisas.model.attendance;

import java.time.LocalDate;
import java.time.LocalTime;

import com.brisas.las_brisas.model.employee.employee;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "attendance")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "time_start", nullable = false)
    private LocalTime time_start;

    @Column(name = "time_end", nullable = false)
    private LocalTime time_end;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private status status;

    public enum status {
        presente,
        ausente,
        tarde
    }

    @ManyToOne
    @JoinColumn(name = "id_employee", nullable = false)
    private employee employee;
}
