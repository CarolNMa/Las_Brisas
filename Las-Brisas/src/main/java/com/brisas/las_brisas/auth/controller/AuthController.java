package com.brisas.las_brisas.auth.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;

import com.brisas.las_brisas.auth.DTO.AuthRequestDTO;
import com.brisas.las_brisas.auth.DTO.LoginResponseDTO;
import com.brisas.las_brisas.auth.DTO.RegisterRequestDTO;
import com.brisas.las_brisas.auth.service.CustomUserDetailsService;
import com.brisas.las_brisas.model.user.rol;
import com.brisas.las_brisas.model.user.user;
import com.brisas.las_brisas.model.user.user.status;
import com.brisas.las_brisas.repository.user.Irol;
import com.brisas.las_brisas.repository.user.Iuser;
import com.brisas.las_brisas.security.JwtService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

        private final AuthenticationManager authManager;
        private final CustomUserDetailsService userDetailsService;
        private final JwtService jwtService;
        private final Iuser usuarioRepo;
        private final Irol rolRepo;
        private final PasswordEncoder encoder;

        @PostMapping("/login")
        public ResponseEntity<LoginResponseDTO> login(@RequestBody AuthRequestDTO req) {
                authManager.authenticate(
                                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));

                user usuario = usuarioRepo.findByEmail(req.getEmail())
                                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

                UserDetails userDetails = userDetailsService.loadUserByUsername(req.getEmail());
                String token = jwtService.generateToken(userDetails);

                List<String> roles = usuario.getRoles()
                                .stream()
                                .map(r -> r.getName())
                                .toList();

                LoginResponseDTO response = new LoginResponseDTO(
                                token,
                                usuario.getEmail(),
                                usuario.getUsername(),
                                roles);

                return ResponseEntity.ok(response);
        }

        @PostMapping("/register")
        public ResponseEntity<String> register(@RequestBody RegisterRequestDTO req) {
                if (usuarioRepo.findByEmail(req.getEmail()).isPresent()) {
                        return ResponseEntity.badRequest().body("El email ya está registrado.");
                }

                rol rol = rolRepo.findByName(req.getRol().toUpperCase())
                                .orElseThrow(() -> new RuntimeException("Rol no existe"));

                user nuevo = user.builder()
                                .username(req.getUsername())
                                .email(req.getEmail())
                                .password(encoder.encode(req.getPassword()))
                                .status(status.active)
                                .createdAt(LocalDateTime.now())
                                .roles(Set.of(rol))
                                .build();

                usuarioRepo.save(nuevo);

                return ResponseEntity.ok("Usuario registrado con rol: " + rol.getName());
        }
}
