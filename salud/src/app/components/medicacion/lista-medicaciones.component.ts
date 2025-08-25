import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MedicacionService } from '../../services/medicacion.service';
import { Medicacion } from '../../models/medicacion.model';

@Component({
  selector: 'app-lista-medicaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h3 class="mb-0">
                <i class="fas fa-pills me-2"></i>
                Mis Medicaciones
              </h3>
              <button 
                type="button" 
                class="btn btn-primary"
                (click)="nuevaMedicacion()">
                <i class="fas fa-plus me-1"></i>
                Nueva Medicación
              </button>
            </div>
            
            <div class="card-body">
              <!-- Filtros y búsqueda -->
              <div class="row mb-3">
                <div class="col-md-4">
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="fas fa-search"></i>
                    </span>
                    <input 
                      type="text" 
                      class="form-control" 
                      placeholder="Buscar medicación..."
                      [(ngModel)]="terminoBusqueda"
                      (input)="buscarMedicaciones()">
                  </div>
                </div>
                <div class="col-md-3">
                  <select 
                    class="form-select"
                    [(ngModel)]="filtroEstado"
                    (change)="aplicarFiltros()">
                    <option value="todas">Todas las medicaciones</option>
                    <option value="activas">Solo activas</option>
                    <option value="inactivas">Solo inactivas</option>
                    <option value="por-vencer">Por vencer</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <input 
                    type="text" 
                    class="form-control" 
                    placeholder="Filtrar por médico..."
                    [(ngModel)]="filtroMedico"
                    (input)="aplicarFiltros()">
                </div>
                <div class="col-md-2">
                  <button 
                    type="button" 
                    class="btn btn-outline-secondary w-100"
                    (click)="limpiarFiltros()">
                    <i class="fas fa-times me-1"></i>
                    Limpiar
                  </button>
                </div>
              </div>

              <!-- Alertas de medicaciones por vencer -->
              <div *ngIf="medicacionesPorVencer.length > 0" class="alert alert-warning" role="alert">
                <h6 class="alert-heading">
                  <i class="fas fa-exclamation-triangle me-2"></i>
                  Medicaciones por vencer
                </h6>
                <p class="mb-0">
                  Tienes {{ medicacionesPorVencer.length }} medicación(es) que vencen en los próximos 7 días.
                </p>
              </div>

              <!-- Lista de medicaciones -->
              <div *ngIf="medicacionesFiltradas.length === 0 && !cargando" class="text-center py-4">
                <i class="fas fa-pills fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">No se encontraron medicaciones</h5>
                <p class="text-muted">Comienza agregando tu primera medicación.</p>
                <button 
                  type="button" 
                  class="btn btn-primary"
                  (click)="nuevaMedicacion()">
                  <i class="fas fa-plus me-1"></i>
                  Agregar Medicación
                </button>
              </div>

              <div *ngIf="cargando" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="mt-2 text-muted">Cargando medicaciones...</p>
              </div>

              <div class="row" *ngIf="medicacionesFiltradas.length > 0">
                <div class="col-md-6 col-lg-4 mb-3" *ngFor="let medicacion of medicacionesFiltradas">
                  <div class="card h-100" [ngClass]="obtenerClaseCard(medicacion)">
                    <div class="card-header d-flex justify-content-between align-items-center">
                      <h6 class="mb-0 fw-bold">{{ medicacion.nombre }}</h6>
                      <div class="dropdown">
                        <button 
                          class="btn btn-sm btn-outline-secondary dropdown-toggle" 
                          type="button" 
                          [id]="'dropdown-' + medicacion.id"
                          data-bs-toggle="dropdown">
                          <i class="fas fa-ellipsis-v"></i>
                        </button>
                        <ul class="dropdown-menu">
                          <li>
                            <a class="dropdown-item" href="#" (click)="verDetalle(medicacion)">
                              <i class="fas fa-eye me-2"></i>Ver detalle
                            </a>
                          </li>
                          <li>
                            <a class="dropdown-item" href="#" (click)="editarMedicacion(medicacion)">
                              <i class="fas fa-edit me-2"></i>Editar
                            </a>
                          </li>
                          <li><hr class="dropdown-divider"></li>
                          <li *ngIf="medicacion.activo">
                            <a class="dropdown-item text-warning" href="#" (click)="desactivarMedicacion(medicacion)">
                              <i class="fas fa-pause me-2"></i>Desactivar
                            </a>
                          </li>
                          <li *ngIf="!medicacion.activo">
                            <a class="dropdown-item text-success" href="#" (click)="activarMedicacion(medicacion)">
                              <i class="fas fa-play me-2"></i>Activar
                            </a>
                          </li>
                          <li>
                            <a class="dropdown-item text-danger" href="#" (click)="eliminarMedicacion(medicacion)">
                              <i class="fas fa-trash me-2"></i>Eliminar
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div class="card-body">
                      <div class="mb-2">
                        <span class="badge" [ngClass]="obtenerBadgeEstado(medicacion)">{{ obtenerTextoEstado(medicacion) }}</span>
                        <span *ngIf="vencePronto(medicacion)" class="badge bg-warning ms-1">
                          <i class="fas fa-clock me-1"></i>Por vencer
                        </span>
                      </div>
                      
                      <p class="card-text">
                        <strong>Dosis:</strong> {{ medicacion.dosis }}<br>
                        <strong>Frecuencia:</strong> {{ medicacion.frecuencia }}<br>
                        <strong>Médico:</strong> {{ medicacion.medicoPrescriptor }}
                      </p>
                      
                      <div class="mb-2">
                        <small class="text-muted">
                          <i class="fas fa-calendar-alt me-1"></i>
                          Inicio: {{ formatearFecha(medicacion.fechaInicio) }}
                        </small>
                        <br *ngIf="medicacion.fechaFin">
                        <small class="text-muted" *ngIf="medicacion.fechaFin">
                          <i class="fas fa-calendar-times me-1"></i>
                          Fin: {{ formatearFecha(medicacion.fechaFin!) }}
                          <span *ngIf="diasRestantes(medicacion) !== null" class="ms-1">
                            ({{ diasRestantes(medicacion) }} días restantes)
                          </span>
                        </small>
                      </div>
                      
                      <div *ngIf="medicacion.indicaciones" class="mt-2">
                        <small class="text-muted">
                          <strong>Indicaciones:</strong> 
                          {{ medicacion.indicaciones.length > 100 ? (medicacion.indicaciones | slice:0:100) + '...' : medicacion.indicaciones }}
                        </small>
                      </div>
                    </div>
                    
                    <div class="card-footer bg-transparent">
                      <div class="d-flex justify-content-between">
                        <button 
                          type="button" 
                          class="btn btn-sm btn-outline-primary"
                          (click)="verDetalle(medicacion)">
                          <i class="fas fa-eye me-1"></i>
                          Ver más
                        </button>
                        <button 
                          type="button" 
                          class="btn btn-sm btn-outline-secondary"
                          (click)="editarMedicacion(medicacion)">
                          <i class="fas fa-edit me-1"></i>
                          Editar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }
    
    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    .card-vencida {
      border-left: 4px solid #dc3545;
    }
    
    .card-por-vencer {
      border-left: 4px solid #ffc107;
    }
    
    .card-activa {
      border-left: 4px solid #28a745;
    }
    
    .card-inactiva {
      border-left: 4px solid #6c757d;
      opacity: 0.8;
    }
    
    .dropdown-toggle::after {
      display: none;
    }
    
    .badge {
      font-size: 0.75em;
    }
    
    .alert {
      border-radius: 8px;
    }
    
    .btn {
      border-radius: 6px;
    }
    
    .card-header {
      background-color: rgba(0,0,0,0.03);
      border-bottom: 1px solid rgba(0,0,0,0.125);
    }
  `]
})
export class ListaMedicacionesComponent implements OnInit {

  medicaciones: Medicacion[] = [];
  medicacionesFiltradas: Medicacion[] = [];
  medicacionesPorVencer: Medicacion[] = [];
  cargando = false;
  
  // Filtros
  terminoBusqueda = '';
  filtroEstado = 'todas';
  filtroMedico = '';

  constructor(
    private medicacionService: MedicacionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarMedicaciones();
    this.cargarMedicacionesPorVencer();
  }

  cargarMedicaciones(): void {
    this.cargando = true;
    this.medicacionService.obtenerListaMedicaciones().subscribe({
      next: (data) => {
        this.medicaciones = data;
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar medicaciones:', error);
        this.cargando = false;
      }
    });
  }

  cargarMedicacionesPorVencer(): void {
    this.medicacionService.obtenerMedicacionesPorVencer(7).subscribe({
      next: (data) => {
        this.medicacionesPorVencer = data;
      },
      error: (error) => {
        console.error('Error al cargar medicaciones por vencer:', error);
      }
    });
  }

  aplicarFiltros(): void {
    let medicacionesFiltradas = [...this.medicaciones];

    // Filtro por estado
    switch (this.filtroEstado) {
      case 'activas':
        medicacionesFiltradas = medicacionesFiltradas.filter(m => this.medicacionService.esMedicacionActiva(m));
        break;
      case 'inactivas':
        medicacionesFiltradas = medicacionesFiltradas.filter(m => !this.medicacionService.esMedicacionActiva(m));
        break;
      case 'por-vencer':
        medicacionesFiltradas = medicacionesFiltradas.filter(m => this.medicacionService.vencePronto(m, 7));
        break;
    }

    // Filtro por médico
    if (this.filtroMedico.trim()) {
      medicacionesFiltradas = medicacionesFiltradas.filter(m => 
        m.medicoPrescriptor.toLowerCase().includes(this.filtroMedico.toLowerCase())
      );
    }

    // Filtro por término de búsqueda
    if (this.terminoBusqueda.trim()) {
      const termino = this.terminoBusqueda.toLowerCase();
      medicacionesFiltradas = medicacionesFiltradas.filter(m => 
        m.nombre.toLowerCase().includes(termino) ||
        m.dosis.toLowerCase().includes(termino) ||
        m.indicaciones.toLowerCase().includes(termino)
      );
    }

    this.medicacionesFiltradas = medicacionesFiltradas;
  }

  buscarMedicaciones(): void {
    this.aplicarFiltros();
  }

  limpiarFiltros(): void {
    this.terminoBusqueda = '';
    this.filtroEstado = 'todas';
    this.filtroMedico = '';
    this.aplicarFiltros();
  }

  nuevaMedicacion(): void {
    this.router.navigate(['/medicaciones/nueva']);
  }

  verDetalle(medicacion: Medicacion): void {
    this.router.navigate(['/medicaciones', medicacion.id]);
  }

  editarMedicacion(medicacion: Medicacion): void {
    this.router.navigate(['/medicaciones', medicacion.id, 'editar']);
  }

  desactivarMedicacion(medicacion: Medicacion): void {
    if (confirm(`¿Estás seguro de que deseas desactivar la medicación "${medicacion.nombre}"?`)) {
      this.medicacionService.desactivarMedicacion(medicacion.id!).subscribe({
        next: () => {
          this.cargarMedicaciones();
        },
        error: (error) => {
          console.error('Error al desactivar medicación:', error);
        }
      });
    }
  }

  activarMedicacion(medicacion: Medicacion): void {
    this.medicacionService.activarMedicacion(medicacion.id!).subscribe({
      next: () => {
        this.cargarMedicaciones();
      },
      error: (error) => {
        console.error('Error al activar medicación:', error);
      }
    });
  }

  eliminarMedicacion(medicacion: Medicacion): void {
    if (confirm(`¿Estás seguro de que deseas eliminar permanentemente la medicación "${medicacion.nombre}"? Esta acción no se puede deshacer.`)) {
      this.medicacionService.eliminarMedicacion(medicacion.id!).subscribe({
        next: () => {
          this.cargarMedicaciones();
        },
        error: (error) => {
          console.error('Error al eliminar medicación:', error);
        }
      });
    }
  }

  // Métodos de utilidad
  obtenerClaseCard(medicacion: Medicacion): string {
    if (!medicacion.activo) return 'card-inactiva';
    if (this.estaVencida(medicacion)) return 'card-vencida';
    if (this.vencePronto(medicacion)) return 'card-por-vencer';
    return 'card-activa';
  }

  obtenerBadgeEstado(medicacion: Medicacion): string {
    if (!medicacion.activo) return 'bg-secondary';
    if (this.estaVencida(medicacion)) return 'bg-danger';
    if (this.vencePronto(medicacion)) return 'bg-warning';
    return 'bg-success';
  }

  obtenerTextoEstado(medicacion: Medicacion): string {
    if (!medicacion.activo) return 'Inactiva';
    if (this.estaVencida(medicacion)) return 'Vencida';
    if (this.vencePronto(medicacion)) return 'Por vencer';
    return 'Activa';
  }

  estaVencida(medicacion: Medicacion): boolean {
    if (!medicacion.fechaFin) return false;
    const ahora = new Date();
    const fechaFin = new Date(medicacion.fechaFin);
    return ahora > fechaFin;
  }

  vencePronto(medicacion: Medicacion): boolean {
    return this.medicacionService.vencePronto(medicacion, 7);
  }

  diasRestantes(medicacion: Medicacion): number | null {
    return this.medicacionService.diasRestantesTratamiento(medicacion);
  }

  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-ES');
  }
}