package com.lta.gestionempleados.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "notas_medicas")
public class NotaMedica {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "El título es obligatorio")
    @Column(nullable = false)
    private String titulo;
    
    @Column(columnDefinition = "TEXT")
    private String contenido;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_nota")
    private TipoNota tipoNota;
    
    @Enumerated(EnumType.STRING)
    private Prioridad prioridad;
    
    @Column(name = "fecha_consulta")
    private LocalDateTime fechaConsulta;
    
    @Column(name = "medico_tratante")
    private String medicoTratante;
    
    @Column(name = "centro_medico")
    private String centroMedico;
    
    private String diagnostico;
    
    private String tratamiento;
    
    @Column(name = "proxima_cita")
    private LocalDateTime proximaCita;
    
    private String recordatorios;
    
    @Column(name = "archivado")
    private Boolean archivado = false;
    
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;
    
    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;
    
    // Control de concurrencia optimista
    @Version
    private Long version;
    
    // Enums
    public enum TipoNota {
        CONSULTA_GENERAL,
        CONSULTA_ESPECIALISTA,
        EMERGENCIA,
        LABORATORIO,
        RADIOLOGIA,
        CIRUGIA,
        SEGUIMIENTO,
        VACUNACION,
        CHEQUEO_RUTINA,
        NOTA_PERSONAL
    }
    
    public enum Prioridad {
        BAJA,
        NORMAL,
        ALTA,
        URGENTE
    }
    
    // Constructor vacío requerido por JPA
    public NotaMedica() {
        this.fechaCreacion = LocalDateTime.now();
        this.fechaActualizacion = LocalDateTime.now();
    }
    
    // Constructor con parámetros principales
    public NotaMedica(String titulo, String contenido, TipoNota tipoNota) {
        this();
        this.titulo = titulo;
        this.contenido = contenido;
        this.tipoNota = tipoNota;
        this.prioridad = Prioridad.NORMAL;
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
    
    public String getTitulo() {
        return titulo;
    }
    
    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }
    
    public String getContenido() {
        return contenido;
    }
    
    public void setContenido(String contenido) {
        this.contenido = contenido;
    }
    
    public TipoNota getTipoNota() {
        return tipoNota;
    }
    
    public void setTipoNota(TipoNota tipoNota) {
        this.tipoNota = tipoNota;
    }
    
    public Prioridad getPrioridad() {
        return prioridad;
    }
    
    public void setPrioridad(Prioridad prioridad) {
        this.prioridad = prioridad;
    }
    
    public LocalDateTime getFechaConsulta() {
        return fechaConsulta;
    }
    
    public void setFechaConsulta(LocalDateTime fechaConsulta) {
        this.fechaConsulta = fechaConsulta;
    }
    
    public String getMedicoTratante() {
        return medicoTratante;
    }
    
    public void setMedicoTratante(String medicoTratante) {
        this.medicoTratante = medicoTratante;
    }
    
    public String getCentroMedico() {
        return centroMedico;
    }
    
    public void setCentroMedico(String centroMedico) {
        this.centroMedico = centroMedico;
    }
    
    public String getDiagnostico() {
        return diagnostico;
    }
    
    public void setDiagnostico(String diagnostico) {
        this.diagnostico = diagnostico;
    }
    
    public String getTratamiento() {
        return tratamiento;
    }
    
    public void setTratamiento(String tratamiento) {
        this.tratamiento = tratamiento;
    }
    
    public LocalDateTime getProximaCita() {
        return proximaCita;
    }
    
    public void setProximaCita(LocalDateTime proximaCita) {
        this.proximaCita = proximaCita;
    }
    
    public String getRecordatorios() {
        return recordatorios;
    }
    
    public void setRecordatorios(String recordatorios) {
        this.recordatorios = recordatorios;
    }
    
    public Boolean getArchivado() {
        return archivado;
    }
    
    public void setArchivado(Boolean archivado) {
        this.archivado = archivado;
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