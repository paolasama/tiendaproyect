import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MedicacionService } from '../../services/medicacion.service';
import { Medicacion } from '../../models/medicacion.model';

@Component({
  selector: 'app-detalle-medicacion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid" *ngIf="medicacion">
      <div class="row justify-content-center">
        <div class="col-md-10 col-lg-8">
          <!-- Header -->
          <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
              <div>
                <h3 class="mb-0">
                  <i class="fas fa-pills me-2"></i>
                  {{ medicacion.nombre }}
                </h3>
                <span class="badge" [ngClass]="obtenerClaseEstado()">
                  <i class="fas" [ngClass]="medicacion.activo ? 'fa-check-circle' : 'fa-pause-circle'"></i>
                  {{ medicacion.activo ? 'Activa' : 'Inactiva' }}
                </span>
              </div>
              <div class="btn-group">
                <button 
                  class="btn btn-outline-primary btn-sm"
                  (click)="editarMedicacion()">
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
                      <i class="fas fa-capsules me-1"></i>
                      Medicación:
                    </label>
                    <span class="info-value">{{ medicacion.nombre }}</span>
                  </div>
                  
                  <div class="info-item mb-3">
                    <label class="info-label">
                      <i class="fas fa-balance-scale me-1"></i>
                      Dosis:
                    </label>
                    <span class="info-value">{{ medicacion.dosis }}</span>
                  </div>
                  
                  <div class="info-item mb-3">
                    <label class="info-label">
                      <i class="fas fa-clock me-1"></i>
                      Frecuencia:
                    </label>
                    <span class="info-value">{{ medicacion.frecuencia }}</span>
                  </div>
                  
                  <div class="info-item mb-3">
                    <label class="info-label">
                      <i class="fas fa-user-md me-1"></i>
                      Médico prescriptor:
                    </label>
                    <span class="info-value">{{ medicacion.medicoPrescriptor }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-md-6 mb-4">
              <div class="card h-100">
                <div class="card-header">
                  <h5 class="mb-0">
                    <i class="fas fa-calendar-alt me-2"></i>
                    Cronología
                  </h5>
                </div>
                <div class="card-body">
                  <div class="info-item mb-3">
                    <label class="info-label">
                      <i class="fas fa-play-circle me-1"></i>
                      Fecha de inicio:
                    </label>
                    <span class="info-value">{{ formatearFecha(medicacion.fechaInicio) }}</span>
                  </div>
                  
                  <div class="info-item mb-3">
                    <label class="info-label">
                      <i class="fas fa-stop-circle me-1"></i>
                      Fecha de fin:
                    </label>
                    <span class="info-value">
                      {{ medicacion.fechaFin ? formatearFecha(medicacion.fechaFin) : 'Tratamiento indefinido' }}
                    </span>
                  </div>
                  
                  <div class="info-item mb-3" *ngIf="medicacion.fechaFin">
                    <label class="info-label">
                      <i class="fas fa-hourglass-half me-1"></i>
                      Duración del tratamiento:
                    </label>
                    <span class="info-value">{{ calcularDuracionTratamiento() }}</span>
                  </div>
                  
                  <div class="info-item mb-3" *ngIf="medicacion.fechaFin && medicacion.activo">
                    <label class="info-label">
                      <i class="fas fa-calendar-check me-1"></i>
                      Días restantes:
                    </label>
                    <span class="info-value" [ngClass]="obtenerClaseDiasRestantes()">
                      {{ calcularDiasRestantes() }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Indicaciones -->
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-file-medical me-2"></i>
                Indicaciones
              </h5>
            </div>
            <div class="card-body">
              <p class="mb-0">{{ medicacion.indicaciones }}</p>
            </div>
          </div>

          <!-- Observaciones -->
          <div class="card mb-4" *ngIf="medicacion.observaciones">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-sticky-note me-2"></i>
                Observaciones
              </h5>
            </div>
            <div class="card-body">
              <p class="mb-0">{{ medicacion.observaciones }}</p>
            </div>
          </div>

          <!-- Alertas y recordatorios -->
          <div class="card mb-4" *ngIf="mostrarAlertas()">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Alertas
              </h5>
            </div>
            <div class="card-body">
              <div class="alert alert-warning" *ngIf="esMedicacionProximaAVencer()">
                <i class="fas fa-clock me-2"></i>
                <strong>Atención:</strong> Esta medicación vence en {{ calcularDiasRestantes() }}.
                Consulte con su médico sobre la renovación del tratamiento.
              </div>
              
              <div class="alert alert-danger" *ngIf="esMedicacionVencida()">
                <i class="fas fa-times-circle me-2"></i>
                <strong>Medicación vencida:</strong> El tratamiento finalizó el {{ formatearFecha(medicacion.fechaFin!) }}.
                Consulte con su médico si necesita continuar el tratamiento.
              </div>
              
              <div class="alert alert-info" *ngIf="!medicacion.activo">
                <i class="fas fa-pause-circle me-2"></i>
                <strong>Medicación pausada:</strong> Esta medicación está marcada como inactiva.
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
                  (click)="editarMedicacion()">
                  <i class="fas fa-edit me-1"></i>
                  Editar medicación
                </button>
                
                <button 
                  class="btn"
                  [ngClass]="medicacion.activo ? 'btn-warning' : 'btn-success'"
                  (click)="toggleEstadoMedicacion()">
                  <i class="fas" [ngClass]="medicacion.activo ? 'fa-pause' : 'fa-play'"></i>
                  {{ medicacion.activo ? 'Pausar' : 'Activar' }} medicación
                </button>
                
                <button 
                  class="btn btn-outline-info"
                  (click)="imprimirDetalles()">
                  <i class="fas fa-print me-1"></i>
                  Imprimir
                </button>
                
                <button 
                  class="btn btn-outline-danger"
                  (click)="eliminarMedicacion()"
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
    <div class="d-flex justify-content-center align-items-center" style="height: 50vh;" *ngIf="!medicacion && !error">
      <div class="text-center">
        <div class="spinner-border text-primary mb-3"></div>
        <p>Cargando información de la medicación...</p>
      </div>
    </div>

    <!-- Error state -->
    <div class="d-flex justify-content-center align-items-center" style="height: 50vh;" *ngIf="error">
      <div class="text-center">
        <i class="fas fa-exclamation-triangle text-danger mb-3" style="font-size: 3rem;"></i>
        <h4>Error al cargar la medicación</h4>
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
    
    .badge.bg-success {
      background-color: #28a745 !important;
    }
    
    .badge.bg-secondary {
      background-color: #6c757d !important;
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
    
    .text-success {
      color: #28a745 !important;
    }
    
    .text-warning {
      color: #ffc107 !important;
    }
    
    .text-danger {
      color: #dc3545 !important;
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
export class DetalleMedicacionComponent implements OnInit {

  medicacion?: Medicacion;
  error?: string;
  eliminando = false;

  constructor(
    private medicacionService: MedicacionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.cargarMedicacion(id);
      } else {
        this.error = 'ID de medicación no válido';
      }
    });
  }

  cargarMedicacion(id: number): void {
    this.medicacionService.obtenerMedicacionPorId(id).subscribe({
      next: (medicacion) => {
        this.medicacion = medicacion;
      },
      error: (error) => {
        console.error('Error al cargar medicación:', error);
        this.error = 'No se pudo cargar la información de la medicación';
      }
    });
  }

  editarMedicacion(): void {
    if (this.medicacion?.id) {
      this.router.navigate(['/medicaciones/editar', this.medicacion.id]);
    }
  }

  toggleEstadoMedicacion(): void {
    if (!this.medicacion?.id) return;
    
    const operacion = this.medicacion.activo 
      ? this.medicacionService.desactivarMedicacion(this.medicacion.id)
      : this.medicacionService.activarMedicacion(this.medicacion.id);
    
    operacion.subscribe({
      next: () => {
        if (this.medicacion) {
          this.medicacion.activo = !this.medicacion.activo;
        }
      },
      error: (error) => {
        console.error('Error al cambiar estado de medicación:', error);
      }
    });
  }

  eliminarMedicacion(): void {
    if (!this.medicacion?.id) return;
    
    if (confirm(`¿Está seguro de que desea eliminar la medicación "${this.medicacion.nombre}"?`)) {
      this.eliminando = true;
      
      this.medicacionService.eliminarMedicacion(this.medicacion.id).subscribe({
        next: () => {
          this.router.navigate(['/medicaciones']);
        },
        error: (error) => {
          console.error('Error al eliminar medicación:', error);
          this.eliminando = false;
        }
      });
    }
  }

  imprimirDetalles(): void {
    window.print();
  }

  volver(): void {
    this.router.navigate(['/medicaciones']);
  }

  obtenerClaseEstado(): string {
    return this.medicacion?.activo ? 'bg-success' : 'bg-secondary';
  }

  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  calcularDuracionTratamiento(): string {
    if (!this.medicacion?.fechaFin) return '';
    
    const inicio = new Date(this.medicacion.fechaInicio);
    const fin = new Date(this.medicacion.fechaFin);
    const diferenciaDias = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diferenciaDias < 30) {
      return `${diferenciaDias} días`;
    } else if (diferenciaDias < 365) {
      const meses = Math.floor(diferenciaDias / 30);
      const diasRestantes = diferenciaDias % 30;
      return diasRestantes > 0 ? `${meses} meses y ${diasRestantes} días` : `${meses} meses`;
    } else {
      const años = Math.floor(diferenciaDias / 365);
      const diasRestantes = diferenciaDias % 365;
      const meses = Math.floor(diasRestantes / 30);
      return `${años} años${meses > 0 ? ` y ${meses} meses` : ''}`;
    }
  }

  calcularDiasRestantes(): string {
    if (!this.medicacion?.fechaFin) return '';
    
    const hoy = new Date();
    const fin = new Date(this.medicacion.fechaFin);
    const diferenciaDias = Math.ceil((fin.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diferenciaDias < 0) {
      return `Vencida hace ${Math.abs(diferenciaDias)} días`;
    } else if (diferenciaDias === 0) {
      return 'Vence hoy';
    } else if (diferenciaDias === 1) {
      return 'Vence mañana';
    } else {
      return `${diferenciaDias} días restantes`;
    }
  }

  obtenerClaseDiasRestantes(): string {
    if (!this.medicacion?.fechaFin) return '';
    
    const hoy = new Date();
    const fin = new Date(this.medicacion.fechaFin);
    const diferenciaDias = Math.ceil((fin.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diferenciaDias < 0) {
      return 'text-danger';
    } else if (diferenciaDias <= 7) {
      return 'text-warning';
    } else {
      return 'text-success';
    }
  }

  esMedicacionProximaAVencer(): boolean {
    if (!this.medicacion?.fechaFin || !this.medicacion.activo) return false;
    
    const hoy = new Date();
    const fin = new Date(this.medicacion.fechaFin);
    const diferenciaDias = Math.ceil((fin.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    
    return diferenciaDias > 0 && diferenciaDias <= 7;
  }

  esMedicacionVencida(): boolean {
    if (!this.medicacion?.fechaFin) return false;
    
    const hoy = new Date();
    const fin = new Date(this.medicacion.fechaFin);
    
    return fin < hoy;
  }

  mostrarAlertas(): boolean {
    return this.esMedicacionProximaAVencer() || 
           this.esMedicacionVencida() || 
           !this.medicacion?.activo;
  }
}