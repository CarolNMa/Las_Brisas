package com.brisas.las_brisas.model.contract;

import java.time.LocalDate;

import com.brisas.las_brisas.model.employee.employee;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "contract")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class contract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private int id;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin", nullable = false)
    private LocalDate fechaFin;

    @Column(name = "fecha_renovacion", nullable = true)
    private LocalDate fechaRenovacion;

    @Column(name = "documentoUrl", nullable = true)
    private String documentoUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private type type;

    public enum type {
        practicas,
        temporal,
        permanente
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private status status;

    public enum status {
        activo,
        expirado,
        terminado
    }

    @ManyToOne
    @JoinColumn(name = "id_employee", nullable = false)
    private employee employee;

   
}
