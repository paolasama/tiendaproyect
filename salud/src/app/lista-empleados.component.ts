import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpleadoComponent } from './empleado.component'; // Asegúrate de que la ruta sea correcta
import { Empleado } from './empleado.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-lista-empleados',
  standalone: true,
  imports: [CommonModule, EmpleadoComponent, MatButtonModule, MatIconModule],
  template: `
    <div class="lista-container">
      <div class="header">
        <h2>Lista de Empleados</h2>
        <button mat-raised-button color="primary" (click)="nuevoEmpleado()">
          <mat-icon>add</mat-icon> NUEVO EMPLEADO
        </button>
      </div>

      <div class="grid">
        <app-empleado 
          *ngFor="let emp of empleados"
          [empleado]="emp"
          (editar)="editarEmpleado($event)"
          (eliminar)="eliminarEmpleado($event)">
        </app-empleado>
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
  `]
})
export class ListaEmpleadosComponent {
  empleados: Empleado[] = [
    {
      id: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan.perez@empresa.com',
      departamento: 'Ventas',
      telefono: '555-1234',
      foto: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    // Más empleados...
  ];

  nuevoEmpleado() {
    // Lógica para agregar nuevo empleado
  }

  editarEmpleado(empleado: Empleado) {
    // Lógica para editar
  }

  eliminarEmpleado(id: number) {
    // Lógica para eliminar
  }
}