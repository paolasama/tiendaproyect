package com.lta.gestionempleados.repository;

import com.lta.gestionempleados.model.Alergia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
// Removed unused import: org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlergiaRepository extends JpaRepository<Alergia, Long> {
    
    // Buscar alergias activas
    List<Alergia> findByActivoTrue();
    
    // Buscar alergias por tipo
    List<Alergia> findByTipoAlergiaAndActivoTrue(Alergia.TipoAlergia tipoAlergia);
    
    // Buscar alergias por severidad
    List<Alergia> findBySeveridadAndActivoTrue(Alergia.Severidad severidad);
    
    // Buscar alergias críticas o severas
    @Query("SELECT a FROM Alergia a WHERE a.activo = true AND " +
           "(a.severidad = 'CRITICA' OR a.severidad = 'SEVERA')")
    List<Alergia> findAlergiasCriticasYSeveras();
    
    // Buscar alergias por alérgeno (ignorando mayúsculas/minúsculas)
    List<Alergia> findByAlergenoContainingIgnoreCaseAndActivoTrue(String alergeno);
    
    // Buscar alergias medicamentosas activas
    @Query("SELECT a FROM Alergia a WHERE a.activo = true AND a.tipoAlergia = 'MEDICAMENTOSA'")
    List<Alergia> findAlergiasMedicamentosasActivas();
    
    // Buscar alergias alimentarias activas
    @Query("SELECT a FROM Alergia a WHERE a.activo = true AND a.tipoAlergia = 'ALIMENTARIA'")
    List<Alergia> findAlergiasAlimentariasActivas();
    
    // Contar alergias activas
    long countByActivoTrue();
    
    // Contar alergias por severidad
    long countBySeveridadAndActivoTrue(Alergia.Severidad severidad);
}