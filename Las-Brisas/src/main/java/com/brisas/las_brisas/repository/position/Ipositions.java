package com.brisas.las_brisas.repository.position;

import org.springframework.data.jpa.repository.JpaRepository;
import com.brisas.las_brisas.model.position.positions;

public interface Ipositions extends JpaRepository<positions, Integer> {
}
