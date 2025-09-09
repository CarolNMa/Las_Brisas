package com.brisas.las_brisas.model.training;

import jakarta.persistence.*;
import lombok.*;

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

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private type type;

    public enum type {
        multiplechoice,
        singlechoice,
        open
    }

    @ManyToOne
    @JoinColumn(name = "id_module_induction", nullable = false)
    private moduleInduction moduleInduction;
}
