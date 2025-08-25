// Modelo para el resumen general del dashboard
export interface ResumenDashboard {
  // Medicaciones
  totalMedicaciones: number;
  medicacionesActivas: number;
  medicacionesInactivas: number;
  medicacionesPorVencer: number;
  medicacionesVencidas: number;
  
  // Alergias
  totalAlergias: number;
  alergiasActivas: number;
  alergiasCriticas: number;
  alergiasSeveras: number;
  alergiasMedicamentosas: number;
  
  // Notas médicas
  totalNotas: number;
  notasActivas: number;
  notasArchivadas: number;
  notasUrgentes: number;
  notasAltaPrioridad: number;
  
  // Citas y seguimiento
  proximasCitas: number;
  citasEstaSemana: number;
  citasEsteMes: number;
  citasVencidas: number;
  
  // Estadísticas generales
  ultimaActualizacion: Date;
  diasSinIncidentes: number;
  nivelRiesgoGeneral: NivelRiesgo;
  puntuacionSalud: number; // 0-100
}

// Modelo para alertas médicas críticas
export interface AlertasMedicas {
  // Alertas de medicación
  medicacionesVencidas: number;
  medicacionesPorVencer: number;
  medicacionesSinStock: number;
  interaccionesMedicamentosas: number;
  
  // Alertas de alergias
  alergiasCriticas: number;
  nuevasAlergias: number;
  alergiasSinTratamiento: number;
  
  // Alertas de citas
  citasUrgentes: number;
  citasPerdidas: number;
  seguimientosPendientes: number;
  
  // Alertas generales
  alertasGenerales: AlertaGeneral[];
  nivelAlertaMaximo: NivelAlerta;
  requiereAtencionInmediata: boolean;
}

// Modelo para alertas generales individuales
export interface AlertaGeneral {
  id: string;
  tipo: TipoAlerta;
  nivel: NivelAlerta;
  titulo: string;
  mensaje: string;
  fechaCreacion: Date;
  fechaVencimiento?: Date;
  accionRequerida: string;
  enlace?: string;
  leida: boolean;
  importante: boolean;
}

// Modelo para estadísticas rápidas del dashboard
export interface EstadisticasRapidas {
  medicacionesHoy: number;
  citasHoy: number;
  alertasActivas: number;
  tareasPendientes: number;
  porcentajeAdherencia: number;
  diasConsecutivosSinIncidentes: number;
}

// Modelo para el estado de salud general
export interface EstadoSaludGeneral {
  puntuacion: number; // 0-100
  nivel: NivelSalud;
  descripcion: string;
  recomendaciones: string[];
  proximaEvaluacion: Date;
  tendencia: TendenciaSalud;
  factoresRiesgo: FactorRiesgo[];
  fortalezas: string[];
}

// Modelo para factores de riesgo
export interface FactorRiesgo {
  nombre: string;
  nivel: NivelRiesgo;
  descripcion: string;
  recomendacion: string;
  fechaIdentificacion: Date;
}

// Modelo para métricas de adherencia
export interface MetricasAdherencia {
  medicacion: AdherenciaMedicacion;
  citas: AdherenciaCitas;
  seguimiento: AdherenciaSeguimiento;
  general: number; // Promedio general
}

export interface AdherenciaMedicacion {
  porcentaje: number;
  diasConsecutivos: number;
  medicacionesTomadas: number;
  medicacionesPerdidas: number;
  ultimaActualizacion: Date;
}

export interface AdherenciaCitas {
  porcentaje: number;
  citasAsistidas: number;
  citasPerdidas: number;
  citasReprogramadas: number;
  ultimaActualizacion: Date;
}

export interface AdherenciaSeguimiento {
  porcentaje: number;
  seguimientosCompletos: number;
  seguimientosPendientes: number;
  seguimientosVencidos: number;
  ultimaActualizacion: Date;
}

// Modelo para tendencias de salud
export interface TendenciaSalud {
  direccion: DireccionTendencia;
  porcentajeCambio: number;
  periodoAnalisis: string;
  descripcion: string;
  factoresInfluyentes: string[];
}

// Modelo para recordatorios del dashboard
export interface RecordatorioDashboard {
  id: string;
  tipo: TipoRecordatorio;
  titulo: string;
  descripcion: string;
  fechaVencimiento: Date;
  prioridad: PrioridadRecordatorio;
  completado: boolean;
  enlace?: string;
  accion?: string;
}

