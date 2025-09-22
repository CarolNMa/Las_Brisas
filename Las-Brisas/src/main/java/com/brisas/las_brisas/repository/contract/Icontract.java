package com.brisas.las_brisas.repository.contract;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.brisas.las_brisas.model.contract.contract;

public interface Icontract extends JpaRepository<contract, Integer> {
    Optional<contract> findByEmployee_User_Email(String email);

}
