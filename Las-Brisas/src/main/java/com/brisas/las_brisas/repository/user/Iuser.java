package com.brisas.las_brisas.repository.user;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.brisas.las_brisas.model.user.user;

public interface Iuser extends JpaRepository<user, Integer> {
    Optional<user> findByEmail(String email);

    boolean existsByEmail(String email);
}
