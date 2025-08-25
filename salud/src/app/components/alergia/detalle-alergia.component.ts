import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AlergiaService } from '../../services/alergia.service';
import { Alergia, TipoAlergia, SeveridadAlergia } from '../../models/alergia.model';

@Component({
  selector: 'app-detalle-alergia',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid" *ngIf="alergia">
      <div class="row justify-content-center">
        <div class="col-md-10 col-lg-8">
          <!-- Header -->
          <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
              <div>
                <h3 class="mb-0">
                  <i class="fas fa-allergies me-2"></i>
                  {{ alergia.alergeno }}
                </h3>
                <div class="mt-2">
                  <span class="badge" [ngClass]="obtenerClaseSeveridad(alergia.severidad)" style="font-size: 0.9em;">
                    <i class="fas fa-exclamation-triangle me-1"></i>
                    {{ obtenerTextoSeveridad(alergia.severidad) }}
                  </span>
                  <span class="badge ms-2" [ngClass]="alergia.activo ? 'bg-success' : 'bg-secondary'">
                    <i class="fas" [ngClass]="alergia.activo ? 'fa-check-circle' : 'fa-pause-circle'"></i>
                    {{ alergia.activo ? 'Activa' : 'Inactiva' }}
                  </span>
                </div>
              </div>
              <div class="btn-group">
                <button 
                  class="btn btn-outline-primary btn-sm"
                  (click)="editarAlergia()">
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

          <!-- Alerta de severidad crítica -->
          <div class="alert alert-danger" *ngIf="alergia.severidad === 'CRITICA' && alergia.activo">
            <div class="d-flex align-items-center">
              <i class="fas fa-exclamation-triangle fa-2x me-3"></i>
              <div>
                <h5 class="alert-heading mb-1">¡ALERGIA CRÍTICA!</h5>
                <p class="mb-0">Esta alergia puede causar reacciones potencialmente mortales. Mantenga siempre medicación de emergencia disponible.</p>
              </div>
            </div>
          </div>

          <!-- Información principal -->
          <div class="row">
            <div class="col-md-6 mb-4">
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
                      <i class="fas fa-exclamation-triangle me-1"></i>
                      Alérgeno:
                    </label>
                    <span class="info-value">{{ alergia.alergeno }}</span>
                  </div>
                  
                  <div class="info-item mb-3">
                    <label class="info-label">
                      <i class="fas" [ngClass]="obtenerIconoTipo(alergia.tipo)" me-1></i>
                      Tipo:
                    </label>
                    <span class="info-value">
                      <i class="fas" [ngClass]="obtenerIconoTipo(alergia.tipo)" [style.color]="obtenerColorSeveridad(alergia.severidad)"></i>
                      {{ obtenerTextoTipo(alergia.tipo) }}
                    </span>
                  </div>
                  
                  <div class="info-item mb-3">
                    <label class="info-label">
                      <i class="fas fa-thermometer-half me-1"></i>
                      Severidad:
                    </label>
                    <span class="info-value">
                      <span class="badge" [ngClass]="obtenerClaseSeveridad(alergia.severidad)">
                        {{ obtenerTextoSeveridad(alergia.severidad) }}
                      </span>
                      <small class="text-muted ms-2">{{ obtenerDescripcionSeveridad(alergia.severidad) }}</small>
                    </span>
                  </div>
                  
                  <div class="info-item mb-3">
                    <label class="info-label">
                      <i class="fas fa-calendar-alt me-1"></i>
                      Fecha de diagnóstico:
                    </label>
                    <span class="info-value">{{ formatearFecha(alergia.fechaDiagnostico) }}</span>
                  </div>
                  
                  <div class="info-item">
                    <label class="info-label">
                      <i class="fas fa-clock me-1"></i>
                      Tiempo desde diagnóstico:
                    </label>
                    <span class="info-value">{{ calcularTiempoDesdeDiagnostico() }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-md-6 mb-4">
              <div class="card h-100">
                <div class="card-header">
                  <h5 class="mb-0">
                    <i class="fas fa-notes-medical me-2"></i>
                    Síntomas
                  </h5>
                </div>
                <div class="card-body">
                  <p class="mb-0">{{ alergia.sintomas }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Tratamiento -->
          <div class="card mb-4" *ngIf="alergia.tratamiento">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-prescription-bottle-alt me-2"></i>
                Tratamiento Recomendado
              </h5>
            </div>
            <div class="card-body">
              <p class="mb-0">{{ alergia.tratamiento }}</p>
            </div>
          </div>

          <!-- Observaciones -->
          <div class="card mb-4" *ngIf="alergia.observaciones">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-sticky-note me-2"></i>
                Observaciones
              </h5>
            </div>
            <div class="card-body">
              <p class="mb-0">{{ alergia.observaciones }}</p>
            </div>
          </div>

          <!-- Recomendaciones de seguridad -->
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-shield-alt me-2"></i>
                Recomendaciones de Seguridad
              </h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <h6><i class="fas fa-exclamation-circle text-warning me-1"></i> Prevención:</h6>
                  <ul class="list-unstyled">
                    <li *ngFor="let recomendacion of obtenerRecomendacionesPrevencion()">
                      <i class="fas fa-check text-success me-2"></i>
                      {{ recomendacion }}
                    </li>
                  </ul>
                </div>
                <div class="col-md-6">
                  <h6><i class="fas fa-first-aid text-danger me-1"></i> En caso de exposición:</h6>
                  <ul class="list-unstyled">
                    <li *ngFor="let accion of obtenerAccionesEmergencia()">
                      <i class="fas fa-arrow-right text-danger me-2"></i>
                      {{ accion }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Historial y seguimiento -->
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-history me-2"></i>
                Seguimiento
              </h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-4">
                  <div class="text-center">
                    <i class="fas fa-calendar-check fa-2x text-primary mb-2"></i>
                    <h6>Última revisión</h6>
                    <p class="text-muted">{{ formatearFecha(alergia.fechaDiagnostico) }}</p>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="text-center">
                    <i class="fas fa-user-md fa-2x text-info mb-2"></i>
                    <h6>Próxima consulta</h6>
                    <p class="text-muted">{{ obtenerProximaConsulta() }}</p>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="text-center">
                    <i class="fas fa-flask fa-2x text-warning mb-2"></i>
                    <h6>Pruebas de seguimiento</h6>
                    <p class="text-muted">{{ obtenerPruebasSeguimiento() }}</p>
                  </div>
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
                  (click)="editarAlergia()">
                  <i class="fas fa-edit me-1"></i>
                  Editar alergia
                </button>
                
                <button 
                  class="btn"
                  [ngClass]="alergia.activo ? 'btn-warning' : 'btn-success'"
                  (click)="toggleEstadoAlergia()">
                  <i class="fas" [ngClass]="alergia.activo ? 'fa-pause' : 'fa-play'"></i>
                  {{ alergia.activo ? 'Desactivar' : 'Activar' }} alergia
                </button>
                
                <button 
                  class="btn btn-outline-info"
                  (click)="imprimirDetalles()">
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
                  class="btn btn-outline-danger"
                  (click)="eliminarAlergia()"
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
    <div class="d-flex justify-content-center align-items-center" style="height: 50vh;" *ngIf="!alergia && !error">
      <div class="text-center">
        <div class="spinner-border text-primary mb-3"></div>
        <p>Cargando información de la alergia...</p>
      </div>
    </div>

    <!-- Error state -->
    <div class="d-flex justify-content-center align-items-center" style="height: 50vh;" *ngIf="error">
      <div class="text-center">
        <i class="fas fa-exclamation-triangle text-danger mb-3" style="font-size: 3rem;"></i>
        <h4>Error al cargar la alergia</h4>
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
    
    @media print {
      .btn, .card-header .btn-group {
        display: none !important;
      }
      
      .card {
        box-shadow: none;
        border: 1px solid #dee2e6;
      }
    }
  `]
})
export class DetalleAlergiaComponent implements OnInit {

  alergia?: Alergia;
  error?: string;
  eliminando = false;

  constructor(
    private alergiaService: AlergiaService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.cargarAlergia(id);
      } else {
        this.error = 'ID de alergia no válido';
      }
    });
  }

  cargarAlergia(id: number): void {
    this.alergiaService.obtenerAlergiaPorId(id).subscribe({
      next: (alergia) => {
        this.alergia = alergia;
      },
      error: (error) => {
        console.error('Error al cargar alergia:', error);
        this.error = 'No se pudo cargar la información de la alergia';
      }
    });
  }

  editarAlergia(): void {
    if (this.alergia?.id) {
      this.router.navigate(['/alergias/editar', this.alergia.id]);
    }
  }

  toggleEstadoAlergia(): void {
    if (!this.alergia?.id) return;
    
    const operacion = this.alergia.activo
      ? this.alergiaService.desactivarAlergia(this.alergia.id)
      : this.alergiaService.activarAlergia(this.alergia.id);
    
    operacion.subscribe({
      next: () => {
        if (this.alergia) {
          this.alergia.activo = !this.alergia.activo;
        }
      },
      error: (error) => {
        console.error('Error al cambiar estado de alergia:', error);
      }
    });
  }

  eliminarAlergia(): void {
    if (!this.alergia?.id) return;
    
    if (confirm(`¿Está seguro de que desea eliminar la alergia "${this.alergia.alergeno}"?`)) {
      this.eliminando = true;
      
      this.alergiaService.eliminarAlergia(this.alergia.id).subscribe({
        next: () => {
          this.router.navigate(['/alergias']);
        },
        error: (error) => {
          console.error('Error al eliminar alergia:', error);
          this.eliminando = false;
        }
      });
    }
  }

  imprimirDetalles(): void {
    window.print();
  }

  exportarPDF(): void {
    // Implementar exportación a PDF
    console.log('Exportar a PDF');
  }

  volver(): void {
    this.router.navigate(['/alergias']);
  }

  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  calcularTiempoDesdeDiagnostico(): string {
    if (!this.alergia?.fechaDiagnostico) return '';
    
    const hoy = new Date();
    const diagnostico = new Date(this.alergia.fechaDiagnostico);
    const diferenciaDias = Math.floor((hoy.getTime() - diagnostico.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diferenciaDias < 30) {
      return `${diferenciaDias} días`;
    } else if (diferenciaDias < 365) {
      const meses = Math.floor(diferenciaDias / 30);
      return `${meses} ${meses === 1 ? 'mes' : 'meses'}`;
    } else {
      const años = Math.floor(diferenciaDias / 365);
      const mesesRestantes = Math.floor((diferenciaDias % 365) / 30);
      return `${años} ${años === 1 ? 'año' : 'años'}${mesesRestantes > 0 ? ` y ${mesesRestantes} ${mesesRestantes === 1 ? 'mes' : 'meses'}` : ''}`;
    }
  }

  obtenerIconoTipo(tipo: TipoAlergia): string {
    const iconos = {
      'MEDICINAL': 'fa-pills',
      'ALIMENTARIA': 'fa-utensils',
      'AMBIENTAL': 'fa-leaf',
      'CONTACTO': 'fa-hand-paper',
      'OTRA': 'fa-question-circle'
    };
    return iconos[tipo] || 'fa-question-circle';
  }

  obtenerTextoTipo(tipo: TipoAlergia): string {
    const textos = {
      'MEDICINAL': 'Medicinal',
      'ALIMENTARIA': 'Alimentaria',
      'AMBIENTAL': 'Ambiental',
      'CONTACTO': 'Contacto',
      'OTRA': 'Otra'
    };
    return textos[tipo] || 'Desconocido';
  }

  obtenerColorSeveridad(severidad: SeveridadAlergia): string {
    const colores = {
      'LEVE': '#28a745',
      'MODERADA': '#ffc107',
      'SEVERA': '#fd7e14',
      'CRITICA': '#dc3545'
    };
    return colores[severidad] || '#6c757d';
  }

  obtenerClaseSeveridad(severidad: SeveridadAlergia): string {
    const clases = {
      'LEVE': 'bg-success',
      'MODERADA': 'bg-warning',
      'SEVERA': 'bg-orange',
      'CRITICA': 'bg-danger'
    };
    return clases[severidad] || 'bg-secondary';
  }

  obtenerTextoSeveridad(severidad: SeveridadAlergia): string {
    const textos = {
      'LEVE': 'Leve',
      'MODERADA': 'Moderada',
      'SEVERA': 'Severa',
      'CRITICA': 'Crítica'
    };
    return textos[severidad] || 'Desconocido';
  }

  obtenerDescripcionSeveridad(severidad: SeveridadAlergia): string {
    const descripciones = {
      'LEVE': 'Síntomas menores',
      'MODERADA': 'Síntomas molestos',
      'SEVERA': 'Síntomas importantes',
      'CRITICA': 'Potencialmente mortal'
    };
    return descripciones[severidad] || '';
  }

  obtenerRecomendacionesPrevencion(): string[] {
    if (!this.alergia) return [];
    
    const recomendaciones: string[] = [];
    
    switch (this.alergia.tipo) {
      case 'MEDICINAL':
        recomendaciones.push('Informar a todos los profesionales de salud');
        recomendaciones.push('Llevar identificación médica');
        recomendaciones.push('Verificar medicamentos antes de tomarlos');
        break;
      case 'ALIMENTARIA':
        recomendaciones.push('Leer etiquetas de alimentos cuidadosamente');
        recomendaciones.push('Informar en restaurantes sobre la alergia');
        recomendaciones.push('Llevar medicación de emergencia');
        break;
      case 'AMBIENTAL':
        recomendaciones.push('Evitar exposición durante temporadas altas');
        recomendaciones.push('Usar filtros de aire en casa');
        recomendaciones.push('Mantener ventanas cerradas');
        break;
      case 'CONTACTO':
        recomendaciones.push('Usar guantes protectores');
        recomendaciones.push('Leer etiquetas de productos');
        recomendaciones.push('Evitar contacto directo');
        break;
      default:
        recomendaciones.push('Evitar el alérgeno conocido');
        recomendaciones.push('Consultar con especialista');
    }
    
    return recomendaciones;
  }

  obtenerAccionesEmergencia(): string[] {
    if (!this.alergia) return [];
    
    const acciones: string[] = [];
    
    if (this.alergia.severidad === 'CRITICA') {
      acciones.push('Usar autoinyector de epinefrina inmediatamente');
      acciones.push('Llamar al 911 o servicios de emergencia');
      acciones.push('Buscar atención médica inmediata');
    } else if (this.alergia.severidad === 'SEVERA') {
      acciones.push('Tomar antihistamínicos según prescripción');
      acciones.push('Contactar al médico');
      acciones.push('Monitorear síntomas de cerca');
    } else {
      acciones.push('Tomar medicación según indicación médica');
      acciones.push('Evitar mayor exposición');
      acciones.push('Consultar si los síntomas empeoran');
    }
    
    return acciones;
  }

  obtenerProximaConsulta(): string {
    if (!this.alergia) return 'No programada';
    
    if (this.alergia.severidad === 'CRITICA') {
      return 'Cada 6 meses';
    } else if (this.alergia.severidad === 'SEVERA') {
      return 'Anual';
    } else {
      return 'Según necesidad';
    }
  }

  obtenerPruebasSeguimiento(): string {
    if (!this.alergia) return 'No requeridas';
    
    switch (this.alergia.tipo) {
      case 'MEDICINAL':
        return 'Pruebas de sensibilidad';
      case 'ALIMENTARIA':
        return 'Pruebas cutáneas anuales';
      case 'AMBIENTAL':
        return 'Pruebas estacionales';
      default:
        return 'Según criterio médico';
    }
  }
}