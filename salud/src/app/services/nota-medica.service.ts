import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotaMedica, TipoNota, PrioridadNota, EstadisticasNotaMedica, ProximaCita } from '../models/nota-medica.model';

@Injectable({
  providedIn: 'root'
})
export class NotaMedicaService {

  private baseURL = "http://localhost:8080/api/v1/notas-medicas";

  constructor(private httpClient: HttpClient) { }

  // Obtener todas las notas médicas
  obtenerListaNotas(): Observable<NotaMedica[]> {
    return this.httpClient.get<NotaMedica[]>(`${this.baseURL}`);
  }

  // Obtener notas activas (no archivadas)
  obtenerNotasActivas(): Observable<NotaMedica[]> {
    return this.httpClient.get<NotaMedica[]>(`${this.baseURL}/activas`);
  }

  // Obtener notas por tipo
  obtenerNotasPorTipo(tipo: TipoNota): Observable<NotaMedica[]> {
    return this.httpClient.get<NotaMedica[]>(`${this.baseURL}/tipo/${tipo}`);
  }

  // Obtener notas por prioridad
  obtenerNotasPorPrioridad(prioridad: PrioridadNota): Observable<NotaMedica[]> {
    return this.httpClient.get<NotaMedica[]>(`${this.baseURL}/prioridad/${prioridad}`);
  }

  // Obtener notas de alta prioridad
  obtenerNotasAltaPrioridad(): Observable<NotaMedica[]> {
    return this.httpClient.get<NotaMedica[]>(`${this.baseURL}/alta-prioridad`);
  }

  // Buscar notas por texto
  buscarNotas(busqueda: string): Observable<NotaMedica[]> {
    return this.httpClient.get<NotaMedica[]>(`${this.baseURL}/buscar?busqueda=${busqueda}`);
  }

  // Buscar notas por médico
  buscarNotasPorMedico(medico: string): Observable<NotaMedica[]> {
    return this.httpClient.get<NotaMedica[]>(`${this.baseURL}/medico?medico=${medico}`);
  }

  // Buscar notas por centro médico
  buscarNotasPorCentro(centro: string): Observable<NotaMedica[]> {
    return this.httpClient.get<NotaMedica[]>(`${this.baseURL}/centro?centro=${centro}`);
  }

  // Obtener próximas citas
  obtenerProximasCitas(): Observable<NotaMedica[]> {
    return this.httpClient.get<NotaMedica[]>(`${this.baseURL}/proximas-citas`);
  }

  // Obtener citas próximas (próximos 7 días)
  obtenerCitasProximas(): Observable<NotaMedica[]> {
    return this.httpClient.get<NotaMedica[]>(`${this.baseURL}/citas-proximas`);
  }

