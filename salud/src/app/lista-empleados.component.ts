import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Empleado } from './empleado.model';
import { EmpleadoService } from './empleado.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-lista-empleados',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="lista-container">
      <div class="header">
        <h2>Lista de Empleados</h2>
        <button mat-raised-button color="primary" (click)="nuevoEmpleado()">
          <mat-icon>add</mat-icon> NUEVO EMPLEADO
        </button>
      </div>

      <table class="tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th class="acciones">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let emp of empleados">
            <td>{{ emp.id }}</td>
            <td>{{ emp.nombre }}</td>
            <td>{{ emp.apellido }}</td>
            <td>{{ emp.email }}</td>
            <td class="acciones">
              <button mat-button color="primary" (click)="editarEmpleado(emp)">
                <mat-icon>edit</mat-icon>
                Editar
              </button>
              <button mat-button color="warn" (click)="eliminarEmpleado(emp.id)">
                <mat-icon>delete</mat-icon>
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .lista-container { padding: 20px; }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .tabla { width: 100%; border-collapse: collapse; }
    .tabla th, .tabla td { border: 1px solid #ddd; padding: 8px; }
    .tabla th { background: #f5f5f5; text-align: left; }
    .acciones { white-space: nowrap; }
  `]
})
export class ListaEmpleadosComponent implements OnInit {
  empleados: Empleado[] = [];

  constructor(private empleadoService: EmpleadoService) {}

  ngOnInit(): void {
    this.empleadoService.getEmpleados().subscribe({
      next: (data) => (this.empleados = data),
      error: (err) => console.error('Error al cargar empleados', err)
    });
  }

  nuevoEmpleado() {
    const nombre = prompt('Nombre del empleado:');
    if (nombre == null || nombre.trim() === '') return;

    const apellido = prompt('Apellido del empleado:');
    if (apellido == null || apellido.trim() === '') return;

    const email = prompt('Email del empleado:');
    if (email == null || email.trim() === '') return;

    const nuevo = { id: 0, nombre: nombre.trim(), apellido: apellido.trim(), email: email.trim() } as Empleado;
    this.empleadoService.createEmpleado(nuevo).subscribe({
      next: (creado) => {
        this.empleados = [...this.empleados, creado];
      },
      error: (err) => console.error('Error al crear empleado', err)
    });
  }

  editarEmpleado(empleado: Empleado) {
    const nombre = prompt('Nuevo nombre:', empleado.nombre);
    if (nombre == null || nombre.trim() === '') return;

    const apellido = prompt('Nuevo apellido:', empleado.apellido);
    if (apellido == null || apellido.trim() === '') return;

    const email = prompt('Nuevo email:', empleado.email);
    if (email == null || email.trim() === '') return;

    const actualizado: Empleado = { ...empleado, nombre: nombre.trim(), apellido: apellido.trim(), email: email.trim() };
    this.empleadoService.updateEmpleado(empleado.id, actualizado).subscribe({
      next: (resp) => {
        this.empleados = this.empleados.map(e => e.id === resp.id ? resp : e);
      },
      error: (err) => console.error('Error al actualizar empleado', err)
    });
  }

  eliminarEmpleado(id: number) {
    if (!confirm('¿Seguro que deseas eliminar este empleado?')) return;

    this.empleadoService.deleteEmpleado(id).subscribe({
      next: () => {
        this.empleados = this.empleados.filter(e => e.id !== id);
      },
      error: (err) => console.error('Error al eliminar empleado', err)
    });
  }
}