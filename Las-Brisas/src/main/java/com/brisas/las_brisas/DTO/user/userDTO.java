package com.brisas.las_brisas.DTO.user;

import lombok.*;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class userDTO {
    private int idUser;
    private String username;
    private String email;
    private String status;
    private LocalDateTime createdAt;
}
