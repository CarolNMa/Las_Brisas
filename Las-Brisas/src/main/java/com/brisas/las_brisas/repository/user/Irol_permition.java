package com.brisas.las_brisas.repository.user;

import org.springframework.data.jpa.repository.JpaRepository;
import com.brisas.las_brisas.model.user.rol_permition;

import java.util.List;
import java.util.Optional;

public interface Irol_permition extends JpaRepository<rol_permition, Integer> {

    List<rol_permition> findByRolId(int rolId);

    List<rol_permition> findByPermisionId(int permitionId);

    Optional<rol_permition> findByRolIdAndPermisionId(int rolId, int permitionId);

    boolean existsByRolIdAndPermisionId(int rolId, int permitionId);
}
