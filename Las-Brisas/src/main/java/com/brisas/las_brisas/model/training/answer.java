package com.brisas.las_brisas.model.training;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "answer")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class answer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private int id;

    @Column(name = "answer", nullable = false)
    private String answer;

    @Column(name = "response_correct", nullable = false)
    private boolean responseCorrect;

    @ManyToOne
    @JoinColumn(name = "id_question", nullable = false)
    private question question;
}
