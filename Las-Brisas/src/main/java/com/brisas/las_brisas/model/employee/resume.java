package com.brisas.las_brisas.model.employee;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "resume")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class resume {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private int id;

    @Column(name = "date_create", nullable = false)
    private LocalDateTime date_create;

    @Column(name = "date_update", nullable = false)
    private LocalDateTime date_update;

    @Column(name = "document_url", nullable = false)
    private String document_url;

    @Column(name = "observations", nullable = false)
    private String observations;

    @OneToOne
    @JoinColumn(name = "id_employee", nullable = false)
    private employee employee;
}
