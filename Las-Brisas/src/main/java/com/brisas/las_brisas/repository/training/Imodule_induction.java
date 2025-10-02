package com.brisas.las_brisas.repository.training;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.brisas.las_brisas.model.training.moduleInduction;

public interface Imodule_induction extends JpaRepository<moduleInduction, Integer> {

    List<moduleInduction> findByInductionId(int inductionId);


}
