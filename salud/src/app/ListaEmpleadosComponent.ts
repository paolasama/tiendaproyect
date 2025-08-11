import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from './empleado.service'; // Asegúrate de que la ruta sea correcta
import { Empleado } from './empleado.model'; // Asegúrate de que la ruta sea correcta
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-lista-empleados',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    // Importa aquí EmpleadoComponent si lo usas en el template
  ],
  template: `
    <div class="lista-container">
      <div class="header">
        <h2>Lista de Empleados</h2>
        <button mat-raised-button color="primary" (click)="nuevoEmpleado()">
          <mat-icon>add</mat-icon> NUEVO EMPLEADO
        </button>
      </div>

      <mat-spinner *ngIf="loading"></mat-spinner>

      <div class="grid">
        <!-- Aquí irían tus componentes app-empleado -->
        <div *ngFor="let emp of empleados" class="empleado-item">
          {{ emp.nombre }} {{ emp.apellido }} - {{ emp.email }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .lista-container {
      padding: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    .empleado-item {
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    mat-spinner {
      margin: 20px auto;
    }
  `]
})
export class ListaEmpleadosComponent implements OnInit {
  empleados: Empleado[] = [];
  loading = true;

  constructor(private empleadoService: EmpleadoService) {}

  ngOnInit(): void {
    this.cargarEmpleados();
  }

  cargarEmpleados() {
    this.loading = true;
    this.empleadoService.getEmpleados().subscribe({
      next: (data) => {
        this.empleados = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar empleados', err);
        this.loading = false;
      }
    });
  }

  nuevoEmpleado() {
    // Lógica para agregar nuevo empleado
  }
}