package com.brisas.las_brisas.model.user;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "rol_permition")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class rol_permition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "id_rol", nullable = false)
    private rol rol;
    
    @ManyToOne
    @JoinColumn(name = "id_permition", nullable = false)
    private permition permision;
    
}
