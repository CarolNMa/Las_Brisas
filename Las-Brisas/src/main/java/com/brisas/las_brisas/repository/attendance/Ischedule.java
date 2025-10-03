package com.brisas.las_brisas.repository.attendance;

import org.springframework.data.jpa.repository.JpaRepository;

import com.brisas.las_brisas.model.attendance.schedule;

import java.util.List;

public interface Ischedule extends JpaRepository<schedule, Integer> {
    List<schedule> findByDayWeek(schedule.DayWeek dayWeek);

    List<schedule> findByShift(schedule.Shift shift);
}
