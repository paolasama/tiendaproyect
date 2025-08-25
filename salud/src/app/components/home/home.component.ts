import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid">
      <!-- Hero Section -->
      <div class="hero-section bg-primary text-white py-5 mb-5">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-6">
              <h1 class="display-4 fw-bold mb-4">
                <i class="fas fa-heartbeat me-3"></i>
                Sistema de Salud
              </h1>
              <p class="lead mb-4">
                Gestiona tu información médica de manera integral y segura. 
                Controla medicaciones, alergias y notas médicas en un solo lugar.
              </p>
              <div class="d-flex gap-3">
                <a routerLink="/dashboard" class="btn btn-light btn-lg">
                  <i class="fas fa-tachometer-alt me-2"></i>
                  Ir al Dashboard
                </a>
                <button class="btn btn-outline-light btn-lg" (click)="scrollToFeatures()">
                  <i class="fas fa-info-circle me-2"></i>
                  Conocer más
                </button>
              </div>
            </div>
            <div class="col-lg-6 text-center">
              <div class="hero-icon">
                <i class="fas fa-user-md fa-10x opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="container mb-5">
        <div class="row g-4">
          <div class="col-md-3">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body text-center">
                <div class="stat-icon text-primary mb-3">
                  <i class="fas fa-pills fa-3x"></i>
                </div>
                <h3 class="card-title">{{ stats.medicaciones }}</h3>
                <p class="card-text text-muted">Medicaciones registradas</p>
                <a routerLink="/medicaciones" class="btn btn-outline-primary btn-sm">
                  Ver medicaciones
                </a>
              </div>
            </div>
          </div>
          
          <div class="col-md-3">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body text-center">
                <div class="stat-icon text-warning mb-3">
                  <i class="fas fa-exclamation-triangle fa-3x"></i>
                </div>
                <h3 class="card-title">{{ stats.alergias }}</h3>
                <p class="card-text text-muted">Alergias registradas</p>
                <a routerLink="/alergias" class="btn btn-outline-warning btn-sm">
                  Ver alergias
                </a>
              </div>
            </div>
          </div>
          
          <div class="col-md-3">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body text-center">
                <div class="stat-icon text-info mb-3">
                  <i class="fas fa-file-medical-alt fa-3x"></i>
                </div>
                <h3 class="card-title">{{ stats.notasMedicas }}</h3>
                <p class="card-text text-muted">Notas médicas</p>
                <a routerLink="/notas-medicas" class="btn btn-outline-info btn-sm">
                  Ver notas
                </a>
              </div>
            </div>
          </div>
          
          <div class="col-md-3">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body text-center">
                <div class="stat-icon text-success mb-3">
                  <i class="fas fa-calendar-check fa-3x"></i>
                </div>
                <h3 class="card-title">{{ stats.proximasCitas }}</h3>
                <p class="card-text text-muted">Próximas citas</p>
                <a routerLink="/dashboard" class="btn btn-outline-success btn-sm">
                  Ver calendario
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div class="container mb-5" id="features">
        <div class="row mb-5">
          <div class="col-12 text-center">
            <h2 class="display-5 fw-bold mb-3">Características principales</h2>
            <p class="lead text-muted">
              Descubre todas las funcionalidades que te ayudarán a gestionar tu salud
            </p>
          </div>
        </div>
        
        <div class="row g-4">
          <div class="col-lg-4">
            <div class="feature-card text-center p-4">
              <div class="feature-icon text-primary mb-3">
                <i class="fas fa-pills fa-4x"></i>
              </div>
              <h4 class="fw-bold mb-3">Gestión de Medicaciones</h4>
              <p class="text-muted mb-4">
                Controla todas tus medicaciones, dosis, frecuencias y fechas de vencimiento. 
                Recibe alertas automáticas para no olvidar ninguna toma.
              </p>
              <ul class="list-unstyled text-start">
                <li><i class="fas fa-check text-success me-2"></i> Control de inventario</li>
                <li><i class="fas fa-check text-success me-2"></i> Alertas de vencimiento</li>
                <li><i class="fas fa-check text-success me-2"></i> Historial de medicaciones</li>
                <li><i class="fas fa-check text-success me-2"></i> Recordatorios de toma</li>
              </ul>
            </div>
          </div>
          
          <div class="col-lg-4">
            <div class="feature-card text-center p-4">
              <div class="feature-icon text-warning mb-3">
                <i class="fas fa-shield-alt fa-4x"></i>
              </div>
              <h4 class="fw-bold mb-3">Control de Alergias</h4>
              <p class="text-muted mb-4">
                Mantén un registro detallado de todas tus alergias y reacciones. 
                Información vital siempre disponible para emergencias médicas.
              </p>
              <ul class="list-unstyled text-start">
                <li><i class="fas fa-check text-success me-2"></i> Clasificación por severidad</li>
                <li><i class="fas fa-check text-success me-2"></i> Síntomas detallados</li>
                <li><i class="fas fa-check text-success me-2"></i> Tratamientos recomendados</li>
                <li><i class="fas fa-check text-success me-2"></i> Alertas críticas</li>
              </ul>
            </div>
          </div>
          
          <div class="col-lg-4">
            <div class="feature-card text-center p-4">
              <div class="feature-icon text-info mb-3">
                <i class="fas fa-notes-medical fa-4x"></i>
              </div>
              <h4 class="fw-bold mb-3">Notas Médicas</h4>
              <p class="text-muted mb-4">
                Organiza todas tus consultas, diagnósticos y tratamientos. 
                Mantén un historial médico completo y organizado.
              </p>
              <ul class="list-unstyled text-start">
                <li><i class="fas fa-check text-success me-2"></i> Historial de consultas</li>
                <li><i class="fas fa-check text-success me-2"></i> Notas por especialidad</li>
                <li><i class="fas fa-check text-success me-2"></i> Seguimiento de tratamientos</li>
                <li><i class="fas fa-check text-success me-2"></i> Recordatorios de citas</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="container mb-5">
        <div class="row">
          <div class="col-12">
            <div class="card bg-light border-0">
              <div class="card-body py-5">
                <div class="row align-items-center">
                  <div class="col-lg-8">
                    <h3 class="fw-bold mb-3">¿Listo para comenzar?</h3>
                    <p class="lead mb-0">
                      Accede al dashboard para ver un resumen completo de tu información médica 
                      o comienza registrando tu primera medicación, alergia o nota médica.
                    </p>
                  </div>
                  <div class="col-lg-4 text-lg-end">
                    <div class="d-flex flex-column gap-2">
                      <a routerLink="/dashboard" class="btn btn-primary btn-lg">
                        <i class="fas fa-tachometer-alt me-2"></i>
                        Ver Dashboard
                      </a>
                      <div class="btn-group" role="group">
                        <a routerLink="/medicaciones/nueva" class="btn btn-outline-primary">
                          <i class="fas fa-pills me-1"></i>
                          Nueva medicación
                        </a>
                        <a routerLink="/alergias/nueva" class="btn btn-outline-warning">
                          <i class="fas fa-exclamation-triangle me-1"></i>
                          Nueva alergia
                        </a>
                        <a routerLink="/notas-medicas/nueva" class="btn btn-outline-info">
                          <i class="fas fa-file-medical-alt me-1"></i>
                          Nueva nota
                        </a>
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
    .hero-section {
      background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
      border-radius: 0 0 50px 50px;
    }
    
    .hero-icon {
      animation: float 3s ease-in-out infinite;
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }
    
    .card {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important;
    }
    
    .stat-icon, .feature-icon {
      transition: transform 0.3s ease;
    }
    
    .card:hover .stat-icon,
    .feature-card:hover .feature-icon {
      transform: scale(1.1);
    }
    
    .feature-card {
      background: white;
      border-radius: 15px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.08);
      transition: all 0.3s ease;
      height: 100%;
    }
    
    .feature-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 15px 35px rgba(0,0,0,0.15);
    }
    
    .btn {
      transition: all 0.3s ease;
    }
    
    .btn:hover {
      transform: translateY(-2px);
    }
    
    .display-4 {
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    
    @media (max-width: 768px) {
      .hero-section {
        border-radius: 0 0 25px 25px;
      }
      
      .display-4 {
        font-size: 2.5rem;
      }
      
      .hero-icon i {
        font-size: 5rem !important;
      }
      
      .feature-icon i {
        font-size: 2.5rem !important;
      }
    }
  `]
})
export class HomeComponent {
  
  stats = {
    medicaciones: 12,
    alergias: 3,
    notasMedicas: 8,
    proximasCitas: 2
  };

  scrollToFeatures(): void {
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}