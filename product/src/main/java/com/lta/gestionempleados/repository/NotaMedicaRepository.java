package com.lta.gestionempleados.repository;

import com.lta.gestionempleados.model.NotaMedica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotaMedicaRepository extends JpaRepository<NotaMedica, Long> {
    
    // Buscar notas no archivadas
    List<NotaMedica> findByArchivadoFalseOrderByFechaCreacionDesc();
    
    // Buscar notas por tipo
    List<NotaMedica> findByTipoNotaAndArchivadoFalseOrderByFechaCreacionDesc(NotaMedica.TipoNota tipoNota);
    
    // Buscar notas por prioridad
    List<NotaMedica> findByPrioridadAndArchivadoFalseOrderByFechaCreacionDesc(NotaMedica.Prioridad prioridad);
    
    // Buscar notas por título o contenido (ignorando mayúsculas/minúsculas)
    @Query("SELECT n FROM NotaMedica n WHERE n.archivado = false AND " +
           "(LOWER(n.titulo) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR " +
           "LOWER(n.contenido) LIKE LOWER(CONCAT('%', :busqueda, '%'))) " +
           "ORDER BY n.fechaCreacion DESC")
    List<NotaMedica> buscarEnTituloYContenido(@Param("busqueda") String busqueda);
    
    // Buscar notas por médico tratante
    List<NotaMedica> findByMedicoTratanteContainingIgnoreCaseAndArchivadoFalseOrderByFechaCreacionDesc(String medico);
    
    // Buscar notas por centro médico
    List<NotaMedica> findByCentroMedicoContainingIgnoreCaseAndArchivadoFalseOrderByFechaCreacionDesc(String centro);
    
    // Buscar notas con próximas citas
    @Query("SELECT n FROM NotaMedica n WHERE n.archivado = false AND " +
           "n.proximaCita IS NOT NULL AND n.proximaCita >= :fechaInicio " +
           "ORDER BY n.proximaCita ASC")
    List<NotaMedica> findNotasConProximasCitas(@Param("fechaInicio") LocalDateTime fechaInicio);
    
    // Buscar notas con citas próximas (en los próximos días)
    @Query("SELECT n FROM NotaMedica n WHERE n.archivado = false AND " +
           "n.proximaCita BETWEEN :fechaInicio AND :fechaFin " +
           "ORDER BY n.proximaCita ASC")
    List<NotaMedica> findCitasProximas(@Param("fechaInicio") LocalDateTime fechaInicio, 
                                       @Param("fechaFin") LocalDateTime fechaFin);
    
    // Buscar notas por rango de fechas de consulta
    @Query("SELECT n FROM NotaMedica n WHERE n.archivado = false AND " +
           "n.fechaConsulta BETWEEN :fechaInicio AND :fechaFin " +
           "ORDER BY n.fechaConsulta DESC")
    List<NotaMedica> findNotasPorRangoFechaConsulta(@Param("fechaInicio") LocalDateTime fechaInicio, 
                                                    @Param("fechaFin") LocalDateTime fechaFin);
    
    // Buscar notas de alta prioridad no archivadas
    @Query("SELECT n FROM NotaMedica n WHERE n.archivado = false AND " +
           "(n.prioridad = 'ALTA' OR n.prioridad = 'URGENTE') " +
           "ORDER BY n.prioridad DESC, n.fechaCreacion DESC")
    List<NotaMedica> findNotasAltaPrioridad();
    
    // Contar notas no archivadas
    long countByArchivadoFalse();
    
    // Contar notas por tipo
    long countByTipoNotaAndArchivadoFalse(NotaMedica.TipoNota tipoNota);
}