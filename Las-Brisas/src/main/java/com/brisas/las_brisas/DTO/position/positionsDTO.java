package com.brisas.las_brisas.DTO.position;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class positionsDTO {
    private int id;
    private String namePost;
    private String description;
    private String jobFunction;
    private String requirements;
}
