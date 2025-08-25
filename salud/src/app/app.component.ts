import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from './components/shared/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, NavbarComponent],
  template: `
    <div class="app-container">
      <!-- Barra de navegación -->
      <app-navbar></app-navbar>
      
      <!-- Contenido principal -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
      
      <!-- Footer -->
      <footer class="footer bg-light text-center py-3 mt-auto">
        <div class="container">
          <span class="text-muted">
            © 2024 Sistema de Salud - Gestión Médica Integral
          </span>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    .main-content {
      flex: 1;
      padding: 2rem 0;
      background-color: #f8f9fa;
    }
    
    .footer {
      border-top: 1px solid #dee2e6;
    }
    
    @media (max-width: 768px) {
      .main-content {
        padding: 1rem 0;
      }
    }
  `]
})
export class AppComponent {
  title = 'Sistema de Salud';
}