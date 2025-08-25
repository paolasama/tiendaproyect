package com.lta.gestionempleados.repository;

import com.lta.gestionempleados.model.Medicacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MedicacionRepository extends JpaRepository<Medicacion, Long> {
    
    // Buscar medicaciones activas
    List<Medicacion> findByActivoTrue();
    
    // Buscar medicaciones por nombre (ignorando mayúsculas/minúsculas)
    List<Medicacion> findByNombreContainingIgnoreCase(String nombre);
    
    // Buscar medicaciones por médico prescriptor
    List<Medicacion> findByMedicoPrescriptorContainingIgnoreCase(String medico);
    
    // Buscar medicaciones que están vigentes en una fecha específica
    @Query("SELECT m FROM Medicacion m WHERE m.activo = true AND " +
           "(m.fechaInicio IS NULL OR m.fechaInicio <= :fecha) AND " +
           "(m.fechaFin IS NULL OR m.fechaFin >= :fecha)")
    List<Medicacion> findMedicacionesVigentesEnFecha(@Param("fecha") LocalDate fecha);
    
    // Buscar medicaciones que vencen pronto
    @Query("SELECT m FROM Medicacion m WHERE m.activo = true AND " +
           "m.fechaFin IS NOT NULL AND m.fechaFin BETWEEN :fechaInicio AND :fechaFin")
    List<Medicacion> findMedicacionesQueVencenEntre(@Param("fechaInicio") LocalDate fechaInicio, 
                                                     @Param("fechaFin") LocalDate fechaFin);
    
    // Contar medicaciones activas
    long countByActivoTrue();
}