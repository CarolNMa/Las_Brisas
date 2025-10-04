package com.brisas.las_brisas.model.training;

import jakarta.persistence.*;
import lombok.*;
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
    private LocalDateTime dateAssignment;

    @Column(name = "date_complete")
    private LocalDateTime dateComplete;

    @Column(name = "deadline", nullable = false)
    private LocalDateTime deadline;

    @Column(name = "date_seen")
    private LocalDateTime dateSeen;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private status status;

    public enum status {
        pendiente,
        aprobado,
        rechazado
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "visto", nullable = false)
    private visto visto;

    public enum visto {
        si,
        no
    }

    @Column(name = "points", nullable = false)
    private int points;
}
