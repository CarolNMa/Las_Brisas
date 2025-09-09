package com.brisas.las_brisas.service.contract;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.contract.contractDTO;
import com.brisas.las_brisas.model.contract.contract;
import com.brisas.las_brisas.model.employee.employee;
import com.brisas.las_brisas.repository.contract.Icontract;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ContractService {

    private final Icontract icontract;

    public List<contract> getAll() {
        return icontract.findAll();
    }

    public Optional<contract> findById(int id) {
        return icontract.findById(id);
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
            contract entity = convertToEntity(dto);
            icontract.save(entity);
            return new ResponseDTO<>(HttpStatus.OK.toString(), "Contrato guardado correctamente", convertToDTO(entity));
        } catch (Exception e) {
            return new ResponseDTO<>(HttpStatus.INTERNAL_SERVER_ERROR.toString(), "Error al guardar: " + e.getMessage(), null);
        }
    }

    private contract convertToEntity(contractDTO dto) {
        employee e = new employee();
        e.setId(dto.getEmployee());

        contract.type typeEnum;
        try {
            typeEnum = contract.type.valueOf(dto.getType().toUpperCase());
        } catch (Exception t) {
            typeEnum = contract.type.practicas;
        }

        contract.status statusEnum;
        try {
            statusEnum = contract.status.valueOf(dto.getStatus().toUpperCase());
        } catch (Exception s) {
            statusEnum = contract.status.activo;
        }

        return contract.builder()
                .id(dto.getId())
                .fechaInicio(dto.getDateStart())
                .fechaFin(dto.getDateEnd())
                .fechaRenovacion(dto.getDateUpdate())
                .type(typeEnum)
                .status(statusEnum)
                .employee(e)
                .build();
    }

    private contractDTO convertToDTO(contract entity) {
        return contractDTO.builder()
                .id(entity.getId())
                .dateStart(entity.getFechaInicio())
                .dateEnd(entity.getFechaFin())
                .dateUpdate(entity.getFechaRenovacion())
                .type(entity.getType().name())
                .status(entity.getStatus().name())
                .employee(entity.getEmployee() != null ? entity.getEmployee().getId() : 0)
                .build();
    }
}
