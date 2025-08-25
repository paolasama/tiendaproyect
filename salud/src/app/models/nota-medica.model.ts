export enum TipoNota {
  CONSULTA = 'CONSULTA',
  LABORATORIO = 'LABORATORIO',
  RADIOLOGIA = 'RADIOLOGIA',
  ESPECIALISTA = 'ESPECIALISTA',
  URGENCIA = 'URGENCIA',
  HOSPITALIZACION = 'HOSPITALIZACION',
  CIRUGIA = 'CIRUGIA',
  VACUNACION = 'VACUNACION',
  REVISION = 'REVISION',
  OTRO = 'OTRO'
}

export enum PrioridadNota {
  BAJA = 'BAJA',
  MEDIA = 'MEDIA',
  ALTA = 'ALTA',
  URGENTE = 'URGENTE'
}

export interface NotaMedica {
  id?: number;
  titulo: string;
  contenido: string;
  tipoNota: TipoNota;
  prioridad: PrioridadNota;
  fechaConsulta: Date;
  medicoTratante: string;
  centroMedico: string;
  diagnostico?: string;
  tratamiento?: string;
  proximaCita?: Date;
  recordatorios?: string;
  archivado: boolean;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

export interface EstadisticasNotaMedica {
  totalNotas: number;
  notasActivas: number;
  notasPorTipo: { [key: string]: number };
  citasProximas: number;
}

export interface ProximaCita {
  id: number;
  titulo: string;
  fechaCita: Date;
  medicoTratante: string;
  centroMedico: string;
  tipoNota: TipoNota;
}