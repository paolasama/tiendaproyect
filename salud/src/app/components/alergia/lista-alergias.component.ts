import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlergiaService } from '../../services/alergia.service';
import { Alergia, TipoAlergia, SeveridadAlergia } from '../../models/alergia.model';

@Component({
  selector: 'app-lista-alergias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">
            <i class="fas fa-allergies me-2"></i>
            Gestión de Alergias
          </h2>
          <p class="text-muted mb-0">Administra las alergias y sensibilidades médicas</p>
        </div>
        <button 
          class="btn btn-primary"
          (click)="nuevaAlergia()">
          <i class="fas fa-plus me-1"></i>
          Nueva Alergia
        </button>
      </div>

      <!-- Filtros y búsqueda -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-3">
              <label class="form-label">Buscar alergia:</label>
              <div class="input-group">
                <span class="input-group-text">
                  <i class="fas fa-search"></i>
                </span>
                <input 
                  type="text" 
                  class="form-control"
                  [(ngModel)]="filtros.busqueda"
                  (input)="aplicarFiltros()"
                  placeholder="Nombre del alérgeno...">
              </div>
            </div>
            
            <div class="col-md-2">
              <label class="form-label">Estado:</label>
              <select 
                class="form-select"
                [(ngModel)]="filtros.estado"
                (change)="aplicarFiltros()">
                <option value="todos">Todos</option>
                <option value="activas">Activas</option>
                <option value="inactivas">Inactivas</option>
              </select>
            </div>
            
            <div class="col-md-2">
              <label class="form-label">Tipo:</label>
              <select 
                class="form-select"
                [(ngModel)]="filtros.tipo"
                (change)="aplicarFiltros()">
                <option value="">Todos los tipos</option>
                <option value="MEDICINAL">Medicinal</option>
                <option value="ALIMENTARIA">Alimentaria</option>
                <option value="AMBIENTAL">Ambiental</option>
                <option value="CONTACTO">Contacto</option>
                <option value="OTRA">Otra</option>
              </select>
            </div>
            
            <div class="col-md-2">
              <label class="form-label">Severidad:</label>
              <select 
                class="form-select"
                [(ngModel)]="filtros.severidad"
                (change)="aplicarFiltros()">
                <option value="">Todas</option>
                <option value="LEVE">Leve</option>
                <option value="MODERADA">Moderada</option>
                <option value="SEVERA">Severa</option>
                <option value="CRITICA">Crítica</option>
              </select>
            </div>
            
            <div class="col-md-3 d-flex align-items-end">
              <button 
                class="btn btn-outline-secondary me-2"
                (click)="limpiarFiltros()">
                <i class="fas fa-eraser me-1"></i>
                Limpiar
              </button>
              <button 
                class="btn btn-outline-info"
                (click)="exportarAlergias()">
                <i class="fas fa-download me-1"></i>
                Exportar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Estadísticas rápidas -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="card bg-primary text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h6 class="card-title">Total Alergias</h6>
                  <h3 class="mb-0">{{ estadisticas.total }}</h3>
                </div>
                <i class="fas fa-allergies fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-success text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h6 class="card-title">Activas</h6>
                  <h3 class="mb-0">{{ estadisticas.activas }}</h3>
                </div>
                <i class="fas fa-check-circle fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-danger text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h6 class="card-title">Críticas</h6>
                  <h3 class="mb-0">{{ estadisticas.criticas }}</h3>
                </div>
                <i class="fas fa-exclamation-triangle fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-warning text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h6 class="card-title">Severas</h6>
                  <h3 class="mb-0">{{ estadisticas.severas }}</h3>
                </div>
                <i class="fas fa-exclamation-circle fa-2x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de alergias -->
      <div class="card">
        <div class="card-header">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i class="fas fa-list me-2"></i>
              Lista de Alergias ({{ alergiasFiltradas.length }})
            </h5>
            <div class="btn-group btn-group-sm">
              <button 
                class="btn"
                [class.btn-primary]="vistaActual === 'tarjetas'"
                [class.btn-outline-primary]="vistaActual !== 'tarjetas'"
                (click)="cambiarVista('tarjetas')">
                <i class="fas fa-th-large"></i>
              </button>
              <button 
                class="btn"
                [class.btn-primary]="vistaActual === 'tabla'"
                [class.btn-outline-primary]="vistaActual !== 'tabla'"
                (click)="cambiarVista('tabla')">
                <i class="fas fa-table"></i>
              </button>
            </div>
          </div>
        </div>
        
        <div class="card-body" *ngIf="cargando">
          <div class="text-center py-5">
            <div class="spinner-border text-primary mb-3"></div>
            <p>Cargando alergias...</p>
          </div>
        </div>
        
        <!-- Vista de tarjetas -->
        <div class="card-body" *ngIf="!cargando && vistaActual === 'tarjetas'">
          <div class="row" *ngIf="alergiasFiltradas.length > 0; else noAlergias">
            <div class="col-md-6 col-lg-4 mb-3" *ngFor="let alergia of alergiasFiltradas">
              <div class="card h-100 alergia-card" [class.border-danger]="alergia.severidad === 'CRITICA'">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <h6 class="card-title mb-0">
                      <i class="fas" [ngClass]="obtenerIconoTipo(alergia.tipo)" [style.color]="obtenerColorSeveridad(alergia.severidad)"></i>
                      {{ alergia.alergeno }}
                    </h6>
                    <span class="badge" [ngClass]="obtenerClaseSeveridad(alergia.severidad)">
                      {{ obtenerTextoSeveridad(alergia.severidad) }}
                    </span>
                  </div>
                  
                  <div class="mb-2">
                    <small class="text-muted">
                      <i class="fas fa-tag me-1"></i>
                      {{ obtenerTextoTipo(alergia.tipo) }}
                    </small>
                  </div>
                  
                  <p class="card-text small" *ngIf="alergia.sintomas">
                    <strong>Síntomas:</strong> {{ alergia.sintomas | slice:0:100 }}{{ alergia.sintomas.length > 100 ? '...' : '' }}
                  </p>
                  
                  <div class="d-flex justify-content-between align-items-center">
                    <small class="text-muted">
                      <i class="fas fa-calendar me-1"></i>
                      {{ formatearFecha(alergia.fechaDiagnostico) }}
                    </small>
                    <span class="badge" [ngClass]="alergia.activo ? 'bg-success' : 'bg-secondary'">
                      {{ alergia.activo ? 'Activa' : 'Inactiva' }}
                    </span>
                  </div>
                </div>
                
                <div class="card-footer bg-transparent">
                  <div class="btn-group w-100">
                    <button 
                      class="btn btn-outline-primary btn-sm"
                      (click)="verDetalle(alergia.id!)">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button 
                      class="btn btn-outline-secondary btn-sm"
                      (click)="editarAlergia(alergia.id!)">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button 
                      class="btn btn-sm"
                      [ngClass]="alergia.activo ? 'btn-outline-warning' : 'btn-outline-success'"
                      (click)="toggleEstadoAlergia(alergia)">
                      <i class="fas" [ngClass]="alergia.activo ? 'fa-pause' : 'fa-play'"></i>
                    </button>
                    <button 
                      class="btn btn-outline-danger btn-sm"
                      (click)="eliminarAlergia(alergia)">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Vista de tabla -->
        <div class="table-responsive" *ngIf="!cargando && vistaActual === 'tabla'">
          <table class="table table-hover" *ngIf="alergiasFiltradas.length > 0; else noAlergias">
            <thead class="table-light">
              <tr>
                <th>Alérgeno</th>
                <th>Tipo</th>
                <th>Severidad</th>
                <th>Síntomas</th>
                <th>Fecha Diagnóstico</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let alergia of alergiasFiltradas" [class.table-danger]="alergia.severidad === 'CRITICA'">
                <td>
                  <strong>{{ alergia.alergeno }}</strong>
                </td>
                <td>
                  <i class="fas" [ngClass]="obtenerIconoTipo(alergia.tipo)" [style.color]="obtenerColorSeveridad(alergia.severidad)"></i>
                  {{ obtenerTextoTipo(alergia.tipo) }}
                </td>
                <td>
                  <span class="badge" [ngClass]="obtenerClaseSeveridad(alergia.severidad)">
                    {{ obtenerTextoSeveridad(alergia.severidad) }}
                  </span>
                </td>
                <td>
                  <span *ngIf="alergia.sintomas" [title]="alergia.sintomas">
                    {{ alergia.sintomas | slice:0:50 }}{{ alergia.sintomas.length > 50 ? '...' : '' }}
                  </span>
                  <span *ngIf="!alergia.sintomas" class="text-muted">-</span>
                </td>
                <td>{{ formatearFecha(alergia.fechaDiagnostico) }}</td>
                <td>
                  <span class="badge" [ngClass]="alergia.activo ? 'bg-success' : 'bg-secondary'">
                    {{ alergia.activo ? 'Activa' : 'Inactiva' }}
                  </span>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button 
                      class="btn btn-outline-primary"
                      (click)="verDetalle(alergia.id!)"
                      title="Ver detalle">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button 
                      class="btn btn-outline-secondary"
                      (click)="editarAlergia(alergia.id!)"
                      title="Editar">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button 
                      class="btn"
                      [ngClass]="alergia.activo ? 'btn-outline-warning' : 'btn-outline-success'"
                      (click)="toggleEstadoAlergia(alergia)"
                      [title]="alergia.activo ? 'Desactivar' : 'Activar'">
                      <i class="fas" [ngClass]="alergia.activo ? 'fa-pause' : 'fa-play'"></i>
                    </button>
                    <button 
                      class="btn btn-outline-danger"
                      (click)="eliminarAlergia(alergia)"
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

    <!-- Template para cuando no hay alergias -->
    <ng-template #noAlergias>
      <div class="text-center py-5">
        <i class="fas fa-allergies fa-3x text-muted mb-3"></i>
        <h5>No se encontraron alergias</h5>
        <p class="text-muted">{{ alergias.length === 0 ? 'Aún no has registrado ninguna alergia.' : 'No hay alergias que coincidan con los filtros aplicados.' }}</p>
        <button 
          class="btn btn-primary"
          (click)="nuevaAlergia()"
          *ngIf="alergias.length === 0">
          <i class="fas fa-plus me-1"></i>
          Registrar primera alergia
        </button>
      </div>
    </ng-template>
  `,
  styles: [`
    .alergia-card {
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
    }
    
    .alergia-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    
    .card {
      border-radius: 10px;
      border: none;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .card-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 10px 10px 0 0;
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
      font-weight: 600;
      color: #495057;
      border-top: none;
    }
    
    .badge {
      font-size: 0.75em;
    }
    
    .opacity-75 {
      opacity: 0.75;
    }
    
    .border-danger {
      border-color: #dc3545 !important;
      border-width: 2px !important;
    }
    
    .table-danger {
      background-color: rgba(220, 53, 69, 0.1);
    }
  `]
})
export class ListaAlergiasComponent implements OnInit {

  alergias: Alergia[] = [];
  alergiasFiltradas: Alergia[] = [];
  cargando = true;
  vistaActual: 'tarjetas' | 'tabla' = 'tarjetas';
  
  filtros = {
    busqueda: '',
    estado: 'todos',
    tipo: '',
    severidad: ''
  };
  
  estadisticas = {
    total: 0,
    activas: 0,
    criticas: 0,
    severas: 0
  };

  constructor(
    private alergiaService: AlergiaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarAlergias();
  }

  cargarAlergias(): void {
    this.cargando = true;
    this.alergiaService.obtenerListaAlergias().subscribe({
      next: (alergias: Alergia[]) => {
        this.alergias = alergias;
        this.alergiasFiltradas = [...alergias];
        this.calcularEstadisticas();
        this.cargando = false;
      },
      error: (error: any) => {
        console.error('Error al cargar alergias:', error);
        this.cargando = false;
      }
    });
  }

  aplicarFiltros(): void {
    let resultado = [...this.alergias];
    
    // Filtro por búsqueda
    if (this.filtros.busqueda.trim()) {
      const busqueda = this.filtros.busqueda.toLowerCase();
      resultado = resultado.filter(alergia => 
        alergia.alergeno.toLowerCase().includes(busqueda) ||
        alergia.sintomas?.toLowerCase().includes(busqueda)
      );
    }
    
    // Filtro por estado
    if (this.filtros.estado !== 'todos') {
      const activo = this.filtros.estado === 'activas';
      resultado = resultado.filter(alergia => alergia.activo === activo);
    }
    
    // Filtro por tipo
    if (this.filtros.tipo) {
      resultado = resultado.filter(alergia => alergia.tipo === this.filtros.tipo);
    }
    
    // Filtro por severidad
    if (this.filtros.severidad) {
      resultado = resultado.filter(alergia => alergia.severidad === this.filtros.severidad);
    }
    
    this.alergiasFiltradas = resultado;
  }

  limpiarFiltros(): void {
    this.filtros = {
      busqueda: '',
      estado: 'todos',
      tipo: '',
      severidad: ''
    };
    this.aplicarFiltros();
  }

  calcularEstadisticas(): void {
    this.estadisticas = {
      total: this.alergias.length,
      activas: this.alergias.filter(a => a.activo).length,
      criticas: this.alergias.filter(a => a.severidad === 'CRITICA').length,
      severas: this.alergias.filter(a => a.severidad === 'SEVERA').length
    };
  }

  cambiarVista(vista: 'tarjetas' | 'tabla'): void {
    this.vistaActual = vista;
  }

  nuevaAlergia(): void {
    this.router.navigate(['/alergias/nueva']);
  }

  verDetalle(id: number): void {
    this.router.navigate(['/alergias/detalle', id]);
  }

  editarAlergia(id: number): void {
    this.router.navigate(['/alergias/editar', id]);
  }

  toggleEstadoAlergia(alergia: Alergia): void {
    if (!alergia.id) return;
    
    const operacion = alergia.activo 
      ? this.alergiaService.desactivarAlergia(alergia.id)
      : this.alergiaService.activarAlergia(alergia.id);
    
    operacion.subscribe({
      next: () => {
        alergia.activo = !alergia.activo;
        this.calcularEstadisticas();
      },
      error: (error) => {
        console.error('Error al cambiar estado de alergia:', error);
      }
    });
  }

  eliminarAlergia(alergia: Alergia): void {
    if (!alergia.id) return;
    
    if (confirm(`¿Está seguro de que desea eliminar la alergia "${alergia.alergeno}"?`)) {
      this.alergiaService.eliminarAlergia(alergia.id).subscribe({
        next: () => {
          this.cargarAlergias();
        },
        error: (error) => {
          console.error('Error al eliminar alergia:', error);
        }
      });
    }
  }

  exportarAlergias(): void {
    // Implementar exportación a CSV o PDF
    console.log('Exportar alergias');
  }

  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-ES');
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
}