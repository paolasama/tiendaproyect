package com.lta.gestionempleados.controller;

import com.lta.gestionempleados.exception.ResourceNotFoundException;
import com.lta.gestionempleados.model.Alergia;
import com.lta.gestionempleados.repository.AlergiaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/")
@CrossOrigin(origins = "http://localhost:4200")
public class AlergiaController {

    @Autowired
    private AlergiaRepository alergiaRepository;

    // Listar todas las alergias
    @GetMapping("/alergias")
    public List<Alergia> listarTodasLasAlergias() {
        return alergiaRepository.findAll();
    }

    // Listar solo alergias activas
    @GetMapping("/alergias/activas")
    public List<Alergia> listarAlergiasActivas() {
        return alergiaRepository.findByActivoTrue();
    }

    // Listar alergias críticas y severas
    @GetMapping("/alergias/criticas")
    public List<Alergia> listarAlergiasCriticas() {
        return alergiaRepository.findAlergiasCriticasYSeveras();
    }

    // Listar alergias medicamentosas
    @GetMapping("/alergias/medicamentosas")
    public List<Alergia> listarAlergiasMedicamentosas() {
        return alergiaRepository.findAlergiasMedicamentosasActivas();
    }

    // Listar alergias alimentarias
    @GetMapping("/alergias/alimentarias")
    public List<Alergia> listarAlergiasAlimentarias() {
        return alergiaRepository.findAlergiasAlimentariasActivas();
    }

    // Buscar alergias por tipo
    @GetMapping("/alergias/tipo/{tipo}")
    public List<Alergia> buscarAlergiasPorTipo(@PathVariable Alergia.TipoAlergia tipo) {
        return alergiaRepository.findByTipoAlergiaAndActivoTrue(tipo);
    }

    // Buscar alergias por severidad
    @GetMapping("/alergias/severidad/{severidad}")
    public List<Alergia> buscarAlergiasPorSeveridad(@PathVariable Alergia.Severidad severidad) {
        return alergiaRepository.findBySeveridadAndActivoTrue(severidad);
    }

    // Buscar alergias por alérgeno
    @GetMapping("/alergias/buscar")
    public List<Alergia> buscarAlergiasPorAlergeno(@RequestParam String alergeno) {
        return alergiaRepository.findByAlergenoContainingIgnoreCaseAndActivoTrue(alergeno);
    }

    // Guardar nueva alergia
    @PostMapping("/alergias")
    public Alergia guardarAlergia(@Valid @RequestBody Alergia alergia) {
        return alergiaRepository.save(alergia);
    }

    // Obtener alergia por ID
    @GetMapping("/alergias/{id}")
    public ResponseEntity<Alergia> obtenerAlergiaPorId(@PathVariable Long id) {
        Alergia alergia = alergiaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No existe la alergia con el ID: " + id));
        return ResponseEntity.ok(alergia);
    }

    // Actualizar alergia
    @PutMapping("/alergias/{id}")
    @Transactional
    public ResponseEntity<Alergia> actualizarAlergia(@PathVariable Long id, 
                                                    @Valid @RequestBody Alergia detallesAlergia) {
        Alergia alergia = alergiaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No existe la alergia con el ID: " + id));

        alergia.setAlergeno(detallesAlergia.getAlergeno());
        alergia.setTipoAlergia(detallesAlergia.getTipoAlergia());
        alergia.setSeveridad(detallesAlergia.getSeveridad());
        alergia.setSintomas(detallesAlergia.getSintomas());
        alergia.setTratamiento(detallesAlergia.getTratamiento());
        alergia.setObservaciones(detallesAlergia.getObservaciones());
        alergia.setFechaDiagnostico(detallesAlergia.getFechaDiagnostico());
        alergia.setActivo(detallesAlergia.getActivo());

        Alergia alergiaActualizada = alergiaRepository.save(alergia);
        return ResponseEntity.ok(alergiaActualizada);
    }

    // Desactivar alergia (soft delete)
    @PutMapping("/alergias/{id}/desactivar")
    @Transactional
    public ResponseEntity<Map<String, Boolean>> desactivarAlergia(@PathVariable Long id) {
        Alergia alergia = alergiaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No existe la alergia con el ID: " + id));

        alergia.setActivo(false);
        alergiaRepository.save(alergia);

        Map<String, Boolean> respuesta = new HashMap<>();
        respuesta.put("desactivada", Boolean.TRUE);
        return ResponseEntity.ok(respuesta);
    }

    // Activar alergia
    @PutMapping("/alergias/{id}/activar")
    @Transactional
    public ResponseEntity<Map<String, Boolean>> activarAlergia(@PathVariable Long id) {
        Alergia alergia = alergiaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No existe la alergia con el ID: " + id));

        alergia.setActivo(true);
        alergiaRepository.save(alergia);

        Map<String, Boolean> respuesta = new HashMap<>();
        respuesta.put("activada", Boolean.TRUE);
        return ResponseEntity.ok(respuesta);
    }

    // Eliminar alergia permanentemente
    @DeleteMapping("/alergias/{id}")
    public ResponseEntity<Map<String, Boolean>> eliminarAlergia(@PathVariable Long id) {
        Alergia alergia = alergiaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No existe la alergia con el ID: " + id));

        alergiaRepository.delete(alergia);
        Map<String, Boolean> respuesta = new HashMap<>();
        respuesta.put("eliminada", Boolean.TRUE);
        return ResponseEntity.ok(respuesta);
    }

    // Obtener tipos de alergia disponibles
    @GetMapping("/alergias/tipos")
    public ResponseEntity<Alergia.TipoAlergia[]> obtenerTiposAlergia() {
        return ResponseEntity.ok(Alergia.TipoAlergia.values());
    }

    // Obtener severidades disponibles
    @GetMapping("/alergias/severidades")
    public ResponseEntity<Alergia.Severidad[]> obtenerSeveridades() {
        return ResponseEntity.ok(Alergia.Severidad.values());
    }

    // Obtener estadísticas de alergias
    @GetMapping("/alergias/estadisticas")
    public ResponseEntity<Map<String, Object>> obtenerEstadisticas() {
        Map<String, Object> estadisticas = new HashMap<>();
        estadisticas.put("totalAlergias", alergiaRepository.count());
        estadisticas.put("alergiasActivas", alergiaRepository.countByActivoTrue());
        estadisticas.put("alergiasCriticas", alergiaRepository.countBySeveridadAndActivoTrue(Alergia.Severidad.CRITICA));
        estadisticas.put("alergiasSeveras", alergiaRepository.countBySeveridadAndActivoTrue(Alergia.Severidad.SEVERA));
        estadisticas.put("alergiasModeratas", alergiaRepository.countBySeveridadAndActivoTrue(Alergia.Severidad.MODERADA));
        estadisticas.put("alergiasLeves", alergiaRepository.countBySeveridadAndActivoTrue(Alergia.Severidad.LEVE));
        
        return ResponseEntity.ok(estadisticas);
    }
}