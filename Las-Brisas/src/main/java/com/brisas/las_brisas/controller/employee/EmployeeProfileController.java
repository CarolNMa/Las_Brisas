package com.brisas.las_brisas.controller.employee;

import com.brisas.las_brisas.DTO.employee.EmployeePersonalUpdateDTO;
import com.brisas.las_brisas.DTO.employee.EmployeeProfileDTO;
import com.brisas.las_brisas.repository.user.Iuser;
import com.brisas.las_brisas.service.employee.employeeProfileService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/v1/employees")
@RequiredArgsConstructor
public class EmployeeProfileController {

    private final employeeProfileService employeeProfileService;
    private final Iuser userRepo;

    @PreAuthorize("hasRole('EMPLEADO')")
    @GetMapping("/me")
    public ResponseEntity<EmployeeProfileDTO> getMyProfile(Authentication auth) {
        var user = userRepo.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return ResponseEntity.ok(employeeProfileService.getFullProfile(user.getIdUser()));
    }

    @PreAuthorize("hasRole('EMPLEADO')")
    @PutMapping("/me")
    public ResponseEntity<EmployeeProfileDTO> updateMyProfile(
            Authentication auth,
            @Valid @RequestBody EmployeePersonalUpdateDTO dto) {

        var user = userRepo.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        employeeProfileService.updatePersonalInfo(user.getIdUser(), dto);

        return ResponseEntity.ok(employeeProfileService.getFullProfile(user.getIdUser()));
    }
}
