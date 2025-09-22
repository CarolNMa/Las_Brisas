package com.brisas.las_brisas.service.location;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.location.locationDTO;
import com.brisas.las_brisas.model.location.location;
import com.brisas.las_brisas.repository.location.Ilocation;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LocationService {

    private final Ilocation ilocation;

    public List<location> getAll() {
        return ilocation.findAll();
    }

    public Optional<location> findById(int id) {
        return ilocation.findById(id);
    }

    public ResponseDTO<locationDTO> delete(int id) {
        Optional<location> opt = ilocation.findById(id);
        if (opt.isEmpty()) {
            return new ResponseDTO<>("La ubicación no existe", HttpStatus.NOT_FOUND.toString(), null);
        }
        ilocation.deleteById(id);
        return new ResponseDTO<>("Ubicación eliminada correctamente", HttpStatus.OK.toString(), null);
    }

    public ResponseDTO<locationDTO> save(locationDTO dto) {
        try {
            if (dto.getNameLocation() == null || dto.getNameLocation().trim().isEmpty()) {
                return new ResponseDTO<>("El nombre de la ubicación es obligatorio",
                        HttpStatus.BAD_REQUEST.toString(), null);
            }
            if (dto.getAddress() == null || dto.getAddress().trim().isEmpty()) {
                return new ResponseDTO<>("La dirección es obligatoria",
                        HttpStatus.BAD_REQUEST.toString(), null);
            }

            location entity = convertToEntity(dto);
            ilocation.save(entity);

            return new ResponseDTO<>("Ubicación guardada correctamente",
                    HttpStatus.OK.toString(), convertToDTO(entity));
        } catch (Exception e) {
            return new ResponseDTO<>("Error al guardar: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR.toString(), null);
        }
    }

    private location convertToEntity(locationDTO dto) {
        return location.builder()
                .id(dto.getId())
                .nameLocation(dto.getNameLocation())
                .address(dto.getAddress())
                .build();
    }

    private locationDTO convertToDTO(location entity) {
        return locationDTO.builder()
                .id(entity.getId())
                .nameLocation(entity.getNameLocation())
                .address(entity.getAddress())
                .build();
    }
}
