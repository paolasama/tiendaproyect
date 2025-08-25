package com.lta.gestionempleados.controller;

import com.lta.gestionempleados.exception.ResourceNotFoundException;
import com.lta.gestionempleados.model.NotaMedica;
import com.lta.gestionempleados.repository.NotaMedicaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/")
@CrossOrigin(origins = "http://localhost:4200")
public class NotaMedicaController {

    @Autowired
    private NotaMedicaRepository notaMedicaRepository;

    // Listar todas las notas médicas
    @GetMapping("/notas-medicas")
    public List<NotaMedica> listarTodasLasNotas() {
        return notaMedicaRepository.findAll();
    }

    // Listar notas no archivadas (activas)
    @GetMapping("/notas-medicas/activas")
    public List<NotaMedica> listarNotasActivas() {
        return notaMedicaRepository.findByArchivadoFalseOrderByFechaCreacionDesc();
    }

    // Listar notas por tipo
    @GetMapping("/notas-medicas/tipo/{tipo}")
    public List<NotaMedica> listarNotasPorTipo(@PathVariable NotaMedica.TipoNota tipo) {
        return notaMedicaRepository.findByTipoNotaAndArchivadoFalseOrderByFechaCreacionDesc(tipo);
    }

    // Listar notas por prioridad
    @GetMapping("/notas-medicas/prioridad/{prioridad}")
    public List<NotaMedica> listarNotasPorPrioridad(@PathVariable NotaMedica.Prioridad prioridad) {
        return notaMedicaRepository.findByPrioridadAndArchivadoFalseOrderByFechaCreacionDesc(prioridad);
    }

    // Listar notas de alta prioridad
    @GetMapping("/notas-medicas/alta-prioridad")
    public List<NotaMedica> listarNotasAltaPrioridad() {
        return notaMedicaRepository.findNotasAltaPrioridad();
    }

    // Buscar notas por texto
    @GetMapping("/notas-medicas/buscar")
    public List<NotaMedica> buscarNotas(@RequestParam String busqueda) {
        return notaMedicaRepository.buscarEnTituloYContenido(busqueda);
    }

    // Buscar notas por médico
    @GetMapping("/notas-medicas/medico")
    public List<NotaMedica> buscarNotasPorMedico(@RequestParam String medico) {
        return notaMedicaRepository.findByMedicoTratanteContainingIgnoreCaseAndArchivadoFalseOrderByFechaCreacionDesc(medico);
    }

    // Buscar notas por centro médico
    @GetMapping("/notas-medicas/centro")
    public List<NotaMedica> buscarNotasPorCentro(@RequestParam String centro) {
        return notaMedicaRepository.findByCentroMedicoContainingIgnoreCaseAndArchivadoFalseOrderByFechaCreacionDesc(centro);
    }

    // Listar próximas citas
    @GetMapping("/notas-medicas/proximas-citas")
    public List<NotaMedica> listarProximasCitas() {
        return notaMedicaRepository.findNotasConProximasCitas(LocalDateTime.now());
    }

    // Listar citas próximas (próximos 7 días)
    @GetMapping("/notas-medicas/citas-proximas")
    public List<NotaMedica> listarCitasProximas() {
        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime en7Dias = ahora.plusDays(7);
        return notaMedicaRepository.findCitasProximas(ahora, en7Dias);
    }

    // Buscar notas por rango de fechas
    @GetMapping("/notas-medicas/rango-fechas")
    public List<NotaMedica> buscarNotasPorRangoFechas(
            @RequestParam String fechaInicio,
            @RequestParam String fechaFin) {
        LocalDateTime inicio = LocalDateTime.parse(fechaInicio);
        LocalDateTime fin = LocalDateTime.parse(fechaFin);
        return notaMedicaRepository.findNotasPorRangoFechaConsulta(inicio, fin);
    }

    // Guardar nueva nota médica
    @PostMapping("/notas-medicas")
    public NotaMedica guardarNotaMedica(@Valid @RequestBody NotaMedica notaMedica) {
        return notaMedicaRepository.save(notaMedica);
    }

    // Obtener nota médica por ID
    @GetMapping("/notas-medicas/{id}")
    public ResponseEntity<NotaMedica> obtenerNotaMedicaPorId(@PathVariable Long id) {
        NotaMedica notaMedica = notaMedicaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No existe la nota médica con el ID: " + id));
        return ResponseEntity.ok(notaMedica);
    }

