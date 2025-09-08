package com.brisas.las_brisas.model.employee;

import java.time.LocalDateTime;

import com.brisas.las_brisas.model.user.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "employee")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_employee", unique = true, nullable = false)
    private int id;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    public enum TipoDocumento {
        CC,
        TI,
        DNI,
        PASAPORTE
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_documento", nullable = false)
    private TipoDocumento tipoDocumento;

    @Column(name = "document", nullable = false)
    private String documentNumber;

    @Column(name = "birthdate", nullable = false)
    private String birthdate;

    @Column(name = "photo_profile", nullable = false)
    private String photoProfile;

    public enum gender {
        MALE,
        FEMALE,
        OTHER
    }

    @Column(name = "gender", nullable = false)
    private gender gender;

    @Column(name = "phone", nullable = false)
    private String phone;

    @Column(name = "email", nullable = false)
    private String email;

    public enum civilStatus {
        SINGLE,
        MARRIED,
        DIVORCED,
        WIDOWED
    }

    @Column(name = "civil_status", nullable = false)
    private civilStatus civilStatus;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "id_user", nullable = false)
    private user user;

}
