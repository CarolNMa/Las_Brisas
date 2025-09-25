package com.brisas.las_brisas.user;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.user.rol_permitionDTO;
import com.brisas.las_brisas.service.user.RolPermitionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/rol-permition")
@RequiredArgsConstructor
public class RolPermitionControllerTest {

    private final RolPermitionService rolPermitionService;

    @GetMapping("/")
    public ResponseEntity<?> getAllRolPermitions() {
        return ResponseEntity.ok(rolPermitionService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRolPermitionById(@PathVariable int id) {
        return ResponseEntity.ok(rolPermitionService.findById(id));
    }

    @GetMapping("/rol/{rolId}")
    public ResponseEntity<?> getPermitionsByRolId(@PathVariable int rolId) {
        return ResponseEntity.ok(rolPermitionService.findPermitionsByRolId(rolId));
    }

    @GetMapping("/permition/{permitionId}")
    public ResponseEntity<?> getRolesByPermitionId(@PathVariable int permitionId) {
        return ResponseEntity.ok(rolPermitionService.findRolesByPermitionId(permitionId));
    }

    @PostMapping("/")
    public ResponseEntity<Object> createOrUpdateRolPermition(@RequestBody rol_permitionDTO dto) {
        ResponseDTO<rol_permitionDTO> response = rolPermitionService.save(dto);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteRolPermition(@PathVariable int id) {
        ResponseDTO<rol_permitionDTO> response = rolPermitionService.delete(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
