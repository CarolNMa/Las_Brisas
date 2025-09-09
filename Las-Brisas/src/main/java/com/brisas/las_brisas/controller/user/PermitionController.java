package com.brisas.las_brisas.controller.user;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.user.permitionDTO;
import com.brisas.las_brisas.service.user.PermitionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/permition")
@RequiredArgsConstructor
public class PermitionController {

    private final PermitionService permitionService;

    @GetMapping("/")
    public ResponseEntity<?> getAllPermitions() {
        return ResponseEntity.ok(permitionService.getAllPermitions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPermitionById(@PathVariable int id) {
        return ResponseEntity.ok(permitionService.findById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletePermition(@PathVariable int id) {
        ResponseDTO<permitionDTO> response = permitionService.deletePermition(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/")
    public ResponseEntity<Object> createOrUpdatePermition(@RequestBody permitionDTO dto) {
        ResponseDTO<permitionDTO> response = permitionService.save(dto);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
