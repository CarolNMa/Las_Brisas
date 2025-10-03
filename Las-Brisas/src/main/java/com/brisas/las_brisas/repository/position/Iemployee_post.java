package com.brisas.las_brisas.repository.position;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.brisas.las_brisas.model.position.EmployeePost;

public interface Iemployee_post extends JpaRepository<EmployeePost, Integer> {

    Optional<EmployeePost> findTopByEmployee_IdOrderByIdDesc(int employeeId);


}
