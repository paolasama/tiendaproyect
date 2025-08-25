import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medicacion, EstadisticasMedicacion } from '../models/medicacion.model';

@Injectable({
  providedIn: 'root'
})
export class MedicacionService {

  private baseURL = "http://localhost:8080/api/v1/medicaciones";

  constructor(private httpClient: HttpClient) { }

  // Obtener todas las medicaciones
  obtenerListaMedicaciones(): Observable<Medicacion[]> {
    return this.httpClient.get<Medicacion[]>(`${this.baseURL}`);
  }

  // Obtener medicaciones activas
  obtenerMedicacionesActivas(): Observable<Medicacion[]> {
    return this.httpClient.get<Medicacion[]>(`${this.baseURL}/activas`);
  }

  // Obtener medicaciones que vencen pronto
  obtenerMedicacionesPorVencer(dias: number = 7): Observable<Medicacion[]> {
    return this.httpClient.get<Medicacion[]>(`${this.baseURL}/por-vencer?dias=${dias}`);
  }

  // Buscar medicaciones por nombre
  buscarPorNombre(nombre: string): Observable<Medicacion[]> {
    return this.httpClient.get<Medicacion[]>(`${this.baseURL}/buscar/nombre?nombre=${nombre}`);
  }

  // Buscar medicaciones por médico prescriptor
  buscarPorMedico(medico: string): Observable<Medicacion[]> {
    return this.httpClient.get<Medicacion[]>(`${this.baseURL}/buscar/medico?medico=${medico}`);
  }

  // Obtener medicaciones válidas en una fecha
  obtenerMedicacionesValidasEnFecha(fecha: string): Observable<Medicacion[]> {
    return this.httpClient.get<Medicacion[]>(`${this.baseURL}/validas-en-fecha?fecha=${fecha}`);
  }

  // Registrar nueva medicación
  registrarMedicacion(medicacion: Medicacion): Observable<Medicacion> {
    return this.httpClient.post<Medicacion>(`${this.baseURL}`, medicacion);
  }

  // Obtener medicación por ID
  obtenerMedicacionPorId(id: number): Observable<Medicacion> {
    return this.httpClient.get<Medicacion>(`${this.baseURL}/${id}`);
  }

  // Actualizar medicación
  actualizarMedicacion(id: number, medicacion: Medicacion): Observable<Medicacion> {
    return this.httpClient.put<Medicacion>(`${this.baseURL}/${id}`, medicacion);
  }

  // Desactivar medicación
  desactivarMedicacion(id: number): Observable<any> {
    return this.httpClient.put(`${this.baseURL}/${id}/desactivar`, {});
  }

  // Activar medicación
  activarMedicacion(id: number): Observable<any> {
    return this.httpClient.put(`${this.baseURL}/${id}/activar`, {});
  }

  // Eliminar medicación
  eliminarMedicacion(id: number): Observable<any> {
    return this.httpClient.delete(`${this.baseURL}/${id}`);
  }

  // Obtener estadísticas
  obtenerEstadisticas(): Observable<EstadisticasMedicacion> {
    return this.httpClient.get<EstadisticasMedicacion>(`${this.baseURL}/estadisticas`);
  }

  // Verificar si una medicación está activa
  esMedicacionActiva(medicacion: Medicacion): boolean {
    if (!medicacion.activo) return false;
    
    const ahora = new Date();
    const fechaInicio = new Date(medicacion.fechaInicio);
    const fechaFin = medicacion.fechaFin ? new Date(medicacion.fechaFin) : null;
    
    return ahora >= fechaInicio && (!fechaFin || ahora <= fechaFin);
  }

  // Calcular días restantes de tratamiento
  diasRestantesTratamiento(medicacion: Medicacion): number | null {
    if (!medicacion.fechaFin) return null;
    
    const ahora = new Date();
    const fechaFin = new Date(medicacion.fechaFin);
    const diferencia = fechaFin.getTime() - ahora.getTime();
    
    return Math.ceil(diferencia / (1000 * 3600 * 24));
  }

  // Verificar si una medicación vence pronto
  vencePronto(medicacion: Medicacion, diasUmbral: number = 7): boolean {
    const diasRestantes = this.diasRestantesTratamiento(medicacion);
    return diasRestantes !== null && diasRestantes <= diasUmbral && diasRestantes >= 0;
  }
}