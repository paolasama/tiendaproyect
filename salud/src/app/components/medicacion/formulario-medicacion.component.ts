import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MedicacionService } from '../../services/medicacion.service';
import { Medicacion } from '../../models/medicacion.model';

@Component({
  selector: 'app-formulario-medicacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="card">
            <div class="card-header">
              <h3 class="mb-0">
                <i class="fas fa-pills me-2"></i>
                {{ esEdicion ? 'Editar Medicación' : 'Nueva Medicación' }}
              </h3>
            </div>
            
            <div class="card-body">
              <form [formGroup]="medicacionForm" (ngSubmit)="onSubmit()">
                <!-- Información básica -->
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="nombre" class="form-label">
                      <i class="fas fa-capsules me-1"></i>
                      Nombre de la medicación *
                    </label>
                    <input 
                      type="text" 
                      class="form-control"
                      id="nombre"
                      formControlName="nombre"
                      [class.is-invalid]="isFieldInvalid('nombre')"
                      placeholder="Ej: Paracetamol">
                    <div class="invalid-feedback" *ngIf="isFieldInvalid('nombre')">
                      El nombre de la medicación es requerido
                    </div>
                  </div>
                  
                  <div class="col-md-6 mb-3">
                    <label for="dosis" class="form-label">
                      <i class="fas fa-balance-scale me-1"></i>
                      Dosis *
                    </label>
                    <input 
                      type="text" 
                      class="form-control"
                      id="dosis"
                      formControlName="dosis"
                      [class.is-invalid]="isFieldInvalid('dosis')"
                      placeholder="Ej: 500mg">
                    <div class="invalid-feedback" *ngIf="isFieldInvalid('dosis')">
                      La dosis es requerida
                    </div>
                  </div>
                </div>
                
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="frecuencia" class="form-label">
                      <i class="fas fa-clock me-1"></i>
                      Frecuencia *
                    </label>
                    <select 
                      class="form-select"
                      id="frecuencia"
                      formControlName="frecuencia"
                      [class.is-invalid]="isFieldInvalid('frecuencia')">
                      <option value="">Seleccionar frecuencia</option>
                      <option value="Una vez al día">Una vez al día</option>
                      <option value="Cada 12 horas">Cada 12 horas</option>
                      <option value="Cada 8 horas">Cada 8 horas</option>
                      <option value="Cada 6 horas">Cada 6 horas</option>
                      <option value="Cada 4 horas">Cada 4 horas</option>
                      <option value="Según necesidad">Según necesidad</option>
                      <option value="Personalizada">Personalizada</option>
                    </select>
                    <div class="invalid-feedback" *ngIf="isFieldInvalid('frecuencia')">
                      La frecuencia es requerida
                    </div>
                  </div>
                  
                  <div class="col-md-6 mb-3" *ngIf="medicacionForm.get('frecuencia')?.value === 'Personalizada'">
                    <label for="frecuenciaPersonalizada" class="form-label">
                      Especificar frecuencia
                    </label>
                    <input 
                      type="text" 
                      class="form-control"
                      id="frecuenciaPersonalizada"
                      formControlName="frecuenciaPersonalizada"
                      placeholder="Ej: Cada 3 días">
                  </div>
                  
                  <div class="col-md-6 mb-3">
                    <label for="medicoPrescriptor" class="form-label">
                      <i class="fas fa-user-md me-1"></i>
                      Médico prescriptor *
                    </label>
                    <input 
                      type="text" 
                      class="form-control"
                      id="medicoPrescriptor"
                      formControlName="medicoPrescriptor"
                      [class.is-invalid]="isFieldInvalid('medicoPrescriptor')"
                      placeholder="Ej: Dr. García López">
                    <div class="invalid-feedback" *ngIf="isFieldInvalid('medicoPrescriptor')">
                      El médico prescriptor es requerido
                    </div>
                  </div>
                </div>
                
                <!-- Fechas -->
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="fechaInicio" class="form-label">
                      <i class="fas fa-calendar-alt me-1"></i>
                      Fecha de inicio *
                    </label>
                    <input 
                      type="datetime-local" 
                      class="form-control"
                      id="fechaInicio"
                      formControlName="fechaInicio"
                      [class.is-invalid]="isFieldInvalid('fechaInicio')">
                    <div class="invalid-feedback" *ngIf="isFieldInvalid('fechaInicio')">
                      La fecha de inicio es requerida
                    </div>
                  </div>
                  
                  <div class="col-md-6 mb-3">
                    <label for="fechaFin" class="form-label">
                      <i class="fas fa-calendar-times me-1"></i>
                      Fecha de fin (opcional)
                    </label>
                    <input 
                      type="datetime-local" 
                      class="form-control"
                      id="fechaFin"
                      formControlName="fechaFin">
                    <small class="form-text text-muted">
                      Dejar vacío si es un tratamiento indefinido
                    </small>
                  </div>
                </div>
                
                <!-- Indicaciones -->
                <div class="mb-3">
                  <label for="indicaciones" class="form-label">
                    <i class="fas fa-file-medical me-1"></i>
                    Indicaciones *
                  </label>
                  <textarea 
                    class="form-control"
                    id="indicaciones"
                    rows="3"
                    formControlName="indicaciones"
                    [class.is-invalid]="isFieldInvalid('indicaciones')"
                    placeholder="Ej: Para dolor de cabeza y fiebre. Tomar con alimentos.">
                  </textarea>
                  <div class="invalid-feedback" *ngIf="isFieldInvalid('indicaciones')">
                    Las indicaciones son requeridas
                  </div>
                </div>
                
                <!-- Observaciones -->
                <div class="mb-3">
                  <label for="observaciones" class="form-label">
                    <i class="fas fa-sticky-note me-1"></i>
                    Observaciones adicionales
                  </label>
                  <textarea 
                    class="form-control"
                    id="observaciones"
                    rows="2"
                    formControlName="observaciones"
                    placeholder="Notas adicionales, efectos secundarios observados, etc.">
                  </textarea>
                </div>
                
                <!-- Estado activo -->
                <div class="mb-3">
                  <div class="form-check">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      id="activo"
                      formControlName="activo">
                    <label class="form-check-label" for="activo">
                      <i class="fas fa-toggle-on me-1"></i>
                      Medicación activa
                    </label>
                  </div>
                  <small class="form-text text-muted">
                    Desmarcar si la medicación está pausada o suspendida
                  </small>
                </div>
                
                <!-- Botones -->
                <div class="d-flex justify-content-between">
                  <button 
                    type="button" 
                    class="btn btn-secondary"
                    (click)="cancelar()">
                    <i class="fas fa-times me-1"></i>
                    Cancelar
                  </button>
                  
                  <button 
                    type="submit" 
                    class="btn btn-primary"
                    [disabled]="medicacionForm.invalid || guardando">
                    <span *ngIf="guardando" class="spinner-border spinner-border-sm me-2"></span>
                    <i *ngIf="!guardando" class="fas fa-save me-1"></i>
                    {{ guardando ? 'Guardando...' : (esEdicion ? 'Actualizar' : 'Guardar') }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .card-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 10px 10px 0 0;
    }
    
    .form-label {
      font-weight: 600;
      color: #495057;
    }
    
    .form-control, .form-select {
      border-radius: 6px;
      border: 1px solid #ced4da;
      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
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
    
    .btn-primary:hover {
      background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
      transform: translateY(-1px);
    }
    
    .invalid-feedback {
      font-size: 0.875em;
    }
    
    .form-check-input:checked {
      background-color: #667eea;
      border-color: #667eea;
    }
    
    .spinner-border-sm {
      width: 1rem;
      height: 1rem;
    }
  `]
})
export class FormularioMedicacionComponent implements OnInit {

  medicacionForm: FormGroup;
  esEdicion = false;
  medicacionId?: number;
  guardando = false;

  constructor(
    private fb: FormBuilder,
    private medicacionService: MedicacionService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.medicacionForm = this.crearFormulario();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.esEdicion = true;
        this.medicacionId = +params['id'];
        this.cargarMedicacion();
      }
    });
  }

  crearFormulario(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      dosis: ['', [Validators.required]],
      frecuencia: ['', [Validators.required]],
      frecuenciaPersonalizada: [''],
      fechaInicio: ['', [Validators.required]],
      fechaFin: [''],
      indicaciones: ['', [Validators.required, Validators.minLength(10)]],
      medicoPrescriptor: ['', [Validators.required, Validators.minLength(3)]],
      observaciones: [''],
      activo: [true]
    });
  }

  cargarMedicacion(): void {
    if (this.medicacionId) {
      this.medicacionService.obtenerMedicacionPorId(this.medicacionId).subscribe({
        next: (medicacion) => {
          this.llenarFormulario(medicacion);
        },
        error: (error) => {
          console.error('Error al cargar medicación:', error);
          this.router.navigate(['/medicaciones']);
        }
      });
    }
  }

  llenarFormulario(medicacion: Medicacion): void {
    // Verificar si la frecuencia es personalizada
    const frecuenciasStandard = [
      'Una vez al día', 'Cada 12 horas', 'Cada 8 horas', 
      'Cada 6 horas', 'Cada 4 horas', 'Según necesidad'
    ];
    
    const esPersonalizada = !frecuenciasStandard.includes(medicacion.frecuencia);
    
    this.medicacionForm.patchValue({
      nombre: medicacion.nombre,
      dosis: medicacion.dosis,
      frecuencia: esPersonalizada ? 'Personalizada' : medicacion.frecuencia,
      frecuenciaPersonalizada: esPersonalizada ? medicacion.frecuencia : '',
      fechaInicio: this.formatearFechaParaInput(medicacion.fechaInicio),
      fechaFin: medicacion.fechaFin ? this.formatearFechaParaInput(medicacion.fechaFin) : '',
      indicaciones: medicacion.indicaciones,
      medicoPrescriptor: medicacion.medicoPrescriptor,
      observaciones: medicacion.observaciones || '',
      activo: medicacion.activo
    });
  }

  onSubmit(): void {
    if (this.medicacionForm.valid) {
      this.guardando = true;
      const medicacionData = this.prepararDatos();
      
      const operacion = this.esEdicion 
        ? this.medicacionService.actualizarMedicacion(this.medicacionId!, medicacionData)
        : this.medicacionService.registrarMedicacion(medicacionData);
      
      operacion.subscribe({
        next: () => {
          this.guardando = false;
          this.router.navigate(['/medicaciones']);
        },
        error: (error) => {
          console.error('Error al guardar medicación:', error);
          this.guardando = false;
        }
      });
    } else {
      this.marcarCamposComoTocados();
    }
  }

  prepararDatos(): Medicacion {
    const formValue = this.medicacionForm.value;
    
    // Determinar la frecuencia final
    const frecuencia = formValue.frecuencia === 'Personalizada' 
      ? formValue.frecuenciaPersonalizada 
      : formValue.frecuencia;
    
    return {
      nombre: formValue.nombre.trim(),
      dosis: formValue.dosis.trim(),
      frecuencia: frecuencia.trim(),
      fechaInicio: new Date(formValue.fechaInicio),
      fechaFin: formValue.fechaFin ? new Date(formValue.fechaFin) : undefined,
      indicaciones: formValue.indicaciones.trim(),
      medicoPrescriptor: formValue.medicoPrescriptor.trim(),
      observaciones: formValue.observaciones?.trim() || undefined,
      activo: formValue.activo
    };
  }

  cancelar(): void {
    this.router.navigate(['/medicaciones']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.medicacionForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  marcarCamposComoTocados(): void {
    Object.keys(this.medicacionForm.controls).forEach(key => {
      this.medicacionForm.get(key)?.markAsTouched();
    });
  }

  formatearFechaParaInput(fecha: Date): string {
    const fechaObj = new Date(fecha);
    const year = fechaObj.getFullYear();
    const month = String(fechaObj.getMonth() + 1).padStart(2, '0');
    const day = String(fechaObj.getDate()).padStart(2, '0');
    const hours = String(fechaObj.getHours()).padStart(2, '0');
    const minutes = String(fechaObj.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
}