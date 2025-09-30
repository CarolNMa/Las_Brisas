package com.brisas.Las_Brisas.user;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.user.user_rolDTO;
import com.brisas.las_brisas.service.user.UserRolService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user-role")
@RequiredArgsConstructor
public class UserRolControllerTest {

    private final UserRolService userRolService;

    @GetMapping("/")
    public ResponseEntity<?> getAllUserRoles() {
        return ResponseEntity.ok(userRolService.getAllUserRoles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserRolById(@PathVariable int id) {
        return ResponseEntity.ok(userRolService.findById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteUserRol(@PathVariable int id) {
        ResponseDTO<user_rolDTO> response = userRolService.deleteUserRol(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/")
    public ResponseEntity<Object> createUserRol(@RequestBody user_rolDTO dto) {
        ResponseDTO<user_rolDTO> response = userRolService.save(dto);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/assign/{userId}/{rolId}")
    public ResponseEntity<Object> assignRoleToUser(@PathVariable int userId, @PathVariable int rolId) {
        ResponseDTO<user_rolDTO> response = userRolService.assignRoleToUser(userId, rolId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/remove/{userId}/{rolId}")
    public ResponseEntity<Object> removeRoleFromUser(@PathVariable int userId, @PathVariable int rolId) {
        ResponseDTO<user_rolDTO> response = userRolService.removeRoleFromUser(userId, rolId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