    // Actualizar nota médica
    @PutMapping("/notas-medicas/{id}")
    @Transactional
    public ResponseEntity<NotaMedica> actualizarNotaMedica(@PathVariable Long id, 
                                                          @Valid @RequestBody NotaMedica detallesNota) {
        NotaMedica notaMedica = notaMedicaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No existe la nota médica con el ID: " + id));

        notaMedica.setTitulo(detallesNota.getTitulo());
        notaMedica.setContenido(detallesNota.getContenido());
        notaMedica.setTipoNota(detallesNota.getTipoNota());
        notaMedica.setPrioridad(detallesNota.getPrioridad());
        notaMedica.setFechaConsulta(detallesNota.getFechaConsulta());
        notaMedica.setMedicoTratante(detallesNota.getMedicoTratante());
        notaMedica.setCentroMedico(detallesNota.getCentroMedico());
        notaMedica.setDiagnostico(detallesNota.getDiagnostico());
        notaMedica.setTratamiento(detallesNota.getTratamiento());
        notaMedica.setProximaCita(detallesNota.getProximaCita());
        notaMedica.setRecordatorios(detallesNota.getRecordatorios());
        notaMedica.setArchivado(detallesNota.getArchivado());

        NotaMedica notaActualizada = notaMedicaRepository.save(notaMedica);
        return ResponseEntity.ok(notaActualizada);
    }

    // Archivar nota médica
    @PutMapping("/notas-medicas/{id}/archivar")
    @Transactional
    public ResponseEntity<Map<String, Boolean>> archivarNotaMedica(@PathVariable Long id) {
        NotaMedica notaMedica = notaMedicaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No existe la nota médica con el ID: " + id));

        notaMedica.setArchivado(true);
        notaMedicaRepository.save(notaMedica);

        Map<String, Boolean> respuesta = new HashMap<>();
        respuesta.put("archivada", Boolean.TRUE);
        return ResponseEntity.ok(respuesta);
    }

    // Desarchivar nota médica
    @PutMapping("/notas-medicas/{id}/desarchivar")
    @Transactional
    public ResponseEntity<Map<String, Boolean>> desarchivarNotaMedica(@PathVariable Long id) {
        NotaMedica notaMedica = notaMedicaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No existe la nota médica con el ID: " + id));

        notaMedica.setArchivado(false);
        notaMedicaRepository.save(notaMedica);

        Map<String, Boolean> respuesta = new HashMap<>();
        respuesta.put("desarchivada", Boolean.TRUE);
        return ResponseEntity.ok(respuesta);
    }

    // Eliminar nota médica permanentemente
    @DeleteMapping("/notas-medicas/{id}")
    public ResponseEntity<Map<String, Boolean>> eliminarNotaMedica(@PathVariable Long id) {
        NotaMedica notaMedica = notaMedicaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No existe la nota médica con el ID: " + id));

        notaMedicaRepository.delete(notaMedica);
        Map<String, Boolean> respuesta = new HashMap<>();
        respuesta.put("eliminada", Boolean.TRUE);
        return ResponseEntity.ok(respuesta);
    }

    // Obtener tipos de nota disponibles
    @GetMapping("/notas-medicas/tipos")
    public ResponseEntity<NotaMedica.TipoNota[]> obtenerTiposNota() {
        return ResponseEntity.ok(NotaMedica.TipoNota.values());
    }

    // Obtener prioridades disponibles
    @GetMapping("/notas-medicas/prioridades")
    public ResponseEntity<NotaMedica.Prioridad[]> obtenerPrioridades() {
        return ResponseEntity.ok(NotaMedica.Prioridad.values());
    }

    // Obtener estadísticas de notas médicas
    @GetMapping("/notas-medicas/estadisticas")
    public ResponseEntity<Map<String, Object>> obtenerEstadisticas() {
        Map<String, Object> estadisticas = new HashMap<>();
        estadisticas.put("totalNotas", notaMedicaRepository.count());
        estadisticas.put("notasActivas", notaMedicaRepository.countByArchivadoFalse());
        
        // Contar por tipo
        Map<String, Long> porTipo = new HashMap<>();
        for (NotaMedica.TipoNota tipo : NotaMedica.TipoNota.values()) {
            porTipo.put(tipo.name(), notaMedicaRepository.countByTipoNotaAndArchivadoFalse(tipo));
        }
        estadisticas.put("notasPorTipo", porTipo);
        
        // Próximas citas
        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime en7Dias = ahora.plusDays(7);
        List<NotaMedica> citasProximas = notaMedicaRepository.findCitasProximas(ahora, en7Dias);
        estadisticas.put("citasProximas", citasProximas.size());
        
        return ResponseEntity.ok(estadisticas);
    }
}