package com.brisas.las_brisas.auth.service;

import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.brisas.las_brisas.model.user.user;
import com.brisas.las_brisas.repository.user.Iuser;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

        private final Iuser usuarioRepo;

        @Override
        public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
                user usuario = usuarioRepo.findByEmail(email)
                                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

                List<SimpleGrantedAuthority> authorities = usuario.getRoles().stream()
                                .map(r -> new SimpleGrantedAuthority("ROLE_" + r.getName()))
                                .toList();

                return new org.springframework.security.core.userdetails.User(
                                usuario.getEmail(),
                                usuario.getPassword(),
                                authorities);
        }
}
