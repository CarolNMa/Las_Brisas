package com.brisas.las_brisas.repository.training;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.brisas.las_brisas.model.training.question;

public interface Iquestion extends JpaRepository<question, Integer> {

    List<question> findByModuleInductionId(int moduleId);
}
