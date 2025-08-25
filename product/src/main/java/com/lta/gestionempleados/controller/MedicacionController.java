package com.lta.gestionempleados.controller;

import com.lta.gestionempleados.exception.ResourceNotFoundException;
import com.lta.gestionempleados.model.Medicacion;
import com.lta.gestionempleados.repository.MedicacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/")
@CrossOrigin(origins = "http://localhost:4200")
public class MedicacionController {

    @Autowired
    private MedicacionRepository medicacionRepository;

    // Listar todas las medicaciones
    @GetMapping("/medicaciones")
    public List<Medicacion> listarTodasLasMedicaciones() {
        return medicacionRepository.findAll();
    }

    // Listar solo medicaciones activas
    @GetMapping("/medicaciones/activas")
    public List<Medicacion> listarMedicacionesActivas() {
        return medicacionRepository.findByActivoTrue();
    }

    // Buscar medicaciones vigentes en fecha actual
    @GetMapping("/medicaciones/vigentes")
    public List<Medicacion> listarMedicacionesVigentes() {
        return medicacionRepository.findMedicacionesVigentesEnFecha(LocalDate.now());
    }

    // Buscar medicaciones que vencen pronto (próximos 30 días)
    @GetMapping("/medicaciones/vencen-pronto")
    public List<Medicacion> listarMedicacionesQueVencenPronto() {
        LocalDate hoy = LocalDate.now();
        LocalDate en30Dias = hoy.plusDays(30);
        return medicacionRepository.findMedicacionesQueVencenEntre(hoy, en30Dias);
    }

    // Buscar medicaciones por nombre
    @GetMapping("/medicaciones/buscar")
    public List<Medicacion> buscarMedicacionesPorNombre(@RequestParam String nombre) {
        return medicacionRepository.findByNombreContainingIgnoreCase(nombre);
    }

    // Buscar medicaciones por médico
    @GetMapping("/medicaciones/medico")
    public List<Medicacion> buscarMedicacionesPorMedico(@RequestParam String medico) {
        return medicacionRepository.findByMedicoPrescriptorContainingIgnoreCase(medico);
    }

    // Guardar nueva medicación
    @PostMapping("/medicaciones")
    public Medicacion guardarMedicacion(@Valid @RequestBody Medicacion medicacion) {
        return medicacionRepository.save(medicacion);
    }

    // Obtener medicación por ID
    @GetMapping("/medicaciones/{id}")
    public ResponseEntity<Medicacion> obtenerMedicacionPorId(@PathVariable Long id) {
        Medicacion medicacion = medicacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No existe la medicación con el ID: " + id));
        return ResponseEntity.ok(medicacion);
    }

    // Actualizar medicación
    @PutMapping("/medicaciones/{id}")
    @Transactional
    public ResponseEntity<Medicacion> actualizarMedicacion(@PathVariable Long id, 
                                                          @Valid @RequestBody Medicacion detallesMedicacion) {
        Medicacion medicacion = medicacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No existe la medicación con el ID: " + id));

        medicacion.setNombre(detallesMedicacion.getNombre());
        medicacion.setDosis(detallesMedicacion.getDosis());
        medicacion.setFrecuencia(detallesMedicacion.getFrecuencia());
        medicacion.setFechaInicio(detallesMedicacion.getFechaInicio());
        medicacion.setFechaFin(detallesMedicacion.getFechaFin());
        medicacion.setIndicaciones(detallesMedicacion.getIndicaciones());
        medicacion.setMedicoPrescriptor(detallesMedicacion.getMedicoPrescriptor());
        medicacion.setObservaciones(detallesMedicacion.getObservaciones());
        medicacion.setActivo(detallesMedicacion.getActivo());

        Medicacion medicacionActualizada = medicacionRepository.save(medicacion);
        return ResponseEntity.ok(medicacionActualizada);
    }

    // Desactivar medicación (soft delete)
    @PutMapping("/medicaciones/{id}/desactivar")
    @Transactional
    public ResponseEntity<Map<String, Boolean>> desactivarMedicacion(@PathVariable Long id) {
        Medicacion medicacion = medicacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No existe la medicación con el ID: " + id));

        medicacion.setActivo(false);
        medicacionRepository.save(medicacion);

        Map<String, Boolean> respuesta = new HashMap<>();
        respuesta.put("desactivada", Boolean.TRUE);
        return ResponseEntity.ok(respuesta);
    }

    // Activar medicación
    @PutMapping("/medicaciones/{id}/activar")
    @Transactional
    public ResponseEntity<Map<String, Boolean>> activarMedicacion(@PathVariable Long id) {
        Medicacion medicacion = medicacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No existe la medicación con el ID: " + id));

        medicacion.setActivo(true);
        medicacionRepository.save(medicacion);

        Map<String, Boolean> respuesta = new HashMap<>();
        respuesta.put("activada", Boolean.TRUE);
        return ResponseEntity.ok(respuesta);
    }

    // Eliminar medicación permanentemente
    @DeleteMapping("/medicaciones/{id}")
    public ResponseEntity<Map<String, Boolean>> eliminarMedicacion(@PathVariable Long id) {
        Medicacion medicacion = medicacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No existe la medicación con el ID: " + id));

        medicacionRepository.delete(medicacion);
        Map<String, Boolean> respuesta = new HashMap<>();
        respuesta.put("eliminada", Boolean.TRUE);
        return ResponseEntity.ok(respuesta);
    }

    // Obtener estadísticas de medicaciones
    @GetMapping("/medicaciones/estadisticas")
    public ResponseEntity<Map<String, Object>> obtenerEstadisticas() {
        Map<String, Object> estadisticas = new HashMap<>();
        estadisticas.put("totalMedicaciones", medicacionRepository.count());
        estadisticas.put("medicacionesActivas", medicacionRepository.countByActivoTrue());
        
        LocalDate hoy = LocalDate.now();
        LocalDate en30Dias = hoy.plusDays(30);
        List<Medicacion> vencenPronto = medicacionRepository.findMedicacionesQueVencenEntre(hoy, en30Dias);
        estadisticas.put("vencenProximamente", vencenPronto.size());
        
        return ResponseEntity.ok(estadisticas);
    }
}