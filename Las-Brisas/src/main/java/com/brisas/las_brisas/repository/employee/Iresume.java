package com.brisas.las_brisas.repository.employee;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.brisas.las_brisas.model.employee.resume;

public interface Iresume extends JpaRepository<resume, Integer> {

    Optional<resume> findByEmployee_User_Email(String email);

    Optional<resume> findByEmployee_Id(int employeeId);
}
