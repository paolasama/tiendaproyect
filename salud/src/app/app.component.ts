import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListaEmpleadosComponent } from './lista-empleados.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ListaEmpleadosComponent],
  template: `
    <div style="padding: 20px;">
      <h1 style="text-align: center;">Gestión de Empleados</h1>
      <app-lista-empleados></app-lista-empleados>
    </div>
  `
})
export class AppComponent {}