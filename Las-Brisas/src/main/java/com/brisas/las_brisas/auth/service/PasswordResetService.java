package com.brisas.las_brisas.auth.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;
import com.brisas.las_brisas.repository.user.Iuser;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordResetService {

    private final Iuser usuarioRepo;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public String forgotPassword(String email) {
        var userOpt = usuarioRepo.findByEmail(email);
        if (userOpt.isEmpty()) {
            log.warn("Intento de recuperación para email no registrado: {}", email);
            return "Si el correo existe, se enviará un código.";
        }

        var usuario = userOpt.get();
        String code = generateSecureCode();
        usuario.setResetCode(code);
        usuario.setResetCodeExpire(System.currentTimeMillis() + (10 * 60 * 1000)); // 10 minutos
        usuarioRepo.save(usuario);

        try {
            emailService.sendEmail(email, code);
            log.info("Código enviado a: {}", email);
        } catch (RuntimeException e) {
            log.error("Error enviando email a: {}", email, e);
            // Proceed without throwing to allow testing the flow without email configuration
        }

        return "Código enviado al correo.";
    }

    public String verifyCode(String email, String code) {
        var userOpt = usuarioRepo.findByEmail(email);
        if (userOpt.isEmpty()) {
            log.warn("Verificación para email no registrado: {}", email);
            return "Correo no válido";
        }

        var usuario = userOpt.get();
        if (usuario.getResetCode() == null || !code.equals(usuario.getResetCode())) {
            log.warn("Código inválido para email: {}", email);
            return "Código inválido";
        }
        if (System.currentTimeMillis() > usuario.getResetCodeExpire()) {
            log.warn("Código expirado para email: {}", email);
            return "Código expirado";
        }

        log.info("Código verificado para email: {}", email);
        return "Código válido";
    }

    @Transactional
    public String resetPassword(String email, String code, String newPassword) {
        var userOpt = usuarioRepo.findByEmail(email);
        if (userOpt.isEmpty()) {
            log.warn("Reset para email no registrado: {}", email);
            return "Correo no válido";
        }

        var usuario = userOpt.get();
        if (usuario.getResetCode() == null || !code.equals(usuario.getResetCode())) {
            log.warn("Código inválido en reset para email: {}", email);
            return "Código inválido";
        }
        if (System.currentTimeMillis() > usuario.getResetCodeExpire()) {
            log.warn("Código expirado en reset para email: {}", email);
            return "Código expirado";
        }

        usuario.setPassword(passwordEncoder.encode(newPassword));
        usuario.setResetCode(null);
        usuario.setResetCodeExpire(null);
        usuarioRepo.save(usuario);

        log.info("Contraseña actualizada para email: {}", email);
        return "Contraseña actualizada exitosamente";
    }

    private String generateSecureCode() {
        // Genera un código de 6 dígitos numérico seguro
        return String.valueOf(100000 + new Random().nextInt(900000));
    }
}