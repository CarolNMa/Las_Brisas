package com.brisas.las_brisas.repository.attendance;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.brisas.las_brisas.model.attendance.attendance;

public interface Iattendance extends JpaRepository<attendance, Integer> {
    List<attendance> findByEmployee_User_Email(String email);

    Optional<attendance> findByEmployee_IdAndDate(int employeeId, LocalDate date);

    List<attendance> findByEmployee_Id(int employeeId);

}
