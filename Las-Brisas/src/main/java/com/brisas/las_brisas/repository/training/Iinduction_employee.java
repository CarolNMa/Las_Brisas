package com.brisas.las_brisas.repository.training;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.brisas.las_brisas.model.training.induction_employee;

public interface Iinduction_employee extends JpaRepository<induction_employee, Integer> {

    // Buscar asignaciones de inducción por email del usuario
    @Query("SELECT ie FROM induction_employee ie WHERE ie.employee.user.email = :email")
    List<induction_employee> findByUserEmail(String email);

    List<induction_employee> findByEmployeeId(int employeeId);

    // Buscar asignaciones por inducción
    List<induction_employee> findByInductionId(int inductionId);

}
