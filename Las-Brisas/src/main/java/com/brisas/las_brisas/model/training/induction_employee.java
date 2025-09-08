package com.brisas.las_brisas.model.training;

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

import java.time.LocalDateTime;

import com.brisas.las_brisas.model.employee.employee;

@Entity
@Table(name = "induction_employee")
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class induction_employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_assignment", unique = true, nullable = false)
    private int id;

    @ManyToOne
    @JoinColumn(name = "id_induction", nullable = false)
    private induction induction;
    
    @ManyToOne
    @JoinColumn(name = "id_employee", nullable = false)
    private employee employee;

    @Column(name = "date_assignment", nullable = false)
    private LocalDateTime date_assignment;

    @Column(name = "date_complete", nullable = false)
    private LocalDateTime date_complete;

    @Column(name = "deadline", nullable = false)
    private LocalDateTime deadline;

    @Column(name = "date_seen" , nullable = false)
    private LocalDateTime date_seen;

    @Column(name = "status", nullable = false)
    private status status;

    public enum status {
        Pendiente,
        Aprobado,
        Rechazado
    }

    @Column(name = "visto", nullable = false)
    private visto visto;

    public enum visto {
        Si,
        No
    }

    @Column(name = "points" , nullable = false)
    private int points;
}
