package com.brisas.las_brisas.repository.training;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.brisas.las_brisas.model.training.question;

public interface Iquestion extends JpaRepository<question, Integer> {

    List<question> findByModuleInductionId(int moduleId);

    @Query("SELECT q FROM question q JOIN FETCH q.moduleInduction m LEFT JOIN FETCH q.answers WHERE m.id = :moduleId")
    List<question> findQuestionsWithAnswersByModule(int moduleId);

}
