package com.brisas.las_brisas.model.employee;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

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
    private String documentUrl;

    @Column(name = "date", nullable = false)
    private LocalDateTime date;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private status status;

    public enum status {
        pendiente,
        aprobado,
        rechazado
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private type type;

    public enum type {
        llamado_atencion,
        acta,
        suspension
    }

    @ManyToOne
    @JoinColumn(name = "id_employee", nullable = false)
    private employee employee;

    @ManyToOne
    @JoinColumn(name = "id_resume", nullable = false)
    private resume resume;
}