  // Buscar notas por rango de fechas
  buscarNotasPorRangoFechas(fechaInicio: string, fechaFin: string): Observable<NotaMedica[]> {
    return this.httpClient.get<NotaMedica[]>(`${this.baseURL}/rango-fechas?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }

  // Registrar nueva nota médica
  registrarNotaMedica(nota: NotaMedica): Observable<NotaMedica> {
    return this.httpClient.post<NotaMedica>(`${this.baseURL}`, nota);
  }

  // Obtener nota médica por ID
  obtenerNotaMedicaPorId(id: number): Observable<NotaMedica> {
    return this.httpClient.get<NotaMedica>(`${this.baseURL}/${id}`);
  }

  // Actualizar nota médica
  actualizarNotaMedica(id: number, nota: NotaMedica): Observable<NotaMedica> {
    return this.httpClient.put<NotaMedica>(`${this.baseURL}/${id}`, nota);
  }

  // Archivar nota médica
  archivarNotaMedica(id: number): Observable<any> {
    return this.httpClient.put(`${this.baseURL}/${id}/archivar`, {});
  }

  // Desarchivar nota médica
  desarchivarNotaMedica(id: number): Observable<any> {
    return this.httpClient.put(`${this.baseURL}/${id}/desarchivar`, {});
  }

  // Eliminar nota médica
  eliminarNotaMedica(id: number): Observable<any> {
    return this.httpClient.delete(`${this.baseURL}/${id}`);
  }

  // Obtener tipos de nota disponibles
  obtenerTiposNota(): Observable<TipoNota[]> {
    return this.httpClient.get<TipoNota[]>(`${this.baseURL}/tipos`);
  }

  // Obtener prioridades disponibles
  obtenerPrioridades(): Observable<PrioridadNota[]> {
    return this.httpClient.get<PrioridadNota[]>(`${this.baseURL}/prioridades`);
  }

  // Obtener estadísticas
  obtenerEstadisticas(): Observable<EstadisticasNotaMedica> {
    return this.httpClient.get<EstadisticasNotaMedica>(`${this.baseURL}/estadisticas`);
  }

  // Métodos de utilidad
  
  // Obtener color según prioridad
  obtenerColorPrioridad(prioridad: PrioridadNota): string {
    switch (prioridad) {
      case PrioridadNota.BAJA:
        return '#4CAF50'; // Verde
      case PrioridadNota.MEDIA:
        return '#FF9800'; // Naranja
      case PrioridadNota.ALTA:
        return '#F44336'; // Rojo
      case PrioridadNota.URGENTE:
        return '#9C27B0'; // Púrpura
      default:
        return '#757575'; // Gris
    }
  }

  // Obtener icono según tipo de nota
  obtenerIconoTipo(tipo: TipoNota): string {
    switch (tipo) {
      case TipoNota.CONSULTA:
        return 'medical_services';
      case TipoNota.LABORATORIO:
        return 'biotech';
      case TipoNota.RADIOLOGIA:
        return 'scanner';
      case TipoNota.ESPECIALISTA:
        return 'person';
      case TipoNota.URGENCIA:
        return 'emergency';
      case TipoNota.HOSPITALIZACION:
        return 'local_hospital';
      case TipoNota.CIRUGIA:
        return 'healing';
      case TipoNota.VACUNACION:
        return 'vaccines';
      case TipoNota.REVISION:
        return 'fact_check';
      default:
        return 'note_add';
    }
  }

  // Verificar si tiene próxima cita
  tieneProximaCita(nota: NotaMedica): boolean {
    return nota.proximaCita !== null && nota.proximaCita !== undefined;
  }

  // Calcular días hasta próxima cita
  diasHastaProximaCita(nota: NotaMedica): number | null {
    if (!nota.proximaCita) return null;
    
    const ahora = new Date();
    const proximaCita = new Date(nota.proximaCita);
    const diferencia = proximaCita.getTime() - ahora.getTime();
    
    return Math.ceil(diferencia / (1000 * 3600 * 24));
  }

  // Verificar si la cita es próxima (próximos 7 días)
  esCitaProxima(nota: NotaMedica, diasUmbral: number = 7): boolean {
    const dias = this.diasHastaProximaCita(nota);
    return dias !== null && dias <= diasUmbral && dias >= 0;
  }

  // Verificar si la cita ya pasó
  esCitaPasada(nota: NotaMedica): boolean {
    const dias = this.diasHastaProximaCita(nota);
    return dias !== null && dias < 0;
  }

  // Formatear fecha para mostrar
  formatearFecha(fecha: Date | string): string {
    const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
    return fechaObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Obtener descripción de prioridad
  obtenerDescripcionPrioridad(prioridad: PrioridadNota): string {
    switch (prioridad) {
      case PrioridadNota.BAJA:
        return 'Información general, sin urgencia';
      case PrioridadNota.MEDIA:
        return 'Requiere seguimiento regular';
      case PrioridadNota.ALTA:
        return 'Requiere atención prioritaria';
      case PrioridadNota.URGENTE:
        return 'Requiere atención inmediata';
      default:
        return 'Prioridad no especificada';
    }
  }

  // Convertir nota a próxima cita
  convertirAProximaCita(nota: NotaMedica): ProximaCita | null {
    if (!nota.proximaCita || !nota.id) return null;
    
    return {
      id: nota.id,
      titulo: nota.titulo,
      fechaCita: nota.proximaCita,
      medicoTratante: nota.medicoTratante,
      centroMedico: nota.centroMedico,
      tipoNota: nota.tipoNota
    };
  }
}