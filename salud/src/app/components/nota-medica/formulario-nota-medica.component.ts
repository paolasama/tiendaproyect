import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NotaMedicaService } from '../../services/nota-medica.service';
import { NotaMedica, TipoNota, PrioridadNota } from '../../models/nota-medica.model';

@Component({
  selector: 'app-formulario-nota-medica',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col-md-10 col-lg-8">
          <!-- Header -->
          <div class="card mb-4">
            <div class="card-header">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h3 class="mb-0">
                    <i class="fas fa-notes-medical me-2"></i>
                    {{ esEdicion ? 'Editar Nota Médica' : 'Nueva Nota Médica' }}
                  </h3>
                  <p class="mb-0 mt-1 opacity-75">{{ esEdicion ? 'Modifique los datos de la nota médica' : 'Complete la información de la nueva nota médica' }}</p>
                </div>
                <button 
                  class="btn btn-outline-light"
                  (click)="cancelar()">
                  <i class="fas fa-times me-1"></i>
                  Cancelar
                </button>
              </div>
            </div>
          </div>

          <!-- Formulario -->
          <form [formGroup]="formulario" (ngSubmit)="onSubmit()">
            <div class="row">
              <!-- Información básica -->
              <div class="col-md-8 mb-4">
                <div class="card h-100">
                  <div class="card-header">
                    <h5 class="mb-0">
                      <i class="fas fa-info-circle me-2"></i>
                      Información Básica
                    </h5>
                  </div>
                  <div class="card-body">
                    <!-- Título -->
                    <div class="mb-3">
                      <label for="titulo" class="form-label required">Título de la nota:</label>
                      <input 
                        type="text" 
                        id="titulo"
                        class="form-control"
                        formControlName="titulo"
                        placeholder="Ej: Consulta de control, Diagnóstico inicial..."
                        [class.is-invalid]="formulario.get('titulo')?.invalid && formulario.get('titulo')?.touched">
                      <div class="invalid-feedback" *ngIf="formulario.get('titulo')?.invalid && formulario.get('titulo')?.touched">
                        <div *ngIf="formulario.get('titulo')?.errors?.['required']">El título es obligatorio</div>
                        <div *ngIf="formulario.get('titulo')?.errors?.['minlength']">El título debe tener al menos 3 caracteres</div>
                        <div *ngIf="formulario.get('titulo')?.errors?.['maxlength']">El título no puede exceder 200 caracteres</div>
                      </div>
                    </div>

                    <!-- Contenido -->
                    <div class="mb-3">
                      <label for="contenido" class="form-label required">Contenido de la nota:</label>
                      <textarea 
                        id="contenido"
                        class="form-control"
                        formControlName="contenido"
                        rows="8"
                        placeholder="Describa detalladamente la consulta, diagnóstico, tratamiento o seguimiento..."
                        [class.is-invalid]="formulario.get('contenido')?.invalid && formulario.get('contenido')?.touched"></textarea>
                      <div class="invalid-feedback" *ngIf="formulario.get('contenido')?.invalid && formulario.get('contenido')?.touched">
                        <div *ngIf="formulario.get('contenido')?.errors?.['required']">El contenido es obligatorio</div>
                        <div *ngIf="formulario.get('contenido')?.errors?.['minlength']">El contenido debe tener al menos 10 caracteres</div>
                      </div>
                      <div class="form-text">{{ formulario.get('contenido')?.value?.length || 0 }} caracteres</div>
                    </div>

                    <!-- Médico tratante -->
                    <div class="mb-3">
                      <label for="medicoTratante" class="form-label required">Médico tratante:</label>
                      <div class="input-group">
                        <span class="input-group-text">
                          <i class="fas fa-user-md"></i>
                        </span>
                        <input 
                          type="text" 
                          id="medicoTratante"
                          class="form-control"
                          formControlName="medicoTratante"
                          placeholder="Nombre completo del médico"
                          [class.is-invalid]="formulario.get('medicoTratante')?.invalid && formulario.get('medicoTratante')?.touched">
                      </div>
                      <div class="invalid-feedback" *ngIf="formulario.get('medicoTratante')?.invalid && formulario.get('medicoTratante')?.touched">
                        <div *ngIf="formulario.get('medicoTratante')?.errors?.['required']">El médico tratante es obligatorio</div>
                        <div *ngIf="formulario.get('medicoTratante')?.errors?.['minlength']">El nombre debe tener al menos 3 caracteres</div>
                      </div>
                    </div>

                    <!-- Centro médico -->
                    <div class="mb-3">
                      <label for="centroMedico" class="form-label">Centro médico:</label>
                      <div class="input-group">
                        <span class="input-group-text">
                          <i class="fas fa-hospital"></i>
                        </span>
                        <input 
                          type="text" 
                          id="centroMedico"
                          class="form-control"
                          formControlName="centroMedico"
                          placeholder="Nombre del hospital, clínica o consultorio">
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Clasificación y fechas -->
              <div class="col-md-4 mb-4">
                <div class="card h-100">
                  <div class="card-header">
                    <h5 class="mb-0">
                      <i class="fas fa-tags me-2"></i>
                      Clasificación
                    </h5>
                  </div>
                  <div class="card-body">
                    <!-- Tipo -->
                    <div class="mb-3">
                      <label for="tipo" class="form-label required">Tipo de nota:</label>
                      <select 
                        id="tipo"
                        class="form-select"
                        formControlName="tipo"
                        [class.is-invalid]="formulario.get('tipo')?.invalid && formulario.get('tipo')?.touched">
                        <option value="">Seleccione un tipo</option>
                        <option value="CONSULTA">Consulta</option>
                        <option value="LABORATORIO">Laboratorio</option>
                        <option value="RADIOLOGIA">Radiología</option>
                        <option value="ESPECIALISTA">Especialista</option>
                        <option value="URGENCIA">Urgencia</option>
                        <option value="HOSPITALIZACION">Hospitalización</option>
                        <option value="CIRUGIA">Cirugía</option>
                        <option value="VACUNACION">Vacunación</option>
                        <option value="REVISION">Revisión</option>
                        <option value="OTRO">Otro</option>
                      </select>
                      <div class="invalid-feedback" *ngIf="formulario.get('tipo')?.invalid && formulario.get('tipo')?.touched">
                        <div *ngIf="formulario.get('tipo')?.errors?.['required']">El tipo es obligatorio</div>
                      </div>
                    </div>

                    <!-- Prioridad -->
                    <div class="mb-3">
                      <label for="prioridad" class="form-label required">Prioridad:</label>
                      <select 
                        id="prioridad"
                        class="form-select"
                        formControlName="prioridad"
                        [class.is-invalid]="formulario.get('prioridad')?.invalid && formulario.get('prioridad')?.touched">
                        <option value="">Seleccione una prioridad</option>
                        <option value="BAJA">Baja</option>
                        <option value="MEDIA">Media</option>
                        <option value="ALTA">Alta</option>
                        <option value="URGENTE">Urgente</option>
                      </select>
                      <div class="invalid-feedback" *ngIf="formulario.get('prioridad')?.invalid && formulario.get('prioridad')?.touched">
                        <div *ngIf="formulario.get('prioridad')?.errors?.['required']">La prioridad es obligatoria</div>
                      </div>
                    </div>

                    <!-- Fecha de consulta -->
                    <div class="mb-3">
                      <label for="fechaConsulta" class="form-label required">Fecha de consulta:</label>
                      <input 
                        type="date" 
                        id="fechaConsulta"
                        class="form-control"
                        formControlName="fechaConsulta"
                        [class.is-invalid]="formulario.get('fechaConsulta')?.invalid && formulario.get('fechaConsulta')?.touched">
                      <div class="invalid-feedback" *ngIf="formulario.get('fechaConsulta')?.invalid && formulario.get('fechaConsulta')?.touched">
                        <div *ngIf="formulario.get('fechaConsulta')?.errors?.['required']">La fecha de consulta es obligatoria</div>
                      </div>
                    </div>

                    <!-- Estado activo -->
                    <div class="mb-3">
                      <div class="form-check form-switch">
                        <input 
                          class="form-check-input" 
                          type="checkbox" 
                          id="activa"
                          formControlName="activa">
                        <label class="form-check-label" for="activa">
                          Nota activa
                        </label>
                      </div>
                      <div class="form-text">Las notas inactivas se consideran archivadas</div>
                    </div>

                    <!-- Vista previa de clasificación -->
                    <div class="mt-4" *ngIf="formulario.get('tipo')?.value && formulario.get('prioridad')?.value">
                      <h6>Vista previa:</h6>
                      <div class="d-flex flex-wrap gap-2">
                        <span class="badge" [ngClass]="obtenerClaseTipo(formulario.get('tipo')?.value)">
                          <i class="fas" [ngClass]="obtenerIconoTipo(formulario.get('tipo')?.value)"></i>
                          {{ obtenerTextoTipo(formulario.get('tipo')?.value) }}
                        </span>
                        <span class="badge" [ngClass]="obtenerClasePrioridad(formulario.get('prioridad')?.value)">
                          {{ obtenerTextoPrioridad(formulario.get('prioridad')?.value) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Alerta de prioridad urgente -->
            <div class="alert alert-danger" *ngIf="formulario.get('prioridad')?.value === 'URGENTE'">
              <div class="d-flex align-items-center">
                <i class="fas fa-exclamation-triangle fa-2x me-3"></i>
                <div>
                  <h5 class="alert-heading mb-1">Nota de Prioridad Urgente</h5>
                  <p class="mb-0">Esta nota será marcada como urgente y requerirá atención inmediata. Asegúrese de que el contenido refleje la urgencia de la situación.</p>
                </div>
              </div>
            </div>

            <!-- Botones de acción -->
            <div class="card">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                  <div class="text-muted">
                    <small>
                      <i class="fas fa-info-circle me-1"></i>
                      Los campos marcados con * son obligatorios
                    </small>
                  </div>
                  <div class="d-flex gap-2">
                    <button 
                      type="button" 
                      class="btn btn-outline-secondary"
                      (click)="cancelar()">
                      <i class="fas fa-times me-1"></i>
                      Cancelar
                    </button>
                    <button 
                      type="submit" 
                      class="btn btn-primary"
                      [disabled]="formulario.invalid || guardando">
                      <span *ngIf="guardando" class="spinner-border spinner-border-sm me-2"></span>
                      <i *ngIf="!guardando" class="fas fa-save me-1"></i>
                      {{ guardando ? 'Guardando...' : (esEdicion ? 'Actualizar nota' : 'Guardar nota') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div class="d-flex justify-content-center align-items-center" style="height: 50vh;" *ngIf="cargandoNota">
      <div class="text-center">
        <div class="spinner-border text-primary mb-3"></div>
        <p>Cargando información de la nota...</p>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      border: none;
    }
    
    .card-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 10px 10px 0 0;
      border: none;
    }
    
    .form-label.required::after {
      content: ' *';
      color: #dc3545;
    }
    
    .form-control, .form-select {
      border-radius: 6px;
      border: 1px solid #dee2e6;
      transition: all 0.2s;
    }
    
    .form-control:focus, .form-select:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
    }
    
    .btn {
      border-radius: 6px;
      font-weight: 500;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
    }
    
    .btn-primary:hover:not(:disabled) {
      background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
      transform: translateY(-1px);
    }
    
    .btn-primary:disabled {
      background: #6c757d;
      opacity: 0.6;
    }
    
    .badge {
      font-size: 0.8em;
      padding: 0.5em 0.75em;
    }
    
    .input-group-text {
      background-color: #f8f9fa;
      border-color: #dee2e6;
    }
    
    .form-check-input:checked {
      background-color: #667eea;
      border-color: #667eea;
    }
    
    .alert {
      border-radius: 8px;
      border: none;
    }
    
    .spinner-border-sm {
      width: 1rem;
      height: 1rem;
    }
    
    .gap-2 {
      gap: 0.5rem;
    }
    
    .opacity-75 {
      opacity: 0.75;
    }
    
    textarea.form-control {
      resize: vertical;
      min-height: 120px;
    }
    
    @media (max-width: 768px) {
      .d-flex.gap-2 {
        flex-direction: column;
      }
      
      .d-flex.gap-2 .btn {
        width: 100%;
      }
    }
  `]
})
export class FormularioNotaMedicaComponent implements OnInit {

  formulario!: FormGroup;
  esEdicion = false;
  notaId?: number;
  guardando = false;
  cargandoNota = false;

  constructor(
    private fb: FormBuilder,
    private notaMedicaService: NotaMedicaService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.esEdicion = true;
        this.notaId = +params['id'];
        this.cargarNota(this.notaId);
      }
    });
  }

  crearFormulario(): void {
    this.formulario = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      contenido: ['', [Validators.required, Validators.minLength(10)]],
      tipo: ['', Validators.required],
      prioridad: ['', Validators.required],
      fechaConsulta: ['', Validators.required],
      medicoTratante: ['', [Validators.required, Validators.minLength(3)]],
      centroMedico: [''],
      activa: [true]
    });
  }

  cargarNota(id: number): void {
    this.notaMedicaService.obtenerNotaMedicaPorId(id).subscribe({
      next: (nota: NotaMedica) => {
        this.formulario.patchValue({
          titulo: nota.titulo,
          contenido: nota.contenido,
          tipo: nota.tipoNota,
          prioridad: nota.prioridad,
          fechaConsulta: this.formatearFechaParaInput(nota.fechaConsulta),
          medicoTratante: nota.medicoTratante,
          centroMedico: nota.centroMedico,
          activa: !nota.archivado
        });
      },
      error: (error: any) => {
        console.error('Error al cargar nota:', error);
        // this.error = 'No se pudo cargar la información de la nota médica';
      }
    });
  }

  onSubmit(): void {
    if (this.formulario.invalid) {
      this.marcarCamposComoTocados();
      return;
    }

    this.guardando = true;
    const datosNota = this.prepararDatos();

    const operacion = this.esEdicion && this.notaId
      ? this.notaMedicaService.actualizarNotaMedica(this.notaId, datosNota)
      : this.notaMedicaService.registrarNotaMedica(datosNota);

    operacion.subscribe({
      next: (nota) => {
        this.router.navigate(['/notas-medicas/detalle', nota.id]);
      },
      error: (error) => {
        console.error('Error al guardar nota:', error);
        this.guardando = false;
      }
    });
  }

  prepararDatos(): NotaMedica {
    const formValue = this.formulario.value;
    return {
      id: this.esEdicion ? this.notaId : undefined,
      titulo: formValue.titulo.trim(),
      contenido: formValue.contenido.trim(),
      tipoNota: formValue.tipo as TipoNota,
      prioridad: formValue.prioridad as PrioridadNota,
      fechaConsulta: new Date(formValue.fechaConsulta),
      medicoTratante: formValue.medicoTratante.trim(),
      centroMedico: formValue.centroMedico?.trim() || undefined,
      archivado: !formValue.activa,
      fechaCreacion: new Date(),
      fechaModificacion: new Date()
    } as NotaMedica;
  }

  marcarCamposComoTocados(): void {
    Object.keys(this.formulario.controls).forEach(key => {
      this.formulario.get(key)?.markAsTouched();
    });
  }

  cancelar(): void {
    if (this.formulario.dirty) {
      if (confirm('¿Está seguro de que desea cancelar? Se perderán los cambios no guardados.')) {
        this.navegarAtras();
      }
    } else {
      this.navegarAtras();
    }
  }

  navegarAtras(): void {
    if (this.esEdicion && this.notaId) {
      this.router.navigate(['/notas-medicas/detalle', this.notaId]);
    } else {
      this.router.navigate(['/notas-medicas']);
    }
  }

  formatearFechaParaInput(fecha: Date): string {
    const date = new Date(fecha);
    return date.toISOString().split('T')[0];
  }

  obtenerIconoTipo(tipo: TipoNota): string {
    const iconos = {
      'CONSULTA': 'fa-stethoscope',
      'LABORATORIO': 'fa-flask',
      'RADIOLOGIA': 'fa-x-ray',
      'ESPECIALISTA': 'fa-user-md',
      'URGENCIA': 'fa-ambulance',
      'HOSPITALIZACION': 'fa-hospital',
      'CIRUGIA': 'fa-cut',
      'VACUNACION': 'fa-syringe',
      'REVISION': 'fa-search',
      'OTRO': 'fa-file-medical'
    };
    return iconos[tipo] || 'fa-file-medical';
  }

  obtenerTextoTipo(tipo: TipoNota): string {
    const textos = {
      'CONSULTA': 'Consulta',
      'LABORATORIO': 'Laboratorio',
      'RADIOLOGIA': 'Radiología',
      'ESPECIALISTA': 'Especialista',
      'URGENCIA': 'Urgencia',
      'HOSPITALIZACION': 'Hospitalización',
      'CIRUGIA': 'Cirugía',
      'VACUNACION': 'Vacunación',
      'REVISION': 'Revisión',
      'OTRO': 'Otro'
    };
    return textos[tipo] || 'Desconocido';
  }

  obtenerClaseTipo(tipo: TipoNota): string {
    const clases = {
      'CONSULTA': 'bg-primary',
      'LABORATORIO': 'bg-secondary',
      'RADIOLOGIA': 'bg-purple',
      'ESPECIALISTA': 'bg-info',
      'URGENCIA': 'bg-danger',
      'HOSPITALIZACION': 'bg-warning',
      'CIRUGIA': 'bg-success',
      'VACUNACION': 'bg-teal',
      'REVISION': 'bg-orange',
      'OTRO': 'bg-light text-dark'
    };
    return clases[tipo] || 'bg-secondary';
  }

  obtenerTextoPrioridad(prioridad: PrioridadNota): string {
    const textos = {
      'BAJA': 'Baja',
      'MEDIA': 'Media',
      'ALTA': 'Alta',
      'URGENTE': 'Urgente'
    };
    return textos[prioridad] || 'Desconocido';
  }

  obtenerClasePrioridad(prioridad: PrioridadNota): string {
    const clases = {
      'BAJA': 'bg-success',
      'MEDIA': 'bg-warning',
      'ALTA': 'bg-orange',
      'URGENTE': 'bg-danger'
    };
    return clases[prioridad] || 'bg-secondary';
  }
}