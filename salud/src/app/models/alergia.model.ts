export enum TipoAlergia {
  ALIMENTARIA = 'ALIMENTARIA',
  MEDICINAL = 'MEDICINAL',
  AMBIENTAL = 'AMBIENTAL',
  CONTACTO = 'CONTACTO',
  OTRA = 'OTRA'
}

export enum SeveridadAlergia {
  LEVE = 'LEVE',
  MODERADA = 'MODERADA',
  SEVERA = 'SEVERA',
  CRITICA = 'CRITICA'
}

export interface Alergia {
  id?: number;
  alergeno: string;
  tipo: TipoAlergia;
  severidad: SeveridadAlergia;
  sintomas: string;
  tratamiento?: string;
  observaciones?: string;
  fechaDiagnostico: Date;
  activo: boolean;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

export interface EstadisticasAlergia {
  totalAlergias: number;
  alergiasActivas: number;
  alergiasPorTipo: { [key: string]: number };
  alergiasPorSeveridad: { [key: string]: number };
}