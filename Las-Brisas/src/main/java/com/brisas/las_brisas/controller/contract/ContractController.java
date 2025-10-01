package com.brisas.las_brisas.controller.contract;

import com.brisas.las_brisas.DTO.ResponseDTO;
import com.brisas.las_brisas.DTO.contract.contractDTO;
import com.brisas.las_brisas.service.contract.ContractService;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/contracts")
@RequiredArgsConstructor
public class ContractController {

    private final ContractService contractService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(contractService.getAll()); 
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/employee/{id}")
    public ResponseEntity<?> getByEmployee(@PathVariable int id) {
        return contractService.findById(id)
                .map(contract -> ResponseEntity.ok(new ResponseDTO<>("Contrato encontrado", "200", contract)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseDTO<>("Contrato no encontrado", "404", null)));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable int id) {
        return contractService.findById(id)
                .map(contract -> ResponseEntity.ok(new ResponseDTO<>("Contrato encontrado", "200", contract)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseDTO<>("Contrato no encontrado", "404", null)));
    }

    @PreAuthorize("hasRole('EMPLEADO')")
    @GetMapping("/me")
    public ResponseEntity<?> getMyContract(Authentication auth) {
        return contractService.findByUserEmail(auth.getName())
                .map(contract -> ResponseEntity.ok(
                        new ResponseDTO<>("Contrato encontrado", "200",
                                contractService.convertToDTO(contract))))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseDTO<>("Contrato no encontrado", "404", null)));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> create(@RequestBody contractDTO dto) {
        return ResponseEntity.ok(contractService.save(dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable int id, @RequestBody contractDTO dto) {
        dto.setId(id);
        return ResponseEntity.ok(contractService.save(dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable int id) {
        return ResponseEntity.ok(contractService.delete(id));
    }
}
