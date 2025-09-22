package com.brisas.las_brisas.service.area;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.area.areaDTO;
import com.brisas.las_brisas.model.area.area;
import com.brisas.las_brisas.repository.area.Iarea;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AreaService {

    private final Iarea iarea;

    public List<area> getAll() {
        return iarea.findAll();
    }

    public Optional<area> findById(int id) {
        return iarea.findById(id);
    }

    public ResponseDTO<areaDTO> delete(int id) {
        Optional<area> opt = iarea.findById(id);
        if (opt.isEmpty()) {
            return new ResponseDTO<>("El área no existe", HttpStatus.NOT_FOUND.toString(), null);
        }
        iarea.deleteById(id);
        return new ResponseDTO<>("Área eliminada correctamente", HttpStatus.OK.toString(), null);
    }

    public ResponseDTO<areaDTO> save(areaDTO dto) {
        try {
            if (dto.getName() == null || dto.getName().trim().isEmpty()) {
                return new ResponseDTO<>("El nombre del área es obligatorio",
                        HttpStatus.BAD_REQUEST.toString(), null);
            }
            if (dto.getDescription() == null || dto.getDescription().trim().isEmpty()) {
                return new ResponseDTO<>("La descripción del área es obligatoria",
                        HttpStatus.BAD_REQUEST.toString(), null);
            }

            
            area entity = convertToEntity(dto);
            iarea.save(entity);

            return new ResponseDTO<>("Área guardada correctamente",
                    HttpStatus.OK.toString(), convertToDTO(entity));
        } catch (Exception e) {
            return new ResponseDTO<>("Error al guardar: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR.toString(), null);
        }
    }

    private area convertToEntity(areaDTO dto) {
        return area.builder()
                .id(dto.getId())
                .nameArea(dto.getName())
                .description(dto.getDescription())
                .build();
    }

    private areaDTO convertToDTO(area entity) {
        return areaDTO.builder()
                .id(entity.getId())
                .name(entity.getNameArea())
                .description(entity.getDescription())
                .build();
    }
}
