package com.brisas.las_brisas.model.contract;

import java.time.LocalDateTime;

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
@Table(name = "certificate")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class certificate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_certificate", unique = true, nullable = false)
    private int id_certificate;

    @Column(name = "date_certificate", nullable = false)
    private LocalDateTime date_certificate;

    @Column(name = "document_url", nullable = false)
    private String document_url;

    public enum status {
        Generado,
        Enviado,
        Validado
    }

    @Column(name = "status", nullable = false)
    private status status;

    public enum type {
        Laboral
    }

    @Column(name = "type", nullable = false)
    private type type;

    @ManyToOne
    @JoinColumn(name = "id_employee", nullable = false)
    private employee employee;

}
