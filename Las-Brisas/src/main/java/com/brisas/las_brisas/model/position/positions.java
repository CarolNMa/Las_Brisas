package com.brisas.las_brisas.model.position;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "positions")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class positions {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "name_post", nullable = false)
    private String namePost;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "job_function", nullable = false)
    private String jon_function;

    @Column(name = "requirements", nullable = false)
    private String requirements;

}
