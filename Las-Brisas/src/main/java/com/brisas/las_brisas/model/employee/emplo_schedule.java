package com.brisas.las_brisas.model.employee;

import com.brisas.las_brisas.model.attendance.schedule;

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
@Table(name = "emplo_schedule")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class emplo_schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private int id;

    @ManyToOne
    @JoinColumn(name = "id_employee", nullable = false)
    private employee employee;
    @ManyToOne
    @JoinColumn(name = "id_schedule", nullable = false)
    private schedule schedule;
    
}
