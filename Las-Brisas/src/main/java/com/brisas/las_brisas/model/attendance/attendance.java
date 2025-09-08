package com.brisas.las_brisas.model.attendance;

import java.sql.Time;

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
@Table(name = "attendance")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private int id;

    @Column(name = "date", nullable = false)
    private String date;

    @Column(name = "time_start", nullable = false)
    private Time time_start;

    @Column(name = "time_end", nullable = false)
    private Time time_end;

    public enum status {
        Presente,
        Ausente,
        Tarde
    }

    @Column(name = "status", nullable = false)
    private status status;

    @ManyToOne
    @JoinColumn(name = "id_employee", nullable = false)
    private employee employee;
}
