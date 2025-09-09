package com.brisas.las_brisas.repository.training;

import org.springframework.data.jpa.repository.JpaRepository;
import com.brisas.las_brisas.model.training.question;

public interface Iquestion extends JpaRepository<question, Integer> {
}
