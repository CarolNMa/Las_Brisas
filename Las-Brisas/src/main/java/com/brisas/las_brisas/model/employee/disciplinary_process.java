package com.brisas.las_brisas.model.employee;

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

@Entity
@Table(name = "disciplinary_process")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class disciplinary_process {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private int id;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "document_url", nullable = false)
    private String document_url;

    @Column(name = "date", nullable = false)
    private LocalDateTime date;

    @Column(name = "status", nullable = false)
    private status status;

    public enum status {
        Pendiente,
        Aprobado,
        Rechazado
    }

    @Column(name = "type", nullable = false)
    private type type;

    public enum type {
        Llamado_atencion,
        Acta,
        Suspension
    }

    @ManyToOne
    @JoinColumn(name = "id_employee", nullable = false)
    private employee employee;

    @ManyToOne
    @JoinColumn(name = "id_resume", nullable = false)
    private resume resume;
}