// Enumeraciones
export enum NivelRiesgo {
  BAJO = 'BAJO',
  MEDIO = 'MEDIO',
  ALTO = 'ALTO',
  CRITICO = 'CRITICO'
}

export enum NivelAlerta {
  INFO = 'INFO',
  ADVERTENCIA = 'ADVERTENCIA',
  CRITICA = 'CRITICA',
  URGENTE = 'URGENTE'
}

export enum TipoAlerta {
  MEDICACION = 'MEDICACION',
  ALERGIA = 'ALERGIA',
  CITA = 'CITA',
  SEGUIMIENTO = 'SEGUIMIENTO',
  SISTEMA = 'SISTEMA',
  GENERAL = 'GENERAL'
}

export enum NivelSalud {
  EXCELENTE = 'EXCELENTE',
  BUENO = 'BUENO',
  REGULAR = 'REGULAR',
  DEFICIENTE = 'DEFICIENTE',
  CRITICO = 'CRITICO'
}

export enum DireccionTendencia {
  MEJORANDO = 'MEJORANDO',
  ESTABLE = 'ESTABLE',
  EMPEORANDO = 'EMPEORANDO',
  FLUCTUANTE = 'FLUCTUANTE'
}

export enum TipoRecordatorio {
  MEDICACION = 'MEDICACION',
  CITA = 'CITA',
  EXAMEN = 'EXAMEN',
  SEGUIMIENTO = 'SEGUIMIENTO',
  GENERAL = 'GENERAL'
}

export enum PrioridadRecordatorio {
  BAJA = 'BAJA',
  MEDIA = 'MEDIA',
  ALTA = 'ALTA',
  URGENTE = 'URGENTE'
}

// Interfaces para widgets específicos del dashboard
export interface WidgetMedicacion {
  medicacionesHoy: number;
  proximaDosis: {
    nombre: string;
    hora: Date;
    dosis: string;
  } | null;
  adherenciaUltimaSemana: number;
  alertas: number;
}

export interface WidgetAlergias {
  totalAlergias: number;
  alergiasCriticas: number;
  ultimaActualizacion: Date;
  alertasActivas: number;
}

export interface WidgetCitas {
  proximaCita: {
    fecha: Date;
    medico: string;
    tipo: string;
  } | null;
  citasEstaSemana: number;
  citasPendientes: number;
  recordatoriosActivos: number;
}

export interface WidgetEstadisticas {
  puntuacionSalud: number;
  tendencia: DireccionTendencia;
  diasSinIncidentes: number;
  metaAdherencia: number;
  progresoMeta: number;
}

// Configuración del dashboard
export interface ConfiguracionDashboard {
  widgetsVisibles: string[];
  ordenWidgets: string[];
  actualizacionAutomatica: boolean;
  intervaloActualizacion: number; // en minutos
  mostrarAlertas: boolean;
  mostrarTendencias: boolean;
  temaOscuro: boolean;
  notificacionesPush: boolean;
  configuracionAlertas: ConfiguracionAlertas;
}

export interface ConfiguracionAlertas {
  medicacionVencida: boolean;
  medicacionPorVencer: boolean;
  citaProxima: boolean;
  citaPerdida: boolean;
  alergiasCriticas: boolean;
  seguimientoPendiente: boolean;
  diasAnticipacionCita: number;
  diasAnticipacionMedicacion: number;
}

// Datos para gráficos del dashboard
export interface DatosGrafico {
  etiquetas: string[];
  datasets: DatasetGrafico[];
  tipo: TipoGrafico;
  titulo: string;
  descripcion?: string;
}

export interface DatasetGrafico {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
}

export enum TipoGrafico {
  LINEA = 'line',
  BARRA = 'bar',
  CIRCULAR = 'pie',
  DONA = 'doughnut',
  AREA = 'area'
}

// Exportaciones de utilidad
export type DashboardData = {
  resumen: ResumenDashboard;
  alertas: AlertasMedicas;
  estadisticas: EstadisticasRapidas;
  estado: EstadoSaludGeneral;
  metricas: MetricasAdherencia;
  recordatorios: RecordatorioDashboard[];
  widgets: {
    medicacion: WidgetMedicacion;
    alergias: WidgetAlergias;
    citas: WidgetCitas;
    estadisticas: WidgetEstadisticas;
  };
};

export type FiltrosDashboard = {
  fechaInicio?: Date;
  fechaFin?: Date;
  tipoAlerta?: TipoAlerta[];
  nivelRiesgo?: NivelRiesgo[];
  mostrarSoloActivos?: boolean;
  incluirArchivados?: boolean;
};