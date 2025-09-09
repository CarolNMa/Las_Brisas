package com.brisas.las_brisas.repository.employee;

import org.springframework.data.jpa.repository.JpaRepository;
import com.brisas.las_brisas.model.employee.employee;

public interface Iemployee extends JpaRepository<employee, Integer> {
}
