package com.brisas.las_brisas.auth.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import jakarta.validation.Valid;
import com.brisas.las_brisas.auth.service.PasswordResetService;
import com.brisas.las_brisas.auth.DTO.ForgotPasswordRequestDTO;
import com.brisas.las_brisas.auth.DTO.VerifyCodeRequestDTO;
import com.brisas.las_brisas.auth.DTO.ResetPasswordRequestDTO;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/v1/password")
@RequiredArgsConstructor
@Validated
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    @PostMapping("/forgot")
    public ResponseEntity<Map<String, String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequestDTO request) {
        String message = passwordResetService.forgotPassword(request.getEmail());
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, String>> verifyCode(@Valid @RequestBody VerifyCodeRequestDTO request) {
        String message = passwordResetService.verifyCode(request.getEmail(), request.getCode());
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset")
    public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody ResetPasswordRequestDTO request) {
        try {
            String message = passwordResetService.resetPassword(request.getEmail(), request.getCode(), request.getNewPassword());
            Map<String, String> response = new HashMap<>();
            response.put("message", message);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Error actualizando la contraseña");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
}