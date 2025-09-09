package com.brisas.las_brisas.model.training;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "induction")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class induction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private int id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", nullable = false)
    private String description; 

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private type type;

    public enum type {
        induction,
        capacitacion
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private status status;

    public enum status {
        pendiente,
        aprobado,
        rechazado
    }

    @Column(name = "date_create", nullable = false)
    private LocalDateTime dateCreate;

    @Column(name = "date_update", nullable = false)
    private LocalDateTime dateUpdate;
}
