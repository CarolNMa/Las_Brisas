package com.brisas.las_brisas.repository.employee;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.brisas.las_brisas.model.employee.employee_area;

public interface Iemployee_area extends JpaRepository<employee_area, Integer> {

    Optional<employee_area> findTopByEmployee_IdOrderByIdDesc(int employeeId);

}
