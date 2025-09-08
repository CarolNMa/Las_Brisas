package com.brisas.las_brisas.model.application;


import java.time.LocalDateTime;

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
import com.brisas.las_brisas.model.employee.employee;

@Entity
@Table(name = "application")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private int id;

    @Column(name = "date_start", nullable = false)
    private LocalDateTime date_start;

    @Column(name = "date_end", nullable = false)
    private LocalDateTime date_end;

    @Column(name = "date_create", nullable = false)
    private LocalDateTime date_create;

    @Column(name = "reason", nullable = false)
    private String reason;

    @Column(name = "documentUrl", nullable = false)
    private String documentUrl;

    @Column(name = "status", nullable = false)
    private status status;

    public enum status {
        Pendiente,
        Aprobado,
        Rechazado
    }

    @ManyToOne
    @JoinColumn(name = "id_employee", nullable = false)
    private employee employee;

    @ManyToOne
    @JoinColumn(name = "id_application_type", nullable = false)
    private application_type application_type;
}
