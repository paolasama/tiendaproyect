import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotaMedicaService } from '../../services/nota-medica.service';
import { NotaMedica, TipoNota, PrioridadNota, EstadisticasNotaMedica } from '../../models/nota-medica.model';

@Component({
  selector: 'app-lista-notas-medicas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="mb-1">
                <i class="fas fa-notes-medical me-2"></i>
                Notas Médicas
              </h2>
              <p class="text-muted mb-0">Gestión de notas médicas y consultas</p>
            </div>
            <button 
              class="btn btn-primary"
              (click)="nuevaNota()">
              <i class="fas fa-plus me-2"></i>
              Nueva Nota
            </button>
          </div>
        </div>
      </div>

      <!-- Estadísticas rápidas -->
      <div class="row mb-4" *ngIf="estadisticas">
        <div class="col-md-3 col-sm-6 mb-3">
          <div class="card stat-card bg-primary text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h3 class="mb-0">{{ estadisticas.totalNotas }}</h3>
                  <p class="mb-0">Total Notas</p>
                </div>
                <i class="fas fa-file-medical fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-sm-6 mb-3">
          <div class="card stat-card bg-success text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h3 class="mb-0">{{ estadisticas.notasActivas }}</h3>
                  <p class="mb-0">Activas</p>
                </div>
                <i class="fas fa-check-circle fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-sm-6 mb-3">
          <div class="card stat-card bg-warning text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h3 class="mb-0">{{ estadisticas.notasPorTipo['ALTA'] || 0 }}</h3>
                  <p class="mb-0">Alta Prioridad</p>
                </div>
                <i class="fas fa-exclamation-triangle fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-sm-6 mb-3">
          <div class="card stat-card bg-info text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h3 class="mb-0">{{ estadisticas.citasProximas }}</h3>
                  <p class="mb-0">Próximas Citas</p>
                </div>
                <i class="fas fa-calendar-alt fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros y búsqueda -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-3">
              <label class="form-label">Buscar:</label>
              <div class="input-group">
                <span class="input-group-text">
                  <i class="fas fa-search"></i>
                </span>
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Buscar por título o contenido..."
                  [(ngModel)]="filtros.busqueda"
                  (input)="aplicarFiltros()">
              </div>
            </div>
            <div class="col-md-2">
              <label class="form-label">Estado:</label>
              <select 
                class="form-select"
                [(ngModel)]="filtros.estado"
                (change)="aplicarFiltros()">
                <option value="">Todos</option>
                <option value="activa">Activas</option>
                <option value="archivada">Archivadas</option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label">Tipo:</label>
              <select 
                class="form-select"
                [(ngModel)]="filtros.tipo"
                (change)="aplicarFiltros()">
                <option value="">Todos</option>
                <option value="CONSULTA">Consulta</option>
                <option value="LABORATORIO">Laboratorio</option>
                <option value="RADIOLOGIA">Radiología</option>
                <option value="ESPECIALISTA">Especialista</option>
                <option value="URGENCIA">Urgencia</option>
                <option value="HOSPITALIZACION">Hospitalización</option>
                <option value="CIRUGIA">Cirugía</option>
                <option value="VACUNACION">Vacunación</option>
                <option value="REVISION">Revisión</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label">Prioridad:</label>
              <select 
                class="form-select"
                [(ngModel)]="filtros.prioridad"
                (change)="aplicarFiltros()">
                <option value="">Todas</option>
                <option value="BAJA">Baja</option>
                <option value="MEDIA">Media</option>
                <option value="ALTA">Alta</option>
                <option value="URGENTE">Urgente</option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">Médico:</label>
              <div class="input-group">
                <span class="input-group-text">
                  <i class="fas fa-user-md"></i>
                </span>
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Buscar por médico..."
                  [(ngModel)]="filtros.medico"
                  (input)="aplicarFiltros()">
              </div>
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-12">
              <button 
                class="btn btn-outline-secondary btn-sm me-2"
                (click)="limpiarFiltros()">
                <i class="fas fa-times me-1"></i>
                Limpiar filtros
              </button>
              <span class="text-muted">{{ notasFiltradas.length }} de {{ notas.length }} notas</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de notas -->
      <div class="row" *ngIf="notasFiltradas.length > 0">
        <div class="col-12">
          <!-- Vista de tarjetas -->
          <div class="row" *ngIf="vistaActual === 'tarjetas'">
            <div class="col-lg-4 col-md-6 mb-4" *ngFor="let nota of notasFiltradas">
              <div class="card nota-card h-100" [ngClass]="obtenerClaseCard(nota)">
                <div class="card-header d-flex justify-content-between align-items-start">
                  <div class="flex-grow-1">
                    <h6 class="mb-1 text-truncate" [title]="nota.titulo">{{ nota.titulo }}</h6>
                    <div class="d-flex flex-wrap gap-1">
                      <span class="badge" [ngClass]="obtenerClaseTipo(nota.tipoNota)">
                        <i class="fas" [ngClass]="obtenerIconoTipo(nota.tipoNota)"></i>
                        {{ obtenerTextoTipo(nota.tipoNota) }}
                      </span>
                      <span class="badge" [ngClass]="obtenerClasePrioridad(nota.prioridad)">
                        {{ obtenerTextoPrioridad(nota.prioridad) }}
                      </span>
                    </div>
                  </div>
                  <div class="dropdown">
                    <button class="btn btn-sm btn-outline-secondary" data-bs-toggle="dropdown">
                      <i class="fas fa-ellipsis-v"></i>
                    </button>
                    <ul class="dropdown-menu">
                      <li><a class="dropdown-item" (click)="verDetalle(nota.id!)"><i class="fas fa-eye me-2"></i>Ver detalle</a></li>
                      <li><a class="dropdown-item" (click)="editarNota(nota.id!)"><i class="fas fa-edit me-2"></i>Editar</a></li>
                      <li><hr class="dropdown-divider"></li>
                      <li><a class="dropdown-item" (click)="toggleArchivar(nota)">
                        <i class="fas" [ngClass]="!nota.archivado ? 'fa-archive' : 'fa-box-open'"></i>
                        {{ !nota.archivado ? 'Archivar' : 'Desarchivar' }}
                      </a></li>
                      <li><a class="dropdown-item text-danger" (click)="eliminarNota(nota)"><i class="fas fa-trash me-2"></i>Eliminar</a></li>
                    </ul>
                  </div>
                </div>
                <div class="card-body">
                  <p class="card-text text-muted small mb-2" [innerHTML]="truncarTexto(nota.contenido, 100)"></p>
                  <div class="d-flex justify-content-between align-items-center text-muted small">
                    <span>
                      <i class="fas fa-user-md me-1"></i>
                      {{ nota.medicoTratante }}
                    </span>
                    <span>
                      <i class="fas fa-calendar me-1"></i>
                      {{ formatearFecha(nota.fechaConsulta) }}
                    </span>
                  </div>
                  <div class="mt-2" *ngIf="nota.centroMedico">
                    <small class="text-muted">
                      <i class="fas fa-hospital me-1"></i>
                      {{ nota.centroMedico }}
                    </small>
                  </div>
                </div>
                <div class="card-footer bg-transparent">
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group btn-group-sm">
                      <button 
                        class="btn btn-outline-primary"
                        (click)="verDetalle(nota.id!)">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button 
                        class="btn btn-outline-secondary"
                        (click)="editarNota(nota.id!)">
                        <i class="fas fa-edit"></i>
                      </button>
                    </div>
                    <span class="badge" [ngClass]="!nota.archivado ? 'bg-success' : 'bg-secondary'">
                      {{ !nota.archivado ? 'Activa' : 'Archivada' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Vista de tabla -->
          <div class="card" *ngIf="vistaActual === 'tabla'">
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover mb-0">
                  <thead class="table-light">
                    <tr>
                      <th>Título</th>
                      <th>Tipo</th>
                      <th>Prioridad</th>
                      <th>Médico</th>
                      <th>Fecha</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let nota of notasFiltradas" [ngClass]="obtenerClaseFilaTabla(nota)">
                      <td>
                        <div>
                          <strong class="text-truncate d-block" style="max-width: 200px;" [title]="nota.titulo">
                            {{ nota.titulo }}
                          </strong>
                          <small class="text-muted">{{ truncarTexto(nota.contenido, 50) }}</small>
                        </div>
                      </td>
                      <td>
                        <span class="badge" [ngClass]="obtenerClaseTipo(nota.tipoNota)">
                          <i class="fas" [ngClass]="obtenerIconoTipo(nota.tipoNota)"></i>
                          {{ obtenerTextoTipo(nota.tipoNota) }}
                        </span>
                      </td>
                      <td>
                        <span class="badge" [ngClass]="obtenerClasePrioridad(nota.prioridad)">
                          {{ obtenerTextoPrioridad(nota.prioridad) }}
                        </span>
                      </td>
                      <td>{{ nota.medicoTratante }}</td>
                      <td>{{ formatearFecha(nota.fechaConsulta) }}</td>
                      <td>
                        <span class="badge" [ngClass]="!nota.archivado ? 'bg-success' : 'bg-secondary'">
                          {{ !nota.archivado ? 'Activa' : 'Archivada' }}
                        </span>
                      </td>
                      <td>
                        <div class="btn-group btn-group-sm">
                          <button 
                            class="btn btn-outline-primary"
                            (click)="verDetalle(nota.id!)"
                            title="Ver detalle">
                            <i class="fas fa-eye"></i>
                          </button>
                          <button 
                            class="btn btn-outline-secondary"
                            (click)="editarNota(nota.id!)"
                            title="Editar">
                            <i class="fas fa-edit"></i>
                          </button>
                          <button 
                            class="btn btn-outline-warning"
                            (click)="toggleArchivar(nota)"
                            [title]="!nota.archivado ? 'Archivar' : 'Desarchivar'">
                            <i class="fas" [ngClass]="!nota.archivado ? 'fa-archive' : 'fa-box-open'"></i>
                          </button>
                          <button 
                            class="btn btn-outline-danger"
                            (click)="eliminarNota(nota)"
                            title="Eliminar">
                            <i class="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estado vacío -->
      <div class="text-center py-5" *ngIf="notasFiltradas.length === 0 && !cargando">
        <i class="fas fa-notes-medical fa-4x text-muted mb-3"></i>
        <h4 class="text-muted">{{ notas.length === 0 ? 'No hay notas médicas registradas' : 'No se encontraron notas con los filtros aplicados' }}</h4>
        <p class="text-muted mb-4">{{ notas.length === 0 ? 'Comience agregando su primera nota médica' : 'Intente ajustar los filtros de búsqueda' }}</p>
        <button 
          class="btn btn-primary"
          (click)="notas.length === 0 ? nuevaNota() : limpiarFiltros()">
          <i class="fas" [ngClass]="notas.length === 0 ? 'fa-plus' : 'fa-times'"></i>
          {{ notas.length === 0 ? 'Agregar primera nota' : 'Limpiar filtros' }}
        </button>
      </div>

      <!-- Loading state -->
      <div class="d-flex justify-content-center py-5" *ngIf="cargando">
        <div class="text-center">
          <div class="spinner-border text-primary mb-3"></div>
          <p>Cargando notas médicas...</p>
        </div>
      </div>

      <!-- Controles de vista -->
      <div class="position-fixed bottom-0 end-0 p-3">
        <div class="btn-group-vertical">
          <button 
            class="btn btn-outline-secondary btn-sm"
            [class.active]="vistaActual === 'tarjetas'"
            (click)="cambiarVista('tarjetas')"
            title="Vista de tarjetas">
            <i class="fas fa-th-large"></i>
          </button>
          <button 
            class="btn btn-outline-secondary btn-sm"
            [class.active]="vistaActual === 'tabla'"
            (click)="cambiarVista('tabla')"
            title="Vista de tabla">
            <i class="fas fa-table"></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stat-card {
      border-radius: 10px;
      border: none;
      transition: transform 0.2s;
    }
    
    .stat-card:hover {
      transform: translateY(-2px);
    }
    
    .nota-card {
      border-radius: 10px;
      border: none;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
    }
    
    .nota-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 20px rgba(0,0,0,0.15);
    }
    
    .nota-card.prioridad-alta {
      border-left: 4px solid #dc3545;
    }
    
    .nota-card.prioridad-urgente {
      border-left: 4px solid #dc3545;
      background: linear-gradient(135deg, #fff5f5 0%, #ffffff 100%);
    }
    
    .card-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 10px 10px 0 0;
      border: none;
    }
    
    .badge {
      font-size: 0.75em;
      padding: 0.4em 0.6em;
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
    
    .table th {
      border-top: none;
      font-weight: 600;
      color: #495057;
    }
    
    .table-hover tbody tr:hover {
      background-color: #f8f9fa;
    }
    
    .fila-prioridad-alta {
      background-color: #fff5f5;
    }
    
    .fila-prioridad-urgente {
      background-color: #ffebee;
      border-left: 3px solid #dc3545;
    }
    
    .position-fixed .btn-group-vertical .btn {
      margin-bottom: 2px;
    }
    
    .opacity-75 {
      opacity: 0.75;
    }
    
    .text-truncate {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    @media (max-width: 768px) {
      .position-fixed {
        position: relative !important;
        bottom: auto !important;
        end: auto !important;
        padding: 1rem 0 !important;
      }
      
      .btn-group-vertical {
        flex-direction: row;
        justify-content: center;
      }
    }
  `]
})
export class ListaNotasMedicasComponent implements OnInit {

  notas: NotaMedica[] = [];
  notasFiltradas: NotaMedica[] = [];
  estadisticas?: EstadisticasNotaMedica;
  cargando = false;
  vistaActual: 'tarjetas' | 'tabla' = 'tarjetas';

  filtros = {
    busqueda: '',
    estado: '',
    tipo: '',
    prioridad: '',
    medico: ''
  };

  constructor(
    private notaMedicaService: NotaMedicaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarNotas();
    this.cargarEstadisticas();
  }

  cargarNotas(): void {
    this.cargando = true;
    this.notaMedicaService.obtenerListaNotas().subscribe({
      next: (notas: NotaMedica[]) => {
        this.notas = notas;
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: (error: any) => {
        console.error('Error al cargar notas:', error);
        this.cargando = false;
      }
    });
  }

  cargarEstadisticas(): void {
    this.notaMedicaService.obtenerEstadisticas().subscribe({
      next: (estadisticas) => {
        this.estadisticas = estadisticas;
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
      }
    });
  }

  aplicarFiltros(): void {
    this.notasFiltradas = this.notas.filter(nota => {
      const cumpleBusqueda = !this.filtros.busqueda || 
        nota.titulo.toLowerCase().includes(this.filtros.busqueda.toLowerCase()) ||
        nota.contenido.toLowerCase().includes(this.filtros.busqueda.toLowerCase());
      
      const cumpleEstado = !this.filtros.estado || 
        (this.filtros.estado === 'activa' && !nota.archivado) ||
        (this.filtros.estado === 'archivada' && nota.archivado);
      
      const cumpleTipo = !this.filtros.tipo || nota.tipoNota === this.filtros.tipo;
      
      const cumplePrioridad = !this.filtros.prioridad || nota.prioridad === this.filtros.prioridad;
      
      const cumpleMedico = !this.filtros.medico || 
        nota.medicoTratante.toLowerCase().includes(this.filtros.medico.toLowerCase());
      
      return cumpleBusqueda && cumpleEstado && cumpleTipo && cumplePrioridad && cumpleMedico;
    });
  }

  limpiarFiltros(): void {
    this.filtros = {
      busqueda: '',
      estado: '',
      tipo: '',
      prioridad: '',
      medico: ''
    };
    this.aplicarFiltros();
  }

  cambiarVista(vista: 'tarjetas' | 'tabla'): void {
    this.vistaActual = vista;
  }

  nuevaNota(): void {
    this.router.navigate(['/notas-medicas/nueva']);
  }

  verDetalle(id: number): void {
    this.router.navigate(['/notas-medicas/detalle', id]);
  }

  editarNota(id: number): void {
    this.router.navigate(['/notas-medicas/editar', id]);
  }

  toggleArchivar(nota: NotaMedica): void {
    if (!nota.id) return;
    
    const operacion = !nota.archivado 
      ? this.notaMedicaService.archivarNotaMedica(nota.id)
      : this.notaMedicaService.desarchivarNotaMedica(nota.id);
    
    operacion.subscribe({
      next: () => {
        nota.archivado = !nota.archivado;
        this.cargarEstadisticas();
      },
      error: (error) => {
        console.error('Error al cambiar estado de nota:', error);
      }
    });
  }

  eliminarNota(nota: NotaMedica): void {
    if (!nota.id) return;
    
    if (confirm(`¿Está seguro de que desea eliminar la nota "${nota.titulo}"?`)) {
      this.notaMedicaService.eliminarNotaMedica(nota.id).subscribe({
        next: () => {
          this.cargarNotas();
          this.cargarEstadisticas();
        },
        error: (error) => {
          console.error('Error al eliminar nota:', error);
        }
      });
    }
  }

  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  truncarTexto(texto: string, limite: number): string {
    if (texto.length <= limite) return texto;
    return texto.substring(0, limite) + '...';
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
      'LABORATORIO': 'bg-secondary',
      'RADIOLOGIA': 'bg-dark',
      'ESPECIALISTA': 'bg-success',
      'URGENCIA': 'bg-danger',
      'HOSPITALIZACION': 'bg-warning text-dark',
      'CIRUGIA': 'bg-info',
      'VACUNACION': 'bg-success',
      'REVISION': 'bg-info',
      'OTRO': 'bg-light text-dark'
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

  obtenerClaseCard(nota: NotaMedica): string {
    if (nota.prioridad === 'URGENTE') {
      return 'prioridad-urgente';
    } else if (nota.prioridad === 'ALTA') {
      return 'prioridad-alta';
    }
    return '';
  }

  obtenerClaseFilaTabla(nota: NotaMedica): string {
    if (nota.prioridad === 'URGENTE') {
      return 'fila-prioridad-urgente';
    } else if (nota.prioridad === 'ALTA') {
      return 'fila-prioridad-alta';
    }
    return '';
  }
}