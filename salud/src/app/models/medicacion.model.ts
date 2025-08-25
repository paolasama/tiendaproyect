export interface Medicacion {
  id?: number;
  nombre: string;
  dosis: string;
  frecuencia: string;
  fechaInicio: Date;
  fechaFin?: Date;
  indicaciones: string;
  medicoPrescriptor: string;
  observaciones?: string;
  activo: boolean;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

export interface EstadisticasMedicacion {
  totalMedicaciones: number;
  medicacionesActivas: number;
  medicacionesPorVencer: number;
  medicacionesVencidas: number;
}