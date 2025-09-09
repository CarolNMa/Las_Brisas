package com.brisas.las_brisas.repository.user;

import org.springframework.data.jpa.repository.JpaRepository;
import com.brisas.las_brisas.model.user.user_rol;

import java.util.List;
import java.util.Optional;

public interface Iuser_rol extends JpaRepository<user_rol, Integer> {

    List<user_rol> findByUserIdUser(int userId);   
    List<user_rol> findByRolId(int rolId);       
    Optional<user_rol> findByUserIdUserAndRolId(int userId, int rolId);

    boolean existsByUserIdUserAndRolId(int userId, int rolId);
}
