package com.brisas.las_brisas.repository.employee;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.brisas.las_brisas.model.employee.employee;

public interface Iemployee extends JpaRepository<employee, Integer> {

    Optional<employee> findByEmail(String email);

    Optional<employee> findByUser_IdUser(int idUser);

    Optional<employee> findByUser_Email(String email);

}
