package com.brisas.las_brisas.repository.employee;

import org.springframework.data.jpa.repository.JpaRepository;
import com.brisas.las_brisas.model.employee.resume;

public interface Iresume extends JpaRepository<resume, Integer> {
}
