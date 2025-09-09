package com.brisas.las_brisas.repository.location;

import org.springframework.data.jpa.repository.JpaRepository;
import com.brisas.las_brisas.model.location.location;

public interface Ilocation extends JpaRepository<location, Integer> {
}
