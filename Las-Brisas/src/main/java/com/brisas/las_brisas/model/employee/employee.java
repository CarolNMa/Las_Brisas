package com.brisas.las_brisas.model.employee;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.brisas.las_brisas.model.contract.certificate;
import com.brisas.las_brisas.model.contract.contract;
import com.brisas.las_brisas.model.position.EmployeePost;
import com.brisas.las_brisas.model.user.user;

import jakarta.persistence.*;
import lombok.*;

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

    public enum tipo_documento {
        cc,
        ti,
        dni,
        pasaporte
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_documento", nullable = false)
    private tipo_documento tipoDocumento;

    @Column(name = "document", nullable = false)
    private String documentNumber;

    @Column(name = "birthdate", nullable = true)
    private LocalDate birthdate;

    @Column(name = "photo_profile", nullable = true)
    private String photoProfile;

    public enum gender {
        male,
        female,
        other
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false)
    private gender gender;

    @Column(name = "phone", nullable = false)
    private String phone;

    @Column(name = "email", nullable = false)
    private String email;

    public enum civil_status {
        single,
        married,
        divorced,
        widowed
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "civil_status", nullable = false)
    private civil_status civilStatus;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "id_user", nullable = true, referencedColumnName = "id_user")
    private user user;

    @Builder.Default
    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL)
    private List<employee_area> employeeAreas = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL)
    private List<EmployeePost> employeePosts = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL)
    private List<emplo_location> emploLocations = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL)
    private List<emplo_schedule> emploSchedules = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL)
    private List<contract> contracts = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL)
    private List<certificate> certificates = new ArrayList<>();

}
