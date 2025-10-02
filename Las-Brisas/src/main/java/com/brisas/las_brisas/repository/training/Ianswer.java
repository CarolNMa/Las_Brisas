package com.brisas.las_brisas.repository.training;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.brisas.las_brisas.model.training.answer;

public interface Ianswer extends JpaRepository<answer, Integer> {

    List<answer> findByQuestionId(int questionId);
}
