import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpleadoComponent } from './empleado.component'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, EmpleadoComponent],
  template: `
    <div style="padding: 20px;">
      <h1 style="text-align: center;">Gestión de Empleados</h1>
      <app-empleado></app-empleado>
    </div>
  `
})
export class AppComponent {}