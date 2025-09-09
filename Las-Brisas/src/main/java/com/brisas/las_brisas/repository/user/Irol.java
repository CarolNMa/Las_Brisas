package com.brisas.las_brisas.repository.user;

import org.springframework.data.jpa.repository.JpaRepository;
import com.brisas.las_brisas.model.user.rol;

public interface Irol extends JpaRepository<rol, Integer> {
}
