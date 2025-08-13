import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-empleado',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatListModule
  ],
  template: `
    <mat-card class="empleado-card" *ngIf="empleado">
      <mat-card-header>
        <div mat-card-avatar class="empleado-avatar" 
             [style.background-image]="'url(' + (empleado.foto || defaultFoto) + ')'"></div>
        <mat-card-title>{{ empleado.nombre }} {{ empleado.apellido }}</mat-card-title>
        <mat-card-subtitle *ngIf="empleado.departamento">{{ empleado.departamento }}</mat-card-subtitle>
      </mat-card-header>

      <mat-divider></mat-divider>

      <mat-card-content>
        <mat-list>
          <mat-list-item>
            <mat-icon matListItemIcon>email</mat-icon>
            <div matListItemTitle>Email</div>
            <div matListItemLine>{{ empleado.email }}</div>
          </mat-list-item>

          <mat-list-item *ngIf="empleado.telefono">
            <mat-icon matListItemIcon>phone</mat-icon>
            <div matListItemTitle>Teléfono</div>
            <div matListItemLine>{{ empleado.telefono }}</div>
          </mat-list-item>
        </mat-list>
      </mat-card-content>

      <mat-divider></mat-divider>

      <mat-card-actions align="end">
        <button mat-raised-button color="primary" (click)="editar.emit(empleado)">
          <mat-icon>edit</mat-icon> EDITAR
        </button>
        <button mat-raised-button color="warn" (click)="eliminar.emit(empleado.id)">
          <mat-icon>delete</mat-icon> ELIMINAR
        </button>
      </mat-card-actions>
    </mat-card>

    <!-- Mensaje cuando no hay empleado -->
    <div *ngIf="!empleado" class="no-empleado">
      No se ha proporcionado información del empleado.
    </div>
  `,
  styles: [`
    .empleado-card {
      max-width: 500px;
      margin: 1rem;
    }
    .empleado-avatar {
      background-size: cover;
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    .no-empleado {
      padding: 20px;
      text-align: center;
      color: #666;
    }
  `]
})
export class EmpleadoComponent {
  @Input() empleado?: any;
  @Output() editar = new EventEmitter<any>();
  @Output() eliminar = new EventEmitter<number>();

  defaultFoto = 'assets/images/default-avatar.png';
}