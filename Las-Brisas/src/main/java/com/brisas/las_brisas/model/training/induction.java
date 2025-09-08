package com.brisas.las_brisas.model.training;

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

    @Column(name = "type", nullable = false)
    private type type;

    public enum type {
        Induction,
        Capacitacion
    }
    
    @Column(name = "status", nullable = false)
    private status status;

    public enum status {
        Pendiente,
        Aprobado,
        Rechazado
    }

    @Column(name = "date_create", nullable = false)
    private LocalDateTime date_create;

    @Column(name = "date_update", nullable = false)
    private LocalDateTime date_update;


}
