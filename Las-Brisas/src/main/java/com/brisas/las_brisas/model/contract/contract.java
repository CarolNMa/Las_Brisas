package com.brisas.las_brisas.model.contract;

import java.time.LocalDate;

import com.brisas.las_brisas.model.employee.employee;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    @Column(name ="fecha_inicio", nullable = false)
    private LocalDate fecha_inicio;

    @Column(name = "fecha_fin", nullable = false)
    private LocalDate fecha_fin;

    @Column(name = "fecha_renovacion", nullable = false)
    private LocalDate fecha_renovacion;

    public enum type {
        Practicas,
        Temporal,
        Permanente
    }

    @Column(name = "type", nullable = false)
    private type type;

    public enum status {
        Activo,
        Expirado,
        Terminado
    }

    @Column(name = "status", nullable = false)
    private status status;

    @ManyToOne
    @JoinColumn(name = "id_employee", nullable = false)
    private employee employee;

}
