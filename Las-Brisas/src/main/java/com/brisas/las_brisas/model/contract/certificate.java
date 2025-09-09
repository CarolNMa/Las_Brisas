package com.brisas.las_brisas.model.contract;

import java.time.LocalDateTime;

import com.brisas.las_brisas.model.employee.employee;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "certificate")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_certificate", unique = true, nullable = false)
    private int idCertificate;

    @Column(name = "date_certificate", nullable = false)
    private LocalDateTime dateCertificate;

    @Column(name = "document_url", nullable = false)
    private String documentUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private status status;

    public enum status {
        generado,
        enviado,
        validado
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private type type;

    public enum type {
        laboral
    }

    @ManyToOne
    @JoinColumn(name = "id_employee", nullable = false)
    private employee employee;
}
