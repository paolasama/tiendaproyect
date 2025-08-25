import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { MedicacionService } from '../../services/medicacion.service';
import { AlergiaService } from '../../services/alergia.service';
import { NotaMedicaService } from '../../services/nota-medica.service';
import { ResumenDashboard, AlertasMedicas } from '../../models/dashboard.model';
import { Medicacion } from '../../models/medicacion.model';
import { Alergia } from '../../models/alergia.model';
import { NotaMedica, ProximaCita } from '../../models/nota-medica.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <!-- Header del Dashboard -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="dashboard-header">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h1 class="dashboard-title">
                  <i class="fas fa-heartbeat me-3"></i>
                  Dashboard de Salud
                </h1>
                <p class="dashboard-subtitle">{{ obtenerSaludo() }} - {{ fechaActual | date:'fullDate':'':'es-ES' }}</p>
              </div>
              <div class="dashboard-actions">
                <button class="btn btn-outline-primary me-2" (click)="actualizarDatos()">
                  <i class="fas fa-sync-alt me-1" [class.fa-spin]="cargando"></i>
                  Actualizar
                </button>
                <button class="btn btn-primary" (click)="navegarAConfiguracion()">
                  <i class="fas fa-cog me-1"></i>
                  Configuración
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Alertas Críticas -->
      <div class="row mb-4" *ngIf="alertas && tieneAlertasCriticas()">
        <div class="col-12">
          <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <div class="d-flex align-items-center">
              <i class="fas fa-exclamation-triangle fa-2x me-3"></i>
              <div class="flex-grow-1">
                <h5 class="alert-heading mb-1">¡Atención Requerida!</h5>
                <div class="row">
                  <div class="col-md-4" *ngIf="alertas.medicacionesVencidas > 0">
                    <strong>{{ alertas.medicacionesVencidas }}</strong> medicación(es) vencida(s)
                  </div>
                  <div class="col-md-4" *ngIf="alertas.alergiasCriticas > 0">
                    <strong>{{ alertas.alergiasCriticas }}</strong> alergia(s) crítica(s)
                  </div>
                  <div class="col-md-4" *ngIf="alertas.citasUrgentes > 0">
                    <strong>{{ alertas.citasUrgentes }}</strong> cita(s) urgente(s)
                  </div>
                </div>
              </div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
          </div>
        </div>
      </div>

      <!-- Tarjetas de Resumen Rápido -->
      <div class="row mb-4" *ngIf="resumen">
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="card stats-card stats-medicacion">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h3 class="stats-number">{{ resumen.totalMedicaciones }}</h3>
                  <p class="stats-label">Medicaciones</p>
                  <small class="stats-detail">
                    {{ resumen.medicacionesActivas }} activas
                  </small>
                </div>
                <div class="stats-icon">
                  <i class="fas fa-pills"></i>
                </div>
              </div>
              <div class="stats-progress mt-2">
                <div class="progress">
                  <div class="progress-bar bg-primary" 
                       [style.width.%]="calcularPorcentajeActivas('medicaciones')"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-3 col-md-6 mb-3">
          <div class="card stats-card stats-alergias">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h3 class="stats-number">{{ resumen.totalAlergias }}</h3>
                  <p class="stats-label">Alergias</p>
                  <small class="stats-detail">
                    {{ resumen.alergiasCriticas }} críticas
                  </small>
                </div>
                <div class="stats-icon">
                  <i class="fas fa-exclamation-circle"></i>
                </div>
              </div>
              <div class="stats-progress mt-2">
                <div class="progress">
                  <div class="progress-bar bg-warning" 
                       [style.width.%]="calcularPorcentajeCriticas('alergias')"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-3 col-md-6 mb-3">
          <div class="card stats-card stats-notas">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h3 class="stats-number">{{ resumen.totalNotas }}</h3>
                  <p class="stats-label">Notas Médicas</p>
                  <small class="stats-detail">
                    {{ resumen.notasUrgentes }} urgentes
                  </small>
                </div>
                <div class="stats-icon">
                  <i class="fas fa-file-medical-alt"></i>
                </div>
              </div>
              <div class="stats-progress mt-2">
                <div class="progress">
                  <div class="progress-bar bg-info" 
                       [style.width.%]="calcularPorcentajeUrgentes('notas')"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-3 col-md-6 mb-3">
          <div class="card stats-card stats-citas">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h3 class="stats-number">{{ proximasCitas.length }}</h3>
                  <p class="stats-label">Próximas Citas</p>
                  <small class="stats-detail">
                    Esta semana
                  </small>
                </div>
                <div class="stats-icon">
                  <i class="fas fa-calendar-check"></i>
                </div>
              </div>
              <div class="stats-progress mt-2">
                <div class="progress">
                  <div class="progress-bar bg-success" 
                       [style.width.%]="calcularPorcentajeCitas()"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenido Principal -->
      <div class="row">
        <!-- Medicaciones Recientes -->
        <div class="col-lg-6 mb-4">
          <div class="card dashboard-card">
            <div class="card-header">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="mb-0">
                  <i class="fas fa-pills me-2"></i>
                  Medicaciones Activas
                </h5>
                <button class="btn btn-sm btn-outline-primary" (click)="navegarAMedicaciones()">
                  Ver todas
                </button>
              </div>
            </div>
            <div class="card-body">
              <div *ngIf="medicacionesRecientes.length === 0" class="text-center text-muted py-4">
                <i class="fas fa-pills fa-3x mb-3 opacity-50"></i>
                <p>No hay medicaciones activas</p>
                <button class="btn btn-primary btn-sm" (click)="navegarANuevaMedicacion()">
                  <i class="fas fa-plus me-1"></i>
                  Agregar medicación
                </button>
              </div>
              <div *ngFor="let medicacion of medicacionesRecientes" class="medicacion-item mb-3">
                <div class="d-flex justify-content-between align-items-start">
                  <div class="flex-grow-1">
                    <h6 class="mb-1">{{ medicacion.nombre }}</h6>
                    <p class="text-muted mb-1">{{ medicacion.dosis }} - {{ medicacion.frecuencia }}</p>
                    <small class="text-info">
                      <i class="fas fa-user-md me-1"></i>
                      {{ medicacion.medicoPrescriptor }}
                    </small>
                  </div>
                  <div class="text-end">
                    <span class="badge" [ngClass]="obtenerClaseEstadoMedicacion(medicacion)">
                      {{ obtenerTextoEstadoMedicacion(medicacion) }}
                    </span>
                    <div class="mt-1">
                      <small class="text-muted">
                        {{ calcularDiasRestantes(medicacion.fechaFin) }} días restantes
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Alergias Importantes -->
        <div class="col-lg-6 mb-4">
          <div class="card dashboard-card">
            <div class="card-header">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="mb-0">
                  <i class="fas fa-exclamation-triangle me-2"></i>
                  Alergias Importantes
                </h5>
                <button class="btn btn-sm btn-outline-warning" (click)="navegarAAlergias()">
                  Ver todas
                </button>
              </div>
            </div>
            <div class="card-body">
              <div *ngIf="alergiasImportantes.length === 0" class="text-center text-muted py-4">
                <i class="fas fa-shield-alt fa-3x mb-3 opacity-50"></i>
                <p>No hay alergias registradas</p>
                <button class="btn btn-warning btn-sm" (click)="navegarANuevaAlergia()">
                  <i class="fas fa-plus me-1"></i>
                  Registrar alergia
                </button>
              </div>
              <div *ngFor="let alergia of alergiasImportantes" class="alergia-item mb-3">
                <div class="d-flex justify-content-between align-items-start">
                  <div class="flex-grow-1">
                    <h6 class="mb-1">{{ alergia.alergeno }}</h6>
                    <p class="text-muted mb-1">{{ obtenerTextoTipoAlergia(alergia.tipo) }}</p>
                    <small class="text-warning">
                      <i class="fas fa-calendar me-1"></i>
                      {{ alergia.fechaDiagnostico | date:'shortDate' }}
                    </small>
                  </div>
                  <div class="text-end">
                    <span class="badge" [ngClass]="obtenerClaseSeveridad(alergia.severidad)">
                      {{ obtenerTextoSeveridad(alergia.severidad) }}
                    </span>
                    <div class="mt-1">
                      <i class="fas fa-info-circle text-info" 
                         [title]="alergia.sintomas"
                         style="cursor: help;"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Próximas Citas y Notas Recientes -->
      <div class="row">
        <!-- Próximas Citas -->
        <div class="col-lg-6 mb-4">
          <div class="card dashboard-card">
            <div class="card-header">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="mb-0">
                  <i class="fas fa-calendar-check me-2"></i>
                  Próximas Citas
                </h5>
                <button class="btn btn-sm btn-outline-success" (click)="navegarANotas()">
                  Ver calendario
                </button>
              </div>
            </div>
            <div class="card-body">
              <div *ngIf="proximasCitas.length === 0" class="text-center text-muted py-4">
                <i class="fas fa-calendar-times fa-3x mb-3 opacity-50"></i>
                <p>No hay citas programadas</p>
                <button class="btn btn-success btn-sm" (click)="navegarANuevaNota()">
                  <i class="fas fa-plus me-1"></i>
                  Programar cita
                </button>
              </div>
              <div *ngFor="let cita of proximasCitas" class="cita-item mb-3">
                <div class="d-flex justify-content-between align-items-start">
                  <div class="flex-grow-1">
                    <h6 class="mb-1">{{ cita.titulo }}</h6>
                    <p class="text-muted mb-1">{{ cita.medico }}</p>
                    <small class="text-success">
                      <i class="fas fa-clock me-1"></i>
                      {{ cita.fecha | date:'short':'':'es-ES' }}
                    </small>
                  </div>
                  <div class="text-end">
                    <span class="badge" [ngClass]="obtenerClaseTipoCita(cita.tipo)">
                      {{ cita.tipo }}
                    </span>
                    <div class="mt-1">
                      <small class="text-muted">
                        {{ calcularDiasHastaCita(cita.fecha) }}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Notas Recientes -->
        <div class="col-lg-6 mb-4">
          <div class="card dashboard-card">
            <div class="card-header">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="mb-0">
                  <i class="fas fa-file-medical-alt me-2"></i>
                  Notas Recientes
                </h5>
                <button class="btn btn-sm btn-outline-info" (click)="navegarANotas()">
                  Ver todas
                </button>
              </div>
            </div>
            <div class="card-body">
              <div *ngIf="notasRecientes.length === 0" class="text-center text-muted py-4">
                <i class="fas fa-file-medical fa-3x mb-3 opacity-50"></i>
                <p>No hay notas médicas</p>
                <button class="btn btn-info btn-sm" (click)="navegarANuevaNota()">
                  <i class="fas fa-plus me-1"></i>
                  Crear nota
                </button>
              </div>
              <div *ngFor="let nota of notasRecientes" class="nota-item mb-3">
                <div class="d-flex justify-content-between align-items-start">
                  <div class="flex-grow-1">
                    <h6 class="mb-1">{{ nota.titulo }}</h6>
                    <p class="text-muted mb-1">{{ nota.medicoTratante }}</p>
                    <small class="text-info">
                      <i class="fas fa-calendar me-1"></i>
                      {{ nota.fechaConsulta | date:'shortDate' }}
                    </small>
                  </div>
                  <div class="text-end">
                    <span class="badge" [ngClass]="obtenerClasePrioridadNota(nota.prioridad)">
                      {{ obtenerTextoPrioridadNota(nota.prioridad) }}
                    </span>
                    <div class="mt-1">
                      <span class="badge bg-light text-dark">
                        {{ obtenerTextoTipoNota(nota.tipo) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estado de Salud General -->
      <div class="row">
        <div class="col-12">
          <div class="card dashboard-card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-heartbeat me-2"></i>
                Estado de Salud General
              </h5>
            </div>
            <div class="card-body">
              <div class="row text-center">
                <div class="col-md-3 mb-3">
                  <div class="health-indicator">
                    <div class="health-icon" [ngClass]="obtenerClaseIndicadorMedicacion()">
                      <i class="fas fa-pills fa-2x"></i>
                    </div>
                    <h6 class="mt-2">Medicación</h6>
                    <p class="text-muted">{{ obtenerEstadoMedicacion() }}</p>
                  </div>
                </div>
                <div class="col-md-3 mb-3">
                  <div class="health-indicator">
                    <div class="health-icon" [ngClass]="obtenerClaseIndicadorAlergias()">
                      <i class="fas fa-shield-alt fa-2x"></i>
                    </div>
                    <h6 class="mt-2">Alergias</h6>
                    <p class="text-muted">{{ obtenerEstadoAlergias() }}</p>
                  </div>
                </div>
                <div class="col-md-3 mb-3">
                  <div class="health-indicator">
                    <div class="health-icon" [ngClass]="obtenerClaseIndicadorCitas()">
                      <i class="fas fa-calendar-check fa-2x"></i>
                    </div>
                    <h6 class="mt-2">Citas</h6>
                    <p class="text-muted">{{ obtenerEstadoCitas() }}</p>
                  </div>
                </div>
                <div class="col-md-3 mb-3">
                  <div class="health-indicator">
                    <div class="health-icon" [ngClass]="obtenerClaseIndicadorGeneral()">
                      <i class="fas fa-heart fa-2x"></i>
                    </div>
                    <h6 class="mt-2">General</h6>
                    <p class="text-muted">{{ obtenerEstadoGeneral() }}</p>
                  </div>
                </div>
              </div>
              <div class="mt-4 text-center">
                <div class="alert" [ngClass]="obtenerClaseAlertaGeneral()" role="alert">
                  <h6 class="alert-heading">{{ obtenerTituloEstadoGeneral() }}</h6>
                  <p class="mb-0">{{ obtenerMensajeEstadoGeneral() }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div class="d-flex justify-content-center align-items-center" style="height: 50vh;" *ngIf="cargando">
      <div class="text-center">
        <div class="spinner-border text-primary mb-3" style="width: 3rem; height: 3rem;"></div>
        <p>Cargando información del dashboard...</p>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      border-radius: 15px;
      margin-bottom: 1rem;
    }
    
    .dashboard-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    
    .dashboard-subtitle {
      font-size: 1.1rem;
      opacity: 0.9;
      margin-bottom: 0;
    }
    
    .stats-card {
      border: none;
      border-radius: 15px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      overflow: hidden;
      position: relative;
    }
    
    .stats-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 30px rgba(0,0,0,0.15);
    }
    
    .stats-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #667eea, #764ba2);
    }
    
    .stats-medicacion::before {
      background: linear-gradient(90deg, #4facfe, #00f2fe);
    }
    
    .stats-alergias::before {
      background: linear-gradient(90deg, #f093fb, #f5576c);
    }
    
    .stats-notas::before {
      background: linear-gradient(90deg, #4facfe, #00f2fe);
    }
    
    .stats-citas::before {
      background: linear-gradient(90deg, #43e97b, #38f9d7);
    }
    
    .stats-number {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0;
      color: #2c3e50;
    }
    
    .stats-label {
      font-size: 1rem;
      color: #7f8c8d;
      margin-bottom: 0.25rem;
      font-weight: 500;
    }
    
    .stats-detail {
      color: #95a5a6;
      font-size: 0.85rem;
    }
    
    .stats-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      font-size: 1.5rem;
    }
    
    .stats-progress .progress {
      height: 4px;
      border-radius: 2px;
      background-color: #ecf0f1;
    }
    
    .dashboard-card {
      border: none;
      border-radius: 15px;
      box-shadow: 0 2px 15px rgba(0,0,0,0.08);
      transition: box-shadow 0.3s ease;
    }
    
    .dashboard-card:hover {
      box-shadow: 0 4px 25px rgba(0,0,0,0.12);
    }
    
    .dashboard-card .card-header {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border-bottom: 1px solid #dee2e6;
      border-radius: 15px 15px 0 0;
      padding: 1.25rem;
    }
    
    .medicacion-item, .alergia-item, .cita-item, .nota-item {
      padding: 1rem;
      border: 1px solid #e9ecef;
      border-radius: 10px;
      background: #f8f9fa;
      transition: background-color 0.3s ease;
    }
    
    .medicacion-item:hover, .alergia-item:hover, .cita-item:hover, .nota-item:hover {
      background: #e9ecef;
    }
    
    .health-indicator {
      padding: 1rem;
    }
    
    .health-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      color: white;
    }
    
    .health-icon.success {
      background: linear-gradient(135deg, #43e97b, #38f9d7);
    }
    
    .health-icon.warning {
      background: linear-gradient(135deg, #fa709a, #fee140);
    }
    
    .health-icon.danger {
      background: linear-gradient(135deg, #ff6b6b, #ee5a24);
    }
    
    .health-icon.info {
      background: linear-gradient(135deg, #4facfe, #00f2fe);
    }
    
    .badge {
      font-size: 0.8rem;
      padding: 0.4rem 0.6rem;
    }
    
    .btn {
      border-radius: 8px;
      font-weight: 500;
      transition: all 0.3s ease;
    }
    
    .btn:hover {
      transform: translateY(-1px);
    }
    
    .alert {
      border-radius: 10px;
      border: none;
    }
    
    .opacity-50 {
      opacity: 0.5;
    }
    
    @media (max-width: 768px) {
      .dashboard-title {
        font-size: 2rem;
      }
      
      .dashboard-header {
        padding: 1.5rem;
      }
      
      .stats-number {
        font-size: 2rem;
      }
      
      .dashboard-actions {
        flex-direction: column;
        gap: 0.5rem;
      }
      
      .dashboard-actions .btn {
        width: 100%;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {

  resumen?: ResumenDashboard;
  alertas?: AlertasMedicas;
  medicacionesRecientes: Medicacion[] = [];
  alergiasImportantes: Alergia[] = [];
  notasRecientes: NotaMedica[] = [];
  proximasCitas: ProximaCita[] = [];
  fechaActual = new Date();
  cargando = true;

  constructor(
    private dashboardService: DashboardService,
    private medicacionService: MedicacionService,
    private alergiaService: AlergiaService,
    private notaMedicaService: NotaMedicaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarDatosDashboard();
  }

  cargarDatosDashboard(): void {
    this.cargando = true;
    
    // Cargar resumen general
    this.dashboardService.obtenerResumenDashboard().subscribe({
      next: (resumen) => {
        this.resumen = resumen;
      },
      error: (error) => {
        console.error('Error al cargar resumen:', error);
      }
    });

    // Cargar alertas
    this.dashboardService.obtenerAlertasMedicas().subscribe({
      next: (alertas) => {
        this.alertas = alertas;
      },
      error: (error) => {
        console.error('Error al cargar alertas:', error);
      }
    });

    // Cargar medicaciones activas
    this.medicacionService.obtenerMedicacionesActivas().subscribe({
      next: (medicaciones) => {
        this.medicacionesRecientes = medicaciones.slice(0, 5);
      },
      error: (error) => {
        console.error('Error al cargar medicaciones:', error);
      }
    });

    // Cargar alergias críticas
    this.alergiaService.obtenerAlergiasCriticas().subscribe({
      next: (alergias) => {
        this.alergiasImportantes = alergias.slice(0, 5);
      },
      error: (error) => {
        console.error('Error al cargar alergias:', error);
      }
    });

    // Cargar notas recientes
    this.notaMedicaService.obtenerNotasActivas().subscribe({
      next: (notas) => {
        this.notasRecientes = notas.slice(0, 5);
      },
      error: (error) => {
        console.error('Error al cargar notas:', error);
      }
    });

    // Cargar próximas citas
    this.notaMedicaService.obtenerProximasCitas().subscribe({
      next: (citas) => {
        this.proximasCitas = citas.slice(0, 5);
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar citas:', error);
        this.cargando = false;
      }
    });
  }

  actualizarDatos(): void {
    this.cargarDatosDashboard();
  }

  obtenerSaludo(): string {
    const hora = new Date().getHours();
    if (hora < 12) {
      return 'Buenos días';
    } else if (hora < 18) {
      return 'Buenas tardes';
    } else {
      return 'Buenas noches';
    }
  }

  tieneAlertasCriticas(): boolean {
    return this.alertas ? 
      (this.alertas.medicacionesVencidas > 0 || 
       this.alertas.alergiasCriticas > 0 || 
       this.alertas.citasUrgentes > 0) : false;
  }

  calcularPorcentajeActivas(tipo: string): number {
    if (!this.resumen) return 0;
    
    switch (tipo) {
      case 'medicaciones':
        return this.resumen.totalMedicaciones > 0 ? 
          (this.resumen.medicacionesActivas / this.resumen.totalMedicaciones) * 100 : 0;
      default:
        return 0;
    }
  }

  calcularPorcentajeCriticas(tipo: string): number {
    if (!this.resumen) return 0;
    
    switch (tipo) {
      case 'alergias':
        return this.resumen.totalAlergias > 0 ? 
          (this.resumen.alergiasCriticas / this.resumen.totalAlergias) * 100 : 0;
      default:
        return 0;
    }
  }

  calcularPorcentajeUrgentes(tipo: string): number {
    if (!this.resumen) return 0;
    
    switch (tipo) {
      case 'notas':
        return this.resumen.totalNotas > 0 ? 
          (this.resumen.notasUrgentes / this.resumen.totalNotas) * 100 : 0;
      default:
        return 0;
    }
  }

  calcularPorcentajeCitas(): number {
    return this.proximasCitas.length > 0 ? 75 : 0; // Simulado
  }

  calcularDiasRestantes(fechaFin: Date): number {
    const hoy = new Date();
    const fin = new Date(fechaFin);
    const diferencia = fin.getTime() - hoy.getTime();
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  }

  calcularDiasHastaCita(fecha: Date): string {
    const hoy = new Date();
    const cita = new Date(fecha);
    const diferenciaDias = Math.ceil((cita.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diferenciaDias === 0) {
      return 'Hoy';
    } else if (diferenciaDias === 1) {
      return 'Mañana';
    } else if (diferenciaDias > 0) {
      return `En ${diferenciaDias} días`;
    } else {
      return 'Vencida';
    }
  }

  obtenerClaseEstadoMedicacion(medicacion: Medicacion): string {
    const diasRestantes = this.calcularDiasRestantes(medicacion.fechaFin);
    if (diasRestantes <= 0) return 'bg-danger';
    if (diasRestantes <= 7) return 'bg-warning';
    return 'bg-success';
  }

  obtenerTextoEstadoMedicacion(medicacion: Medicacion): string {
    const diasRestantes = this.calcularDiasRestantes(medicacion.fechaFin);
    if (diasRestantes <= 0) return 'Vencida';
    if (diasRestantes <= 7) return 'Por vencer';
    return 'Activa';
  }

  obtenerTextoTipoAlergia(tipo: string): string {
    const tipos: { [key: string]: string } = {
      'ALIMENTARIA': 'Alimentaria',
      'MEDICAMENTOSA': 'Medicamentosa',
      'AMBIENTAL': 'Ambiental',
      'CONTACTO': 'Contacto',
      'OTRA': 'Otra'
    };
    return tipos[tipo] || tipo;
  }

  obtenerClaseSeveridad(severidad: string): string {
    const clases: { [key: string]: string } = {
      'LEVE': 'bg-success',
      'MODERADA': 'bg-warning',
      'SEVERA': 'bg-danger',
      'CRITICA': 'bg-dark'
    };
    return clases[severidad] || 'bg-secondary';
  }

  obtenerTextoSeveridad(severidad: string): string {
    const textos: { [key: string]: string } = {
      'LEVE': 'Leve',
      'MODERADA': 'Moderada',
      'SEVERA': 'Severa',
      'CRITICA': 'Crítica'
    };
    return textos[severidad] || severidad;
  }

  obtenerClaseTipoCita(tipo: string): string {
    const clases: { [key: string]: string } = {
      'CONSULTA': 'bg-primary',
      'SEGUIMIENTO': 'bg-info',
      'EMERGENCIA': 'bg-danger',
      'LABORATORIO': 'bg-secondary'
    };
    return clases[tipo] || 'bg-secondary';
  }

  obtenerClasePrioridadNota(prioridad: string): string {
    const clases: { [key: string]: string } = {
      'BAJA': 'bg-success',
      'MEDIA': 'bg-warning',
      'ALTA': 'bg-orange',
      'URGENTE': 'bg-danger'
    };
    return clases[prioridad] || 'bg-secondary';
  }

  obtenerTextoPrioridadNota(prioridad: string): string {
    const textos: { [key: string]: string } = {
      'BAJA': 'Baja',
      'MEDIA': 'Media',
      'ALTA': 'Alta',
      'URGENTE': 'Urgente'
    };
    return textos[prioridad] || prioridad;
  }

  obtenerTextoTipoNota(tipo: string): string {
    const tipos: { [key: string]: string } = {
      'CONSULTA': 'Consulta',
      'DIAGNOSTICO': 'Diagnóstico',
      'TRATAMIENTO': 'Tratamiento',
      'SEGUIMIENTO': 'Seguimiento',
      'EMERGENCIA': 'Emergencia',
      'LABORATORIO': 'Laboratorio',
      'IMAGEN': 'Imagen',
      'OTRO': 'Otro'
    };
    return tipos[tipo] || tipo;
  }

  // Indicadores de salud
  obtenerClaseIndicadorMedicacion(): string {
    if (!this.resumen) return 'info';
    
    const porcentajeActivas = this.calcularPorcentajeActivas('medicaciones');
    if (porcentajeActivas >= 80) return 'success';
    if (porcentajeActivas >= 60) return 'warning';
    return 'danger';
  }

  obtenerEstadoMedicacion(): string {
    if (!this.resumen) return 'Cargando...';
    
    const porcentajeActivas = this.calcularPorcentajeActivas('medicaciones');
    if (porcentajeActivas >= 80) return 'Excelente adherencia';
    if (porcentajeActivas >= 60) return 'Buena adherencia';
    return 'Requiere atención';
  }

  obtenerClaseIndicadorAlergias(): string {
    if (!this.resumen) return 'info';
    
    if (this.resumen.alergiasCriticas === 0) return 'success';
    if (this.resumen.alergiasCriticas <= 2) return 'warning';
    return 'danger';
  }

  obtenerEstadoAlergias(): string {
    if (!this.resumen) return 'Cargando...';
    
    if (this.resumen.alergiasCriticas === 0) return 'Sin alergias críticas';
    if (this.resumen.alergiasCriticas <= 2) return 'Alergias controladas';
    return 'Requiere precaución';
  }

  obtenerClaseIndicadorCitas(): string {
    if (this.proximasCitas.length === 0) return 'warning';
    if (this.proximasCitas.length <= 3) return 'success';
    return 'info';
  }

  obtenerEstadoCitas(): string {
    if (this.proximasCitas.length === 0) return 'Sin citas programadas';
    if (this.proximasCitas.length <= 3) return 'Agenda organizada';
    return 'Agenda ocupada';
  }

  obtenerClaseIndicadorGeneral(): string {
    if (!this.resumen || !this.alertas) return 'info';
    
    const alertasCriticas = this.alertas.medicacionesVencidas + 
                           this.alertas.alergiasCriticas + 
                           this.alertas.citasUrgentes;
    
    if (alertasCriticas === 0) return 'success';
    if (alertasCriticas <= 2) return 'warning';
    return 'danger';
  }

  obtenerEstadoGeneral(): string {
    if (!this.resumen || !this.alertas) return 'Evaluando...';
    
    const alertasCriticas = this.alertas.medicacionesVencidas + 
                           this.alertas.alergiasCriticas + 
                           this.alertas.citasUrgentes;
    
    if (alertasCriticas === 0) return 'Estado óptimo';
    if (alertasCriticas <= 2) return 'Estado bueno';
    return 'Requiere atención';
  }

  obtenerClaseAlertaGeneral(): string {
    const clase = this.obtenerClaseIndicadorGeneral();
    switch (clase) {
      case 'success': return 'alert-success';
      case 'warning': return 'alert-warning';
      case 'danger': return 'alert-danger';
      default: return 'alert-info';
    }
  }

  obtenerTituloEstadoGeneral(): string {
    const clase = this.obtenerClaseIndicadorGeneral();
    switch (clase) {
      case 'success': return '¡Excelente estado de salud!';
      case 'warning': return 'Estado de salud bueno';
      case 'danger': return 'Atención requerida';
      default: return 'Evaluando estado de salud';
    }
  }

  obtenerMensajeEstadoGeneral(): string {
    const clase = this.obtenerClaseIndicadorGeneral();
    switch (clase) {
      case 'success': 
        return 'Su estado de salud es óptimo. Continúe con sus rutinas de cuidado.';
      case 'warning': 
        return 'Su estado de salud es bueno, pero hay algunos aspectos que requieren atención.';
      case 'danger': 
        return 'Hay aspectos importantes que requieren su atención inmediata. Revise las alertas.';
      default: 
        return 'Estamos evaluando su estado de salud general...';
    }
  }

  // Navegación
  navegarAMedicaciones(): void {
    this.router.navigate(['/medicaciones']);
  }

  navegarANuevaMedicacion(): void {
    this.router.navigate(['/medicaciones/nueva']);
  }

  navegarAAlergias(): void {
    this.router.navigate(['/alergias']);
  }

  navegarANuevaAlergia(): void {
    this.router.navigate(['/alergias/nueva']);
  }

  navegarANotas(): void {
    this.router.navigate(['/notas-medicas']);
  }

  navegarANuevaNota(): void {
    this.router.navigate(['/notas-medicas/nueva']);
  }

  navegarAConfiguracion(): void {
    this.router.navigate(['/configuracion']);
  }
}