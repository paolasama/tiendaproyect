import { Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { MedicacionService } from './medicacion.service';
import { AlergiaService } from './alergia.service';
import { NotaMedicaService } from './nota-medica.service';
import { Medicacion } from '../models/medicacion.model';
import { Alergia, SeveridadAlergia } from '../models/alergia.model';
import { NotaMedica, ProximaCita } from '../models/nota-medica.model';

export interface ResumenDashboard {
  medicaciones: {
    total: number;
    activas: number;
    porVencer: number;
    vencidas: number;
  };
  alergias: {
    total: number;
    activas: number;
    criticas: number;
    severas: number;
  };
  notas: {
    total: number;
    activas: number;
    altaPrioridad: number;
  };
  citas: {
    proximas: number;
    estaSemana: number;
  };
}

export interface AlertasMedicas {
  medicacionesPorVencer: Medicacion[];
  alergiasCriticas: Alergia[];
  citasProximas: ProximaCita[];
  notasUrgentes: NotaMedica[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private medicacionService: MedicacionService,
    private alergiaService: AlergiaService,
    private notaMedicaService: NotaMedicaService
  ) { }

  // Obtener resumen completo del dashboard
  obtenerResumenDashboard(): Observable<ResumenDashboard> {
    return forkJoin({
      medicacionesActivas: this.medicacionService.obtenerMedicacionesActivas(),
      medicacionesPorVencer: this.medicacionService.obtenerMedicacionesPorVencer(7),
      todasMedicaciones: this.medicacionService.obtenerListaMedicaciones(),
      alergiasActivas: this.alergiaService.obtenerAlergiasActivas(),
      alergiasCriticas: this.alergiaService.obtenerAlergiasCriticas(),
      alergiasSeveras: this.alergiaService.obtenerAlergiasSeveras(),
      todasAlergias: this.alergiaService.obtenerListaAlergias(),
      notasActivas: this.notaMedicaService.obtenerNotasActivas(),
      notasAltaPrioridad: this.notaMedicaService.obtenerNotasAltaPrioridad(),
      todasNotas: this.notaMedicaService.obtenerListaNotas(),
      citasProximas: this.notaMedicaService.obtenerCitasProximas()
    }).pipe(
      map(data => {
        // Calcular medicaciones vencidas
        const medicacionesVencidas = data.todasMedicaciones.filter(med => {
          if (!med.fechaFin) return false;
          const ahora = new Date();
          const fechaFin = new Date(med.fechaFin);
          return ahora > fechaFin && med.activo;
        }).length;

        return {
          medicaciones: {
            total: data.todasMedicaciones.length,
            activas: data.medicacionesActivas.length,
            porVencer: data.medicacionesPorVencer.length,
            vencidas: medicacionesVencidas
          },
          alergias: {
            total: data.todasAlergias.length,
            activas: data.alergiasActivas.length,
            criticas: data.alergiasCriticas.length,
            severas: data.alergiasSeveras.length
          },
          notas: {
            total: data.todasNotas.length,
            activas: data.notasActivas.length,
            altaPrioridad: data.notasAltaPrioridad.length
          },
          citas: {
            proximas: data.citasProximas.length,
            estaSemana: data.citasProximas.filter(nota => {
              const dias = this.notaMedicaService.diasHastaProximaCita(nota);
              return dias !== null && dias <= 7 && dias >= 0;
            }).length
          }
        };
      })
    );
  }

  // Obtener alertas médicas importantes
  obtenerAlertasMedicas(): Observable<AlertasMedicas> {
    return forkJoin({
      medicacionesPorVencer: this.medicacionService.obtenerMedicacionesPorVencer(7),
      alergiasCriticas: this.alergiaService.obtenerAlergiasCriticas(),
      citasProximas: this.notaMedicaService.obtenerCitasProximas(),
      notasUrgentes: this.notaMedicaService.obtenerNotasAltaPrioridad()
    }).pipe(
      map(data => ({
        medicacionesPorVencer: data.medicacionesPorVencer.slice(0, 5), // Máximo 5
        alergiasCriticas: data.alergiasCriticas.filter(a => a.activo),
        citasProximas: data.citasProximas
          .filter(nota => nota.proximaCita)
          .map(nota => this.notaMedicaService.convertirAProximaCita(nota))
          .filter(cita => cita !== null)
          .slice(0, 5) as ProximaCita[], // Máximo 5
        notasUrgentes: data.notasUrgentes.filter(nota => !nota.archivado).slice(0, 3) // Máximo 3
      }))
    );
  }

  // Obtener medicaciones que requieren atención
  obtenerMedicacionesAtencion(): Observable<Medicacion[]> {
    return forkJoin({
      porVencer: this.medicacionService.obtenerMedicacionesPorVencer(7),
      todasActivas: this.medicacionService.obtenerMedicacionesActivas()
    }).pipe(
      map(data => {
        const ahora = new Date();
        const vencidas = data.todasActivas.filter(med => {
          if (!med.fechaFin) return false;
          const fechaFin = new Date(med.fechaFin);
          return ahora > fechaFin;
        });
        
        // Combinar medicaciones por vencer y vencidas, eliminar duplicados
        const medicacionesAtencion = [...data.porVencer, ...vencidas];
        const idsUnicos = new Set();
        return medicacionesAtencion.filter(med => {
          if (idsUnicos.has(med.id)) return false;
          idsUnicos.add(med.id);
          return true;
        });
      })
    );
  }

  // Obtener alergias que requieren atención especial
  obtenerAlergiasAtencion(): Observable<Alergia[]> {
    return this.alergiaService.obtenerAlergiasActivas().pipe(
      map(alergias => alergias.filter(alergia => 
        alergia.severidad === SeveridadAlergia.SEVERA || 
        alergia.severidad === SeveridadAlergia.CRITICA
      ))
    );
  }

  // Obtener próximas citas de la semana
  obtenerCitasSemana(): Observable<ProximaCita[]> {
    return this.notaMedicaService.obtenerCitasProximas().pipe(
      map(notas => {
        const citasProximas: ProximaCita[] = [];
        
        notas.forEach(nota => {
          if (nota.proximaCita) {
            const dias = this.notaMedicaService.diasHastaProximaCita(nota);
            if (dias !== null && dias <= 7 && dias >= 0) {
              const cita = this.notaMedicaService.convertirAProximaCita(nota);
              if (cita) citasProximas.push(cita);
            }
          }
        });
        
        // Ordenar por fecha más próxima
        return citasProximas.sort((a, b) => 
          new Date(a.fechaCita).getTime() - new Date(b.fechaCita).getTime()
        );
      })
    );
  }

  // Verificar si hay alertas críticas
  hayAlertasCriticas(): Observable<boolean> {
    return this.obtenerAlertasMedicas().pipe(
      map(alertas => 
        alertas.alergiasCriticas.length > 0 ||
        alertas.medicacionesPorVencer.length > 0 ||
        alertas.notasUrgentes.length > 0
      )
    );
  }

  // Obtener estadísticas rápidas para widgets
  obtenerEstadisticasRapidas(): Observable<any> {
    return forkJoin({
      medicacionesActivas: this.medicacionService.obtenerMedicacionesActivas(),
      alergiasActivas: this.alergiaService.obtenerAlergiasActivas(),
      notasActivas: this.notaMedicaService.obtenerNotasActivas(),
      citasProximas: this.notaMedicaService.obtenerCitasProximas()
    }).pipe(
      map(data => ({
        medicacionesActivas: data.medicacionesActivas.length,
        alergiasActivas: data.alergiasActivas.length,
        notasActivas: data.notasActivas.length,
        citasProximas: data.citasProximas.length
      }))
    );
  }

  // Formatear fecha para mostrar en dashboard
  formatearFechaCorta(fecha: Date | string): string {
    const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
    return fechaObj.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    });
  }

  // Obtener mensaje de estado de salud general
  obtenerEstadoSaludGeneral(): Observable<string> {
    return this.obtenerAlertasMedicas().pipe(
      map(alertas => {
        const totalAlertas = alertas.alergiasCriticas.length + 
                           alertas.medicacionesPorVencer.length + 
                           alertas.notasUrgentes.length;
        
        if (totalAlertas === 0) {
          return 'Todo está bajo control. No hay alertas médicas pendientes.';
        } else if (totalAlertas <= 2) {
          return `Hay ${totalAlertas} alerta(s) que requieren tu atención.`;
        } else {
          return `Atención: ${totalAlertas} alertas médicas requieren revisión urgente.`;
        }
      })
    );
  }
}