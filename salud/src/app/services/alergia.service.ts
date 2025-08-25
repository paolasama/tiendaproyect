import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alergia, TipoAlergia, SeveridadAlergia, EstadisticasAlergia } from '../models/alergia.model';

@Injectable({
  providedIn: 'root'
})
export class AlergiaService {

  private baseURL = "http://localhost:8080/api/v1/alergias";

  constructor(private httpClient: HttpClient) { }

  // Obtener todas las alergias
  obtenerListaAlergias(): Observable<Alergia[]> {
    return this.httpClient.get<Alergia[]>(`${this.baseURL}`);
  }

  // Obtener alergias activas
  obtenerAlergiasActivas(): Observable<Alergia[]> {
    return this.httpClient.get<Alergia[]>(`${this.baseURL}/activas`);
  }

  // Obtener alergias críticas
  obtenerAlergiasCriticas(): Observable<Alergia[]> {
    return this.httpClient.get<Alergia[]>(`${this.baseURL}/criticas`);
  }

  // Obtener alergias severas
  obtenerAlergiasSeveras(): Observable<Alergia[]> {
    return this.httpClient.get<Alergia[]>(`${this.baseURL}/severas`);
  }

  // Obtener alergias medicinales
  obtenerAlergiasMedicinales(): Observable<Alergia[]> {
    return this.httpClient.get<Alergia[]>(`${this.baseURL}/medicinales`);
  }

  // Obtener alergias alimentarias
  obtenerAlergiasAlimentarias(): Observable<Alergia[]> {
    return this.httpClient.get<Alergia[]>(`${this.baseURL}/alimentarias`);
  }

  // Buscar alergias por tipo
  buscarPorTipo(tipo: TipoAlergia): Observable<Alergia[]> {
    return this.httpClient.get<Alergia[]>(`${this.baseURL}/buscar/tipo?tipo=${tipo}`);
  }

  // Buscar alergias por severidad
  buscarPorSeveridad(severidad: SeveridadAlergia): Observable<Alergia[]> {
    return this.httpClient.get<Alergia[]>(`${this.baseURL}/buscar/severidad?severidad=${severidad}`);
  }

  // Buscar alergias por alérgeno
  buscarPorAlergeno(alergeno: string): Observable<Alergia[]> {
    return this.httpClient.get<Alergia[]>(`${this.baseURL}/buscar/alergeno?alergeno=${alergeno}`);
  }

  // Registrar nueva alergia
  registrarAlergia(alergia: Alergia): Observable<Alergia> {
    return this.httpClient.post<Alergia>(`${this.baseURL}`, alergia);
  }

  // Obtener alergia por ID
  obtenerAlergiaPorId(id: number): Observable<Alergia> {
    return this.httpClient.get<Alergia>(`${this.baseURL}/${id}`);
  }

  // Actualizar alergia
  actualizarAlergia(id: number, alergia: Alergia): Observable<Alergia> {
    return this.httpClient.put<Alergia>(`${this.baseURL}/${id}`, alergia);
  }

  // Desactivar alergia
  desactivarAlergia(id: number): Observable<any> {
    return this.httpClient.put(`${this.baseURL}/${id}/desactivar`, {});
  }

  // Activar alergia
  activarAlergia(id: number): Observable<any> {
    return this.httpClient.put(`${this.baseURL}/${id}/activar`, {});
  }

  // Eliminar alergia
  eliminarAlergia(id: number): Observable<any> {
    return this.httpClient.delete(`${this.baseURL}/${id}`);
  }

  // Obtener tipos de alergia disponibles
  obtenerTiposAlergia(): Observable<TipoAlergia[]> {
    return this.httpClient.get<TipoAlergia[]>(`${this.baseURL}/tipos`);
  }

  // Obtener severidades disponibles
  obtenerSeveridades(): Observable<SeveridadAlergia[]> {
    return this.httpClient.get<SeveridadAlergia[]>(`${this.baseURL}/severidades`);
  }

  // Obtener estadísticas
  obtenerEstadisticas(): Observable<EstadisticasAlergia> {
    return this.httpClient.get<EstadisticasAlergia>(`${this.baseURL}/estadisticas`);
  }

  // Métodos de utilidad
  
  // Obtener color según severidad
  obtenerColorSeveridad(severidad: SeveridadAlergia): string {
    switch (severidad) {
      case SeveridadAlergia.LEVE:
        return '#4CAF50'; // Verde
      case SeveridadAlergia.MODERADA:
        return '#FF9800'; // Naranja
      case SeveridadAlergia.SEVERA:
        return '#F44336'; // Rojo
      case SeveridadAlergia.CRITICA:
        return '#9C27B0'; // Púrpura
      default:
        return '#757575'; // Gris
    }
  }

  // Obtener icono según tipo
  obtenerIconoTipo(tipo: TipoAlergia): string {
    switch (tipo) {
      case TipoAlergia.ALIMENTARIA:
        return 'restaurant';
      case TipoAlergia.MEDICINAL:
        return 'medication';
      case TipoAlergia.AMBIENTAL:
        return 'eco';
      case TipoAlergia.CONTACTO:
        return 'touch_app';
      default:
        return 'warning';
    }
  }

  // Verificar si es alergia crítica o severa
  esAlergiaGrave(alergia: Alergia): boolean {
    return alergia.severidad === SeveridadAlergia.SEVERA || 
           alergia.severidad === SeveridadAlergia.CRITICA;
  }

  // Obtener descripción de severidad
  obtenerDescripcionSeveridad(severidad: SeveridadAlergia): string {
    switch (severidad) {
      case SeveridadAlergia.LEVE:
        return 'Síntomas leves, molestias menores';
      case SeveridadAlergia.MODERADA:
        return 'Síntomas moderados, requiere atención';
      case SeveridadAlergia.SEVERA:
        return 'Síntomas severos, requiere tratamiento inmediato';
      case SeveridadAlergia.CRITICA:
        return 'Riesgo vital, requiere atención médica urgente';
      default:
        return 'Severidad no especificada';
    }
  }
}