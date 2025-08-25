import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <!-- Brand -->
        <a class="navbar-brand" routerLink="/dashboard">
          <i class="fas fa-heartbeat me-2"></i>
          <strong>Sistema de Salud</strong>
        </a>

        <!-- Mobile toggle button -->
        <button 
          class="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Navigation items -->
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <!-- Dashboard -->
            <li class="nav-item">
              <a class="nav-link" 
                 routerLink="/dashboard" 
                 routerLinkActive="active"
                 [routerLinkActiveOptions]="{exact: true}">
                <i class="fas fa-tachometer-alt me-1"></i>
                Dashboard
              </a>
            </li>

            <!-- Medicaciones -->
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" 
                 href="#" 
                 id="medicacionesDropdown" 
                 role="button" 
                 data-bs-toggle="dropdown" 
                 aria-expanded="false"
                 [class.active]="isRouteActive('/medicaciones')">
                <i class="fas fa-pills me-1"></i>
                Medicaciones
              </a>
              <ul class="dropdown-menu" aria-labelledby="medicacionesDropdown">
                <li>
                  <a class="dropdown-item" routerLink="/medicaciones">
                    <i class="fas fa-list me-2"></i>
                    Ver todas
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" routerLink="/medicaciones/nueva">
                    <i class="fas fa-plus me-2"></i>
                    Nueva medicación
                  </a>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <a class="dropdown-item" href="#" (click)="$event.preventDefault()">
                    <i class="fas fa-chart-line me-2"></i>
                    Estadísticas
                  </a>
                </li>
              </ul>
            </li>

            <!-- Alergias -->
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" 
                 href="#" 
                 id="alergiasDropdown" 
                 role="button" 
                 data-bs-toggle="dropdown" 
                 aria-expanded="false"
                 [class.active]="isRouteActive('/alergias')">
                <i class="fas fa-exclamation-triangle me-1"></i>
                Alergias
              </a>
              <ul class="dropdown-menu" aria-labelledby="alergiasDropdown">
                <li>
                  <a class="dropdown-item" routerLink="/alergias">
                    <i class="fas fa-list me-2"></i>
                    Ver todas
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" routerLink="/alergias/nueva">
                    <i class="fas fa-plus me-2"></i>
                    Nueva alergia
                  </a>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <a class="dropdown-item" href="#" (click)="$event.preventDefault()">
                    <i class="fas fa-shield-alt me-2"></i>
                    Alergias críticas
                  </a>
                </li>
              </ul>
            </li>

            <!-- Notas Médicas -->
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" 
                 href="#" 
                 id="notasDropdown" 
                 role="button" 
                 data-bs-toggle="dropdown" 
                 aria-expanded="false"
                 [class.active]="isRouteActive('/notas-medicas')">
                <i class="fas fa-file-medical-alt me-1"></i>
                Notas Médicas
              </a>
              <ul class="dropdown-menu" aria-labelledby="notasDropdown">
                <li>
                  <a class="dropdown-item" routerLink="/notas-medicas">
                    <i class="fas fa-list me-2"></i>
                    Ver todas
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" routerLink="/notas-medicas/nueva">
                    <i class="fas fa-plus me-2"></i>
                    Nueva nota
                  </a>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <a class="dropdown-item" href="#" (click)="$event.preventDefault()">
                    <i class="fas fa-calendar-check me-2"></i>
                    Próximas citas
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#" (click)="$event.preventDefault()">
                    <i class="fas fa-exclamation-circle me-2"></i>
                    Notas urgentes
                  </a>
                </li>
              </ul>
            </li>

            <!-- Empleados (existente) -->
            <li class="nav-item">
              <a class="nav-link" 
                 routerLink="/empleados" 
                 routerLinkActive="active">
                <i class="fas fa-users me-1"></i>
                Empleados
              </a>
            </li>
          </ul>

          <!-- Right side items -->
          <ul class="navbar-nav">
            <!-- Notificaciones -->
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle position-relative" 
                 href="#" 
                 id="notificacionesDropdown" 
                 role="button" 
                 data-bs-toggle="dropdown" 
                 aria-expanded="false">
                <i class="fas fa-bell"></i>
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" 
                      *ngIf="notificacionesCount > 0">
                  {{ notificacionesCount }}
                  <span class="visually-hidden">notificaciones no leídas</span>
                </span>
              </a>
              <ul class="dropdown-menu dropdown-menu-end notification-dropdown" aria-labelledby="notificacionesDropdown">
                <li class="dropdown-header">
                  <strong>Notificaciones</strong>
                  <span class="badge bg-primary ms-2" *ngIf="notificacionesCount > 0">{{ notificacionesCount }}</span>
                </li>
                <li><hr class="dropdown-divider"></li>
                
                <li *ngIf="notificacionesCount === 0">
                  <div class="dropdown-item-text text-center text-muted py-3">
                    <i class="fas fa-check-circle fa-2x mb-2"></i>
                    <br>
                    No hay notificaciones
                  </div>
                </li>
                
                <li *ngFor="let notificacion of notificacionesRecientes">
                  <a class="dropdown-item notification-item" href="#" (click)="$event.preventDefault()">
                    <div class="d-flex align-items-start">
                      <div class="notification-icon me-2">
                        <i class="fas" [ngClass]="getNotificationIcon(notificacion.tipo)"></i>
                      </div>
                      <div class="flex-grow-1">
                        <div class="notification-title">{{ notificacion.titulo }}</div>
                        <div class="notification-text">{{ notificacion.mensaje }}</div>
                        <small class="notification-time text-muted">{{ notificacion.tiempo }}</small>
                      </div>
                    </div>
                  </a>
                </li>
                
                <li *ngIf="notificacionesCount > 0"><hr class="dropdown-divider"></li>
                <li *ngIf="notificacionesCount > 0">
                  <a class="dropdown-item text-center" href="#" (click)="$event.preventDefault()">
                    <small>Ver todas las notificaciones</small>
                  </a>
                </li>
              </ul>
            </li>

            <!-- Búsqueda rápida -->
            <li class="nav-item">
              <button class="btn btn-outline-light btn-sm me-2" 
                      type="button" 
                      data-bs-toggle="modal" 
                      data-bs-target="#searchModal">
                <i class="fas fa-search"></i>
              </button>
            </li>

            <!-- Usuario -->
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" 
                 href="#" 
                 id="userDropdown" 
                 role="button" 
                 data-bs-toggle="dropdown" 
                 aria-expanded="false">
                <i class="fas fa-user-circle me-1"></i>
                Usuario
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li>
                  <a class="dropdown-item" href="#" (click)="$event.preventDefault()">
                    <i class="fas fa-user me-2"></i>
                    Mi perfil
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" routerLink="/configuracion">
                    <i class="fas fa-cog me-2"></i>
                    Configuración
                  </a>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <a class="dropdown-item" href="#" (click)="$event.preventDefault()">
                    <i class="fas fa-question-circle me-2"></i>
                    Ayuda
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#" (click)="$event.preventDefault()">
                    <i class="fas fa-sign-out-alt me-2"></i>
                    Cerrar sesión
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Modal de búsqueda -->
    <div class="modal fade" id="searchModal" tabindex="-1" aria-labelledby="searchModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="searchModalLabel">
              <i class="fas fa-search me-2"></i>
              Búsqueda rápida
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <input type="text" 
                     class="form-control form-control-lg" 
                     placeholder="Buscar medicaciones, alergias, notas médicas..." 
                     [(ngModel)]="searchTerm"
                     (keyup.enter)="buscar()">
            </div>
            <div class="d-flex gap-2">
              <button type="button" class="btn btn-primary" (click)="buscar()">
                <i class="fas fa-search me-1"></i>
                Buscar
              </button>
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .navbar {
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .navbar-brand {
      font-size: 1.5rem;
      font-weight: 700;
    }
    
    .nav-link {
      font-weight: 500;
      transition: all 0.3s ease;
    }
    
    .nav-link:hover {
      background-color: rgba(255,255,255,0.1);
      border-radius: 5px;
    }
    
    .nav-link.active {
      background-color: rgba(255,255,255,0.2);
      border-radius: 5px;
    }
    
    .dropdown-menu {
      border: none;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      border-radius: 10px;
    }
    
    .dropdown-item {
      padding: 0.75rem 1rem;
      transition: background-color 0.3s ease;
    }
    
    .dropdown-item:hover {
      background-color: #f8f9fa;
    }
    
    .notification-dropdown {
      width: 350px;
      max-height: 400px;
      overflow-y: auto;
    }
    
    .notification-item {
      padding: 1rem;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .notification-item:last-child {
      border-bottom: none;
    }
    
    .notification-icon {
      width: 30px;
      text-align: center;
    }
    
    .notification-title {
      font-weight: 600;
      font-size: 0.9rem;
      margin-bottom: 0.25rem;
    }
    
    .notification-text {
      font-size: 0.8rem;
      color: #6c757d;
      margin-bottom: 0.25rem;
    }
    
    .notification-time {
      font-size: 0.75rem;
    }
    
    .badge {
      font-size: 0.7rem;
    }
    
    @media (max-width: 991px) {
      .navbar-nav .dropdown-menu {
        position: static;
        float: none;
        width: auto;
        margin-top: 0;
        background-color: transparent;
        border: 0;
        box-shadow: none;
      }
      
      .navbar-nav .dropdown-item {
        color: rgba(255,255,255,0.8);
      }
      
      .navbar-nav .dropdown-item:hover {
        background-color: rgba(255,255,255,0.1);
        color: white;
      }
    }
  `]
})
export class NavbarComponent {
  
  searchTerm = '';
  notificacionesCount = 3; // Simulado
  notificacionesRecientes = [
    {
      tipo: 'medicacion',
      titulo: 'Medicación por vencer',
      mensaje: 'Aspirina vence en 2 días',
      tiempo: 'hace 5 min'
    },
    {
      tipo: 'cita',
      titulo: 'Cita programada',
      mensaje: 'Consulta con Dr. García mañana',
      tiempo: 'hace 1 hora'
    },
    {
      tipo: 'alergia',
      titulo: 'Alerta de alergia',
      mensaje: 'Revisar alergia a penicilina',
      tiempo: 'hace 2 horas'
    }
  ];

  constructor(private router: Router) {}

  isRouteActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }

  getNotificationIcon(tipo: string): string {
    const iconos: { [key: string]: string } = {
      'medicacion': 'fa-pills',
      'cita': 'fa-calendar-check',
      'alergia': 'fa-exclamation-triangle',
      'nota': 'fa-file-medical-alt',
      'sistema': 'fa-cog'
    };
    return iconos[tipo] || 'fa-bell';
  }

  buscar(): void {
    if (this.searchTerm.trim()) {
      // Implementar lógica de búsqueda
      console.log('Buscando:', this.searchTerm);
      // Cerrar modal
      const modal = document.getElementById('searchModal');
      if (modal) {
        const bsModal = (window as any).bootstrap.Modal.getInstance(modal);
        if (bsModal) {
          bsModal.hide();
        }
      }
    }
  }
}