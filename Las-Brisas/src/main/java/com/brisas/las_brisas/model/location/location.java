package com.brisas.las_brisas.model.location;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "location")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private int id;

    @Column(name = "name_location", nullable = false)
    private String nameLocation;

    @Column(name = "address", nullable = false)
    private String address;

    public Object getNombreUbicacion() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getNombreUbicacion'");
    }
    
    
}
