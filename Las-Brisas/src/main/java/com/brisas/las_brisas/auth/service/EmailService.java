package com.brisas.las_brisas.auth.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendEmail(String email, String code) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("lasbrisas000@gmail.com");
            message.setTo(email);
            message.setSubject("Recuperación de contraseña");
            message.setText("Tu código de verificación es: " + code);
            mailSender.send(message);
            log.info("Email enviado a: {}", email);
        } catch (Exception e) {
            log.error("Error enviando email a: {}", email, e);
            throw new RuntimeException("Error enviando email");
        }
    }
}