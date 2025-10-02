package com.brisas.las_brisas.service.training;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.training.module_inductionDTO;
import com.brisas.las_brisas.model.training.induction;
import com.brisas.las_brisas.model.training.moduleInduction;
import com.brisas.las_brisas.repository.training.Imodule_induction;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ModuleInductionService {

    private final Imodule_induction imodulInduction;

    public List<moduleInduction> getAll() {
        return imodulInduction.findAll();
    }

    public List<moduleInduction> getModulesByInduction(int inductionId) {
        return imodulInduction.findByInductionId(inductionId);
    }

    public List<moduleInduction> findByInductionId(int inductionId) {
        return imodulInduction.findByInductionId(inductionId);
    }

    public Optional<moduleInduction> findById(int id) {
        return imodulInduction.findById(id);
    }

    public ResponseDTO<module_inductionDTO> delete(int id) {
        Optional<moduleInduction> opt = imodulInduction.findById(id);
        if (opt.isEmpty()) {
            return new ResponseDTO<>("El módulo de inducción no existe", HttpStatus.NOT_FOUND.toString(), null);
        }
        imodulInduction.deleteById(id);
        return new ResponseDTO<>("Módulo eliminado correctamente", HttpStatus.OK.toString(), null);
    }

    public ResponseDTO<module_inductionDTO> save(module_inductionDTO dto) {
        try {

            if (dto.getInductionId() <= 0) {
                return new ResponseDTO<>("El ID de la inducción es requerido", HttpStatus.BAD_REQUEST.toString(), null);
            }
            if (dto.getName() == null || dto.getName().trim().isEmpty()) {
                return new ResponseDTO<>("El nombre del módulo es obligatorio", HttpStatus.BAD_REQUEST.toString(),
                        null);
            }
            if (dto.getVideoUrl() == null || !dto.getVideoUrl().startsWith("http")) {
                return new ResponseDTO<>("La URL del video debe ser válida", HttpStatus.BAD_REQUEST.toString(), null);
            }

            moduleInduction entity = convertToEntity(dto);
            imodulInduction.save(entity);

            return new ResponseDTO<>("Módulo guardado correctamente", HttpStatus.OK.toString(), convertToDTO(entity));
        } catch (Exception e) {
            return new ResponseDTO<>("Error al guardar: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.toString(),
                    null);
        }
    }

    private moduleInduction convertToEntity(module_inductionDTO dto) {
        induction induction = new induction();
        induction.setId(dto.getInductionId());

        return moduleInduction.builder()
                .id(dto.getId())
                .name(dto.getName())
                .description(dto.getDescription())
                .video_url(dto.getVideoUrl())
                .induction(induction)
                .build();
    }

    private module_inductionDTO convertToDTO(moduleInduction entity) {
        return module_inductionDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .videoUrl(entity.getVideo_url())
                .inductionId(entity.getInduction() != null ? entity.getInduction().getId() : 0)
                .build();
    }
}
