package com.brisas.las_brisas.repository.training;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.brisas.las_brisas.model.training.induction;

public interface Iinduction extends JpaRepository<induction, Integer> {

    @Query("SELECT ie.induction FROM induction_employee ie WHERE ie.employee.id = :employeeId")
    List<induction> findByEmployeeId(int employeeId);

    List<induction> findByType(induction.type type);

}
