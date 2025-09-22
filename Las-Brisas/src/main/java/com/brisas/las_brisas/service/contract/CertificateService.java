package com.brisas.las_brisas.service.contract;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.contract.certificateDTO;
import com.brisas.las_brisas.model.contract.certificate;
import com.brisas.las_brisas.model.employee.employee;
import com.brisas.las_brisas.repository.contract.Icertificate;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CertificateService {

    private final Icertificate icertificate;

    public List<certificate> getAll() {
        return icertificate.findAll();
    }

    public Optional<certificate> findById(int id) {
        return icertificate.findById(id);
    }

    public ResponseDTO<certificateDTO> delete(int id) {
        Optional<certificate> opt = icertificate.findById(id);
        if (opt.isEmpty()) {
            return new ResponseDTO<>("El certificado no existe", HttpStatus.NOT_FOUND.toString(), null);
        }
        icertificate.deleteById(id);
        return new ResponseDTO<>("Certificado eliminado correctamente", HttpStatus.OK.toString(), null);
    }

    public ResponseDTO<certificateDTO> save(certificateDTO dto) {
        try {
            if (dto.getEmployee() <= 0) {
                return new ResponseDTO<>("El ID del empleado es requerido", HttpStatus.BAD_REQUEST.toString(), null);
            }
            if (dto.getDocumentUrl() == null || dto.getDocumentUrl().trim().isEmpty()) {
                return new ResponseDTO<>("La URL del documento es obligatoria", HttpStatus.BAD_REQUEST.toString(),
                        null);
            }
            if (dto.getDateCertificate() == null) {
                return new ResponseDTO<>("La fecha del certificado es obligatoria", HttpStatus.BAD_REQUEST.toString(),
                        null);
            }

            certificate entity = convertToEntity(dto);
            icertificate.save(entity);

            return new ResponseDTO<>("Certificado guardado correctamente",
                    HttpStatus.OK.toString(), convertToDTO(entity));
        } catch (Exception e) {
            return new ResponseDTO<>("Error al guardar: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR.toString(), null);
        }
    }

    private certificate convertToEntity(certificateDTO dto) {
        employee e = new employee();
        e.setId(dto.getEmployee());

        certificate.status statusEnum;
        try {
            statusEnum = certificate.status.valueOf(dto.getStatus().toUpperCase());
        } catch (Exception s) {
            statusEnum = certificate.status.generado;
        }

        certificate.type typeEnum;
        try {
            typeEnum = certificate.type.valueOf(dto.getType().toUpperCase());
        } catch (Exception t) {
            typeEnum = certificate.type.laboral;
        }

        return certificate.builder()
                .idCertificate(dto.getId())
                .dateCertificate(dto.getDateCertificate())
                .documentUrl(dto.getDocumentUrl())
                .status(statusEnum)
                .type(typeEnum)
                .employee(e)
                .build();
    }

    private certificateDTO convertToDTO(certificate entity) {
        return certificateDTO.builder()
                .id(entity.getIdCertificate())
                .dateCertificate(entity.getDateCertificate())
                .documentUrl(entity.getDocumentUrl())
                .status(entity.getStatus().name())
                .type(entity.getType().name())
                .employee(entity.getEmployee() != null ? entity.getEmployee().getId() : 0)
                .build();
    }
}
