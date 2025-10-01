package com.brisas.las_brisas.service.contract;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.contract.contractDTO;
import com.brisas.las_brisas.model.contract.contract;
import com.brisas.las_brisas.model.employee.employee;
import com.brisas.las_brisas.repository.contract.Icontract;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ContractService {

    private final Icontract icontract;

    public List<contractDTO> getAll() {
        return icontract.findAll().stream()
                .map(this::convertToDTO)
                .toList();
    }

    public Optional<contract> findById(int id) {
        return icontract.findById(id);
    }

    public Optional<contract> findByUserEmail(String email) {
        return icontract.findByEmployee_User_Email(email);
    }

    public ResponseDTO<contractDTO> delete(int id) {
        Optional<contract> opt = icontract.findById(id);
        if (opt.isEmpty()) {
            return new ResponseDTO<>("El contrato no existe", HttpStatus.NOT_FOUND.toString(), null);
        }
        icontract.deleteById(id);
        return new ResponseDTO<>("Contrato eliminado correctamente", HttpStatus.OK.toString(), null);
    }

    public ResponseDTO<contractDTO> save(contractDTO dto) {
        try {
            if (dto.getEmployee() <= 0) {
                return new ResponseDTO<>("El ID del empleado es requerido", HttpStatus.BAD_REQUEST.toString(), null);
            }
            if (dto.getDateStart() == null) {
                return new ResponseDTO<>("La fecha de inicio es obligatoria", HttpStatus.BAD_REQUEST.toString(), null);
            }
            if (dto.getDateEnd() != null && dto.getDateStart().isAfter(dto.getDateEnd())) {
                return new ResponseDTO<>("La fecha de fin no puede ser anterior a la de inicio",
                        HttpStatus.BAD_REQUEST.toString(), null);
            }
            if (dto.getType() == null || dto.getType().trim().isEmpty()) {
                return new ResponseDTO<>("El tipo de contrato es obligatorio", HttpStatus.BAD_REQUEST.toString(), null);
            }

            contract entity = convertToEntity(dto);
            icontract.save(entity);

            return new ResponseDTO<>("Contrato guardado correctamente",
                    HttpStatus.OK.toString(), convertToDTO(entity));
        } catch (Exception e) {
            return new ResponseDTO<>("Error al guardar: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR.toString(), null);
        }
    }

    public ResponseDTO<contractDTO> saveWithDocument(contractDTO dto, MultipartFile document) {
        try {
            contract entity = convertToEntity(dto);

            if (document != null && !document.isEmpty()) {
                Path uploadDir = Paths.get("uploads/contracts");
                if (!Files.exists(uploadDir)) {
                    Files.createDirectories(uploadDir);
                }

                String fileName = UUID.randomUUID() + "_" + document.getOriginalFilename();
                Path filePath = uploadDir.resolve(fileName);
                Files.copy(document.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                entity.setDocumentoUrl("uploads/contracts/" + fileName);
            }

            contract saved = icontract.save(entity);
            return new ResponseDTO<>("Contrato guardado correctamente", "200", convertToDTO(saved));

        } catch (Exception e) {
            return new ResponseDTO<>("Error al guardar contrato: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR.toString(), null);
        }
    }

    private contract convertToEntity(contractDTO dto) {
        employee e = new employee();
        e.setId(dto.getEmployee());

        contract.type typeEnum;
        try {
            typeEnum = contract.type.valueOf(dto.getType().toLowerCase());
        } catch (Exception t) {
            typeEnum = contract.type.practicas;
        }

        contract.status statusEnum;
        try {
            statusEnum = contract.status.valueOf(dto.getStatus().toLowerCase());
        } catch (Exception s) {
            statusEnum = contract.status.activo;
        }
        return contract.builder()
                .id(dto.getId())
                .fechaInicio(dto.getDateStart())
                .fechaFin(dto.getDateEnd())
                .fechaRenovacion(dto.getDateUpdate() != null ? dto.getDateUpdate() : dto.getDateEnd())
                .documentoUrl(dto.getDocumentUrl())
                .type(typeEnum)
                .status(statusEnum)
                .employee(e)
                .build();

    }

    public contractDTO convertToDTO(contract entity) {
        return contractDTO.builder()
                .id(entity.getId())
                .dateStart(entity.getFechaInicio())
                .dateEnd(entity.getFechaFin())
                .dateUpdate(entity.getFechaRenovacion())
                .type(entity.getType().name())
                .status(entity.getStatus().name())
                .documentUrl(entity.getDocumentoUrl())
                .employee(entity.getEmployee() != null ? entity.getEmployee().getId() : 0)
                .build();
    }

}
