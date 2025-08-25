package com.lta.gestionempleados.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "alergias")
public class Alergia {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "El nombre del alérgeno es obligatorio")
    @Column(nullable = false)
    private String alergeno;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_alergia")
    private TipoAlergia tipoAlergia;
    
    @Enumerated(EnumType.STRING)
    private Severidad severidad;
    
    private String sintomas;
    
    private String tratamiento;
    
    private String observaciones;
    
    @Column(name = "fecha_diagnostico")
    private LocalDateTime fechaDiagnostico;
    
    @Column(name = "activo")
    private Boolean activo = true;
    
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;
    
    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;
    
    // Control de concurrencia optimista
    @Version
    private Long version;
    
    // Enums
    public enum TipoAlergia {
        ALIMENTARIA,
        MEDICAMENTOSA,
        AMBIENTAL,
        CONTACTO,
        RESPIRATORIA,
        OTRA
    }
    
    public enum Severidad {
        LEVE,
        MODERADA,
        SEVERA,
        CRITICA
    }
    
    // Constructor vacío requerido por JPA
    public Alergia() {
        this.fechaCreacion = LocalDateTime.now();
        this.fechaActualizacion = LocalDateTime.now();
    }
    
    // Constructor con parámetros principales
    public Alergia(String alergeno, TipoAlergia tipoAlergia, Severidad severidad) {
        this();
        this.alergeno = alergeno;
        this.tipoAlergia = tipoAlergia;
        this.severidad = severidad;
    }
    
    // Método para actualizar timestamp
    @PreUpdate
    public void preUpdate() {
        this.fechaActualizacion = LocalDateTime.now();
    }
    
    // Getters y Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getAlergeno() {
        return alergeno;
    }
    
    public void setAlergeno(String alergeno) {
        this.alergeno = alergeno;
    }
    
    public TipoAlergia getTipoAlergia() {
        return tipoAlergia;
    }
    
    public void setTipoAlergia(TipoAlergia tipoAlergia) {
        this.tipoAlergia = tipoAlergia;
    }
    
    public Severidad getSeveridad() {
        return severidad;
    }
    
    public void setSeveridad(Severidad severidad) {
        this.severidad = severidad;
    }
    
    public String getSintomas() {
        return sintomas;
    }
    
    public void setSintomas(String sintomas) {
        this.sintomas = sintomas;
    }
    
    public String getTratamiento() {
        return tratamiento;
    }
    
    public void setTratamiento(String tratamiento) {
        this.tratamiento = tratamiento;
    }
    
    public String getObservaciones() {
        return observaciones;
    }
    
    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
    
    public LocalDateTime getFechaDiagnostico() {
        return fechaDiagnostico;
    }
    
    public void setFechaDiagnostico(LocalDateTime fechaDiagnostico) {
        this.fechaDiagnostico = fechaDiagnostico;
    }
    
    public Boolean getActivo() {
        return activo;
    }
    
    public void setActivo(Boolean activo) {
        this.activo = activo;
    }
    
    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }
    
    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
    
    public LocalDateTime getFechaActualizacion() {
        return fechaActualizacion;
    }
    
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) {
        this.fechaActualizacion = fechaActualizacion;
    }
    
    public Long getVersion() {
        return version;
    }
    
    public void setVersion(Long version) {
        this.version = version;
    }
}