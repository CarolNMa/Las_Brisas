package com.brisas.las_brisas.model.user;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users") 
@Data  
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class user {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_user", unique = true, nullable = false)
    private int idUser;

    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private status status;

    public enum status {
        active,
        inactive
    }

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}