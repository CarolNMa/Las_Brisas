package com.brisas.las_brisas.repository.application;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.brisas.las_brisas.model.application.application;

@Repository
public interface Iapplication extends JpaRepository<application, Integer> {

    List<application> findByEmployee_User_Email(String email);

    List<application> findByEmployee_Id(int employeeId);

}
