import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NotaMedicaService } from '../../services/nota-medica.service';
import { NotaMedica, TipoNota, PrioridadNota } from '../../models/nota-medica.model';

@Component({
  selector: 'app-detalle-nota-medica',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid" *ngIf="nota">
      <div class="row justify-content-center">
        <div class="col-md-10 col-lg-8">
          <!-- Header -->
          <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
              <div>
                <h3 class="mb-0">
                  <i class="fas fa-notes-medical me-2"></i>
                  {{ nota.titulo }}
                </h3>
                <div class="mt-2">
                  <span class="badge" [ngClass]="obtenerClaseTipo(nota.tipo)" style="font-size: 0.9em;">
                    <i class="fas" [ngClass]="obtenerIconoTipo(nota.tipo)" me-1></i>
                    {{ obtenerTextoTipo(nota.tipo) }}
                  </span>
                  <span class="badge ms-2" [ngClass]="obtenerClasePrioridad(nota.prioridad)">
                    {{ obtenerTextoPrioridad(nota.prioridad) }}
                  </span>
                  <span class="badge ms-2" [ngClass]="!nota.archivado ? 'bg-success' : 'bg-secondary'">
                    <i class="fas" [ngClass]="!nota.archivado ? 'fa-check-circle' : 'fa-archive'"></i>
                    {{ !nota.archivado ? 'Activa' : 'Archivada' }}
                  </span>
                </div>
              </div>
              <div class="btn-group">
                <button 
                  class="btn btn-outline-primary btn-sm"
                  (click)="editarNota()">
                  <i class="fas fa-edit me-1"></i>
                  Editar
                </button>
                <button 
                  class="btn btn-outline-secondary btn-sm"
                  (click)="volver()">
                  <i class="fas fa-arrow-left me-1"></i>
                  Volver
                </button>
              </div>
            </div>
          </div>

          <!-- Alerta de prioridad urgente -->
          <div class="alert alert-danger" *ngIf="nota.prioridad === 'URGENTE' && !nota.archivado">
            <div class="d-flex align-items-center">
              <i class="fas fa-exclamation-triangle fa-2x me-3"></i>
              <div>
                <h5 class="alert-heading mb-1">¡NOTA URGENTE!</h5>
                <p class="mb-0">Esta nota médica requiere atención prioritaria. Revise el contenido cuidadosamente.</p>
              </div>
            </div>
          </div>

          <!-- Información principal -->
          <div class="row">
            <div class="col-md-8 mb-4">
              <div class="card h-100">
                <div class="card-header">
                  <h5 class="mb-0">
                    <i class="fas fa-file-medical-alt me-2"></i>
                    Contenido de la Nota
                  </h5>
                </div>
                <div class="card-body">
                  <div class="nota-contenido">
                    <p class="mb-0" [innerHTML]="formatearContenido(nota.contenido)"></p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-md-4 mb-4">
              <div class="card h-100">
                <div class="card-header">
                  <h5 class="mb-0">
                    <i class="fas fa-info-circle me-2"></i>
                    Información General
                  </h5>
                </div>
                <div class="card-body">
                  <div class="info-item mb-3">
                    <label class="info-label">
                      <i class="fas fa-calendar-alt me-1"></i>
                      Fecha de consulta:
                    </label>
                    <span class="info-value">{{ formatearFecha(nota.fechaConsulta) }}</span>
                  </div>
                  
                  <div class="info-item mb-3">
                    <label class="info-label">
                      <i class="fas fa-user-md me-1"></i>
                      Médico tratante:
                    </label>
                    <span class="info-value">{{ nota.medicoTratante }}</span>
                  </div>
                  
                  <div class="info-item mb-3" *ngIf="nota.centroMedico">
                    <label class="info-label">
                      <i class="fas fa-hospital me-1"></i>
                      Centro médico:
                    </label>
                    <span class="info-value">{{ nota.centroMedico }}</span>
                  </div>
                  
                  <div class="info-item mb-3">
                    <label class="info-label">
                      <i class="fas fa-clock me-1"></i>
                      Tiempo transcurrido:
                    </label>
                    <span class="info-value">{{ calcularTiempoTranscurrido() }}</span>
                  </div>
                  
                  <div class="info-item mb-3">
                    <label class="info-label">
                      <i class="fas fa-tags me-1"></i>
                      Clasificación:
                    </label>
                    <div class="d-flex flex-wrap gap-1 mt-1">
                      <span class="badge" [ngClass]="obtenerClaseTipo(nota.tipo)">
                        <i class="fas" [ngClass]="obtenerIconoTipo(nota.tipo)"></i>
                        {{ obtenerTextoTipo(nota.tipo) }}
                      </span>
                      <span class="badge" [ngClass]="obtenerClasePrioridad(nota.prioridad)">
                        {{ obtenerTextoPrioridad(nota.prioridad) }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="info-item">
                    <label class="info-label">
                      <i class="fas fa-chart-line me-1"></i>
                      Estado:
                    </label>
                    <span class="info-value">
                      <span class="badge" [ngClass]="nota.activa ? 'bg-success' : 'bg-secondary'">
                        <i class="fas" [ngClass]="nota.activa ? 'fa-check-circle' : 'fa-archive'"></i>
                        {{ nota.activa ? 'Activa' : 'Archivada' }}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recomendaciones según el tipo -->
          <div class="card mb-4" *ngIf="obtenerRecomendaciones().length > 0">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-lightbulb me-2"></i>
                Recomendaciones
              </h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6" *ngFor="let recomendacion of obtenerRecomendaciones()">
                  <div class="d-flex align-items-start mb-2">
                    <i class="fas fa-check-circle text-success me-2 mt-1"></i>
                    <span>{{ recomendacion }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Seguimiento y próximos pasos -->
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-route me-2"></i>
                Seguimiento
              </h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-4">
                  <div class="text-center">
                    <i class="fas fa-calendar-check fa-2x text-primary mb-2"></i>
                    <h6>Próxima revisión</h6>
                    <p class="text-muted">{{ obtenerProximaRevision() }}</p>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="text-center">
                    <i class="fas fa-stethoscope fa-2x text-info mb-2"></i>
                    <h6>Seguimiento recomendado</h6>
                    <p class="text-muted">{{ obtenerTipoSeguimiento() }}</p>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="text-center">
                    <i class="fas fa-bell fa-2x text-warning mb-2"></i>
                    <h6>Alertas</h6>
                    <p class="text-muted">{{ obtenerAlertas() }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Historial relacionado -->
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-history me-2"></i>
                Información Adicional
              </h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <h6><i class="fas fa-clipboard-list text-primary me-1"></i> Datos de la consulta:</h6>
                  <ul class="list-unstyled">
                    <li><strong>Fecha:</strong> {{ formatearFechaCompleta(nota.fechaConsulta) }}</li>
                    <li><strong>Día de la semana:</strong> {{ obtenerDiaSemana(nota.fechaConsulta) }}</li>
                    <li><strong>Hora estimada:</strong> {{ obtenerHoraEstimada() }}</li>
                  </ul>
                </div>
                <div class="col-md-6">
                  <h6><i class="fas fa-chart-bar text-success me-1"></i> Estadísticas:</h6>
                  <ul class="list-unstyled">
                    <li><strong>Palabras en contenido:</strong> {{ contarPalabras(nota.contenido) }}</li>
                    <li><strong>Caracteres:</strong> {{ nota.contenido.length }}</li>
                    <li><strong>Tiempo de lectura:</strong> {{ calcularTiempoLectura() }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Acciones -->
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-cogs me-2"></i>
                Acciones
              </h5>
            </div>
            <div class="card-body">
              <div class="d-flex flex-wrap gap-2">
                <button 
                  class="btn btn-primary"
                  (click)="editarNota()">
                  <i class="fas fa-edit me-1"></i>
                  Editar nota
                </button>
                
                <button 
                  class="btn"
                  [ngClass]="!nota.archivado ? 'btn-warning' : 'btn-success'"
                  (click)="toggleArchivar()">
                  <i class="fas" [ngClass]="!nota.archivado ? 'fa-archive' : 'fa-box-open'"></i>
                  {{ !nota.archivado ? 'Archivar' : 'Desarchivar' }} nota
                </button>
                
                <button 
                  class="btn btn-outline-info"
                  (click)="imprimirNota()">
                  <i class="fas fa-print me-1"></i>
                  Imprimir
                </button>
                
                <button 
                  class="btn btn-outline-secondary"
                  (click)="exportarPDF()">
                  <i class="fas fa-file-pdf me-1"></i>
                  Exportar PDF
                </button>
                
                <button 
                  class="btn btn-outline-success"
                  (click)="compartir()">
                  <i class="fas fa-share-alt me-1"></i>
                  Compartir
                </button>
                
                <button 
                  class="btn btn-outline-danger"
                  (click)="eliminarNota()"
                  [disabled]="eliminando">
                  <span *ngIf="eliminando" class="spinner-border spinner-border-sm me-2"></span>
                  <i *ngIf="!eliminando" class="fas fa-trash me-1"></i>
                  {{ eliminando ? 'Eliminando...' : 'Eliminar' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div class="d-flex justify-content-center align-items-center" style="height: 50vh;" *ngIf="!nota && !error">
      <div class="text-center">
        <div class="spinner-border text-primary mb-3"></div>
        <p>Cargando información de la nota médica...</p>
      </div>
    </div>

    <!-- Error state -->
    <div class="d-flex justify-content-center align-items-center" style="height: 50vh;" *ngIf="error">
      <div class="text-center">
        <i class="fas fa-exclamation-triangle text-danger mb-3" style="font-size: 3rem;"></i>
        <h4>Error al cargar la nota médica</h4>
        <p class="text-muted">{{ error }}</p>
        <button class="btn btn-primary" (click)="volver()">
          <i class="fas fa-arrow-left me-1"></i>
          Volver a la lista
        </button>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      border: none;
    }
    
    .card-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 10px 10px 0 0;
      border: none;
    }
    
    .info-item {
      border-bottom: 1px solid #f0f0f0;
      padding-bottom: 0.5rem;
    }
    
    .info-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    
    .info-label {
      font-weight: 600;
      color: #6c757d;
      display: block;
      margin-bottom: 0.25rem;
    }
    
    .info-value {
      color: #495057;
      font-size: 1.1em;
    }
    
    .nota-contenido {
      line-height: 1.8;
      font-size: 1.1em;
      color: #495057;
    }
    
    .nota-contenido p {
      margin-bottom: 1rem;
    }
    
    .badge {
      font-size: 0.9em;
      padding: 0.5em 0.75em;
    }
    
    .btn {
      border-radius: 6px;
      font-weight: 500;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
    }
    
    .btn-primary:hover {
      background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
      transform: translateY(-1px);
    }
    
    .alert {
      border-radius: 8px;
      border: none;
    }
    
    .gap-2 {
      gap: 0.5rem;
    }
    
    .spinner-border-sm {
      width: 1rem;
      height: 1rem;
    }
    
    .list-unstyled li {
      margin-bottom: 0.5rem;
    }
    
    @media print {
      .btn, .card-header .btn-group, .card:last-child {
        display: none !important;
      }
      
      .card {
        box-shadow: none;
        border: 1px solid #dee2e6;
      }
      
      .nota-contenido {
        font-size: 12pt;
        line-height: 1.6;
      }
    }
    
    @media (max-width: 768px) {
      .d-flex.flex-wrap.gap-2 {
        flex-direction: column;
      }
      
      .d-flex.flex-wrap.gap-2 .btn {
        width: 100%;
        margin-bottom: 0.5rem;
      }
    }
  `]
})
export class DetalleNotaMedicaComponent implements OnInit {

  nota?: NotaMedica;
  error?: string;
  eliminando = false;

  constructor(
    private notaMedicaService: NotaMedicaService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.cargarNota(id);
      } else {
        this.error = 'ID de nota médica no válido';
      }
    });
  }

  cargarNota(id: number): void {
    this.notaMedicaService.obtenerNotaMedicaPorId(id).subscribe({
      next: (nota) => {
        this.nota = nota;
      },
      error: (error: any) => {
        console.error('Error al cargar nota:', error);
        this.error = 'No se pudo cargar la información de la nota médica';
      }
    });
  }

  editarNota(): void {
    if (this.nota?.id) {
      this.router.navigate(['/notas-medicas/editar', this.nota.id]);
    }
  }

  toggleArchivar(): void {
    if (!this.nota?.id) return;
    
    const operacion = !this.nota.archivado 
      ? this.notaMedicaService.archivarNotaMedica(this.nota.id)
      : this.notaMedicaService.desarchivarNotaMedica(this.nota.id);
    
    operacion.subscribe({
      next: () => {
        if (this.nota) {
          this.nota.archivado = !this.nota.archivado;
        }
      },
      error: (error: any) => {
        console.error('Error al cambiar estado de nota:', error);
      }
    });
  }

  eliminarNota(): void {
    if (!this.nota?.id) return;
    
    if (confirm(`¿Está seguro de que desea eliminar la nota "${this.nota.titulo}"?`)) {
      this.eliminando = true;
      
      this.notaMedicaService.eliminarNotaMedica(this.nota.id).subscribe({
        next: () => {
          this.router.navigate(['/notas-medicas']);
        },
        error: (error: any) => {
          console.error('Error al eliminar nota:', error);
          this.eliminando = false;
        }
      });
    }
  }

  imprimirNota(): void {
    window.print();
  }

  exportarPDF(): void {
    // Implementar exportación a PDF
    console.log('Exportar a PDF');
  }

  compartir(): void {
    // Implementar funcionalidad de compartir
    console.log('Compartir nota');
  }

  volver(): void {
    this.router.navigate(['/notas-medicas']);
  }

  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatearFechaCompleta(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  obtenerDiaSemana(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-ES', { weekday: 'long' });
  }

  obtenerHoraEstimada(): string {
    // Simular hora basada en el tipo de consulta
    if (!this.nota) return 'No disponible';
    
    switch (this.nota.tipoNota) {
      case 'URGENCIA':
        return 'Cualquier hora';
      case 'CONSULTA':
        return '09:00 - 17:00';
      case 'LABORATORIO':
        return '07:00 - 10:00';
      default:
        return '08:00 - 18:00';
    }
  }

  calcularTiempoTranscurrido(): string {
    if (!this.nota?.fechaConsulta) return '';
    
    const hoy = new Date();
    const consulta = new Date(this.nota.fechaConsulta);
    const diferenciaDias = Math.floor((hoy.getTime() - consulta.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diferenciaDias === 0) {
      return 'Hoy';
    } else if (diferenciaDias === 1) {
      return 'Ayer';
    } else if (diferenciaDias < 7) {
      return `${diferenciaDias} días`;
    } else if (diferenciaDias < 30) {
      const semanas = Math.floor(diferenciaDias / 7);
      return `${semanas} ${semanas === 1 ? 'semana' : 'semanas'}`;
    } else if (diferenciaDias < 365) {
      const meses = Math.floor(diferenciaDias / 30);
      return `${meses} ${meses === 1 ? 'mes' : 'meses'}`;
    } else {
      const años = Math.floor(diferenciaDias / 365);
      return `${años} ${años === 1 ? 'año' : 'años'}`;
    }
  }

  contarPalabras(texto: string): number {
    return texto.trim().split(/\s+/).length;
  }

  calcularTiempoLectura(): string {
    if (!this.nota) return '';
    
    const palabras = this.contarPalabras(this.nota.contenido);
    const minutos = Math.ceil(palabras / 200); // Promedio de 200 palabras por minuto
    
    if (minutos === 1) {
      return '1 minuto';
    } else {
      return `${minutos} minutos`;
    }
  }

  formatearContenido(contenido: string): string {
    // Convertir saltos de línea a <br> y mantener párrafos
    return contenido
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>');
  }

  obtenerIconoTipo(tipo: TipoNota): string {
    const iconos = {
      'CONSULTA': 'fa-stethoscope',
      'LABORATORIO': 'fa-flask',
      'RADIOLOGIA': 'fa-x-ray',
      'ESPECIALISTA': 'fa-user-md',
      'URGENCIA': 'fa-ambulance',
      'HOSPITALIZACION': 'fa-hospital',
      'CIRUGIA': 'fa-cut',
      'VACUNACION': 'fa-syringe',
      'REVISION': 'fa-search',
      'OTRO': 'fa-file-medical'
    };
    return iconos[tipo] || 'fa-file-medical';
  }

  obtenerTextoTipo(tipo: TipoNota): string {
    const textos = {
      'CONSULTA': 'Consulta',
      'LABORATORIO': 'Laboratorio',
      'RADIOLOGIA': 'Radiología',
      'ESPECIALISTA': 'Especialista',
      'URGENCIA': 'Urgencia',
      'HOSPITALIZACION': 'Hospitalización',
      'CIRUGIA': 'Cirugía',
      'VACUNACION': 'Vacunación',
      'REVISION': 'Revisión',
      'OTRO': 'Otro'
    };
    return textos[tipo] || 'Otro';
  }

  obtenerClaseTipo(tipo: TipoNota): string {
    const clases = {
      'CONSULTA': 'bg-primary',
      'LABORATORIO': 'bg-info',
      'RADIOLOGIA': 'bg-secondary',
      'ESPECIALISTA': 'bg-success',
      'URGENCIA': 'bg-danger',
      'HOSPITALIZACION': 'bg-warning',
      'CIRUGIA': 'bg-dark',
      'VACUNACION': 'bg-success',
      'REVISION': 'bg-info',
      'OTRO': 'bg-secondary'
    };
    return clases[tipo] || 'bg-secondary';
  }

  obtenerTextoPrioridad(prioridad: PrioridadNota): string {
    const textos = {
      'BAJA': 'Baja',
      'MEDIA': 'Media',
      'ALTA': 'Alta',
      'URGENTE': 'Urgente'
    };
    return textos[prioridad] || 'Desconocido';
  }

  obtenerClasePrioridad(prioridad: PrioridadNota): string {
    const clases = {
      'BAJA': 'bg-success',
      'MEDIA': 'bg-warning',
      'ALTA': 'bg-orange',
      'URGENTE': 'bg-danger'
    };
    return clases[prioridad] || 'bg-secondary';
  }

  obtenerRecomendaciones(): string[] {
    if (!this.nota) return [];
    
    switch (this.nota.tipoNota) {
      case 'CONSULTA':
        return ['Seguir las indicaciones médicas', 'Programar cita de seguimiento'];
      case 'LABORATORIO':
        return ['Revisar resultados con médico', 'Mantener ayuno si es necesario'];
      case 'URGENCIA':
        return ['Seguimiento inmediato', 'Contactar médico si empeoran síntomas'];
      default:
        return ['Seguir indicaciones médicas'];
    }
  }

  obtenerTipoSeguimiento(): string {
    if (!this.nota) return 'No definido';
    
    switch (this.nota.tipoNota) {
      case 'CONSULTA':
        return 'Seguimiento regular';
      case 'URGENCIA':
        return 'Seguimiento inmediato';
      case 'LABORATORIO':
        return 'Revisión de resultados';
      default:
        return 'Según indicación médica';
    }
  }

  obtenerAlertas(): string {
    if (!this.nota) return 'Sin alertas';
    
    if (this.nota.prioridad === 'URGENTE' && !this.nota.archivado) {
      return 'Requiere atención urgente';
    }
    
    return 'Sin alertas activas';
  }
}