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

@Entity
@Table(name = "question")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private int id;

    @Column(name = "question", nullable = false)
    private String question;

    @Column(name = "type", nullable = false)
    private type type;

    public enum type {
        MultipleChoice,
        SingleChoice,
        Open
    }

    @ManyToOne
    @JoinColumn(name = "id_moduleInduction", nullable = false)
    private moduleInduction moduleInduction;

}
