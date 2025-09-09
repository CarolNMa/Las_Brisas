package com.brisas.las_brisas.repository.attendance;

import org.springframework.data.jpa.repository.JpaRepository;
import com.brisas.las_brisas.model.attendance.schedule;

public interface Ischedule extends JpaRepository<schedule, Integer> {
}
