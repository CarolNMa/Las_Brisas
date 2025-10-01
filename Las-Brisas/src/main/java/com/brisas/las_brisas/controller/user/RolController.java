package com.brisas.las_brisas.controller.user;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.user.rolDTO;
import com.brisas.las_brisas.service.user.RolService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/role")
@RequiredArgsConstructor
public class RolController {

    private final RolService rolService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<?> getAllRoles() {
        return ResponseEntity.ok(rolService.getAllRoles());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getRoleById(@PathVariable int id) {
        return ResponseEntity.ok(rolService.findById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteRole(@PathVariable int id) {
        ResponseDTO<rolDTO> response = rolService.deleteRole(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/")
    public ResponseEntity<Object> createRole(@RequestBody rolDTO dto) {
        ResponseDTO<rolDTO> response = rolService.save(dto);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
