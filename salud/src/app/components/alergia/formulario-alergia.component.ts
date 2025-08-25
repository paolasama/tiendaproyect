import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlergiaService } from '../../services/alergia.service';
import { Alergia, TipoAlergia, SeveridadAlergia } from '../../models/alergia.model';

@Component({
  selector: 'app-formulario-alergia',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="card">
            <div class="card-header">
              <h3 class="mb-0">
                <i class="fas fa-allergies me-2"></i>
                {{ esEdicion ? 'Editar Alergia' : 'Nueva Alergia' }}
              </h3>
            </div>
            
            <div class="card-body">
              <form [formGroup]="alergiaForm" (ngSubmit)="onSubmit()">
                <!-- Información básica -->
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="alergeno" class="form-label">
                      <i class="fas fa-exclamation-triangle me-1"></i>
                      Alérgeno *
                    </label>
                    <input 
                      type="text" 
                      class="form-control"
                      id="alergeno"
                      formControlName="alergeno"
                      [class.is-invalid]="isFieldInvalid('alergeno')"
                      placeholder="Ej: Penicilina, Maní, Polen">
                    <div class="invalid-feedback" *ngIf="isFieldInvalid('alergeno')">
                      El alérgeno es requerido
                    </div>
                  </div>
                  
                  <div class="col-md-6 mb-3">
                    <label for="tipo" class="form-label">
                      <i class="fas fa-tag me-1"></i>
                      Tipo de alergia *
                    </label>
                    <select 
                      class="form-select"
                      id="tipo"
                      formControlName="tipo"
                      [class.is-invalid]="isFieldInvalid('tipo')">
                      <option value="">Seleccionar tipo</option>
                      <option value="MEDICINAL">Medicinal</option>
                      <option value="ALIMENTARIA">Alimentaria</option>
                      <option value="AMBIENTAL">Ambiental</option>
                      <option value="CONTACTO">Contacto</option>
                      <option value="OTRA">Otra</option>
                    </select>
                    <div class="invalid-feedback" *ngIf="isFieldInvalid('tipo')">
                      El tipo de alergia es requerido
                    </div>
                  </div>
                </div>
                
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="severidad" class="form-label">
                      <i class="fas fa-thermometer-half me-1"></i>
                      Severidad *
                    </label>
                    <select 
                      class="form-select"
                      id="severidad"
                      formControlName="severidad"
                      [class.is-invalid]="isFieldInvalid('severidad')"
                      (change)="onSeveridadChange()">
                      <option value="">Seleccionar severidad</option>
                      <option value="LEVE">Leve</option>
                      <option value="MODERADA">Moderada</option>
                      <option value="SEVERA">Severa</option>
                      <option value="CRITICA">Crítica</option>
                    </select>
                    <div class="invalid-feedback" *ngIf="isFieldInvalid('severidad')">
                      La severidad es requerida
                    </div>
                    <small class="form-text text-muted" *ngIf="alergiaForm.get('severidad')?.value">
                      {{ obtenerDescripcionSeveridad(alergiaForm.get('severidad')?.value) }}
                    </small>
                  </div>
                  
                  <div class="col-md-6 mb-3">
                    <label for="fechaDiagnostico" class="form-label">
                      <i class="fas fa-calendar-alt me-1"></i>
                      Fecha de diagnóstico *
                    </label>
                    <input 
                      type="date" 
                      class="form-control"
                      id="fechaDiagnostico"
                      formControlName="fechaDiagnostico"
                      [class.is-invalid]="isFieldInvalid('fechaDiagnostico')"
                      [max]="fechaMaxima">
                    <div class="invalid-feedback" *ngIf="isFieldInvalid('fechaDiagnostico')">
                      La fecha de diagnóstico es requerida
                    </div>
                  </div>
                </div>
                
                <!-- Síntomas -->
                <div class="mb-3">
                  <label for="sintomas" class="form-label">
                    <i class="fas fa-notes-medical me-1"></i>
                    Síntomas *
                  </label>
                  <textarea 
                    class="form-control"
                    id="sintomas"
                    rows="3"
                    formControlName="sintomas"
                    [class.is-invalid]="isFieldInvalid('sintomas')"
                    placeholder="Describe los síntomas que se presentan (ej: erupción cutánea, dificultad respiratoria, hinchazón)">
                  </textarea>
                  <div class="invalid-feedback" *ngIf="isFieldInvalid('sintomas')">
                    Los síntomas son requeridos
                  </div>
                  <div class="form-text">
                    Caracteres: {{ alergiaForm.get('sintomas')?.value?.length || 0 }}/500
                  </div>
                </div>
                
                <!-- Tratamiento -->
                <div class="mb-3">
                  <label for="tratamiento" class="form-label">
                    <i class="fas fa-prescription-bottle-alt me-1"></i>
                    Tratamiento recomendado
                  </label>
                  <textarea 
                    class="form-control"
                    id="tratamiento"
                    rows="2"
                    formControlName="tratamiento"
                    placeholder="Medicamentos, medidas preventivas, tratamiento de emergencia, etc.">
                  </textarea>
                  <div class="form-text">
                    Caracteres: {{ alergiaForm.get('tratamiento')?.value?.length || 0 }}/300
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
                    placeholder="Notas adicionales, factores desencadenantes, etc.">
                  </textarea>
                  <div class="form-text">
                    Caracteres: {{ alergiaForm.get('observaciones')?.value?.length || 0 }}/300
                  </div>
                </div>
                
                <!-- Alertas de severidad -->
                <div class="alert" [ngClass]="obtenerClaseAlerta()" *ngIf="mostrarAlerta()">
                  <i class="fas fa-exclamation-triangle me-2"></i>
                  <strong>{{ obtenerTituloAlerta() }}</strong>
                  {{ obtenerMensajeAlerta() }}
                </div>
                
                <!-- Estado activo -->
                <div class="mb-3">
                  <div class="form-check">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      id="activa"
                      formControlName="activa">
                    <label class="form-check-label" for="activa">
                      <i class="fas fa-toggle-on me-1"></i>
                      Alergia activa
                    </label>
                  </div>
                  <small class="form-text text-muted">
                    Desmarcar si la alergia ya no es relevante o ha sido superada
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
                    [disabled]="alergiaForm.invalid || guardando">
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
    
    .alert {
      border-radius: 8px;
      border: none;
    }
    
    .form-text {
      font-size: 0.8em;
    }
  `]
})
export class FormularioAlergiaComponent implements OnInit {

  alergiaForm: FormGroup;
  esEdicion = false;
  alergiaId?: number;
  guardando = false;
  fechaMaxima: string;

  constructor(
    private fb: FormBuilder,
    private alergiaService: AlergiaService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.alergiaForm = this.crearFormulario();
    this.fechaMaxima = new Date().toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.esEdicion = true;
        this.alergiaId = +params['id'];
        this.cargarAlergia();
      }
    });
  }

  crearFormulario(): FormGroup {
    return this.fb.group({
      alergeno: ['', [Validators.required, Validators.minLength(2)]],
      tipo: ['', [Validators.required]],
      severidad: ['', [Validators.required]],
      sintomas: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      tratamiento: ['', [Validators.maxLength(300)]],
      observaciones: ['', [Validators.maxLength(300)]],
      fechaDiagnostico: ['', [Validators.required]],
      activa: [true]
    });
  }

  cargarAlergia(): void {
    if (this.alergiaId) {
      this.alergiaService.obtenerAlergiaPorId(this.alergiaId).subscribe({
        next: (alergia) => {
          this.llenarFormulario(alergia);
        },
        error: (error) => {
          console.error('Error al cargar alergia:', error);
          this.router.navigate(['/alergias']);
        }
      });
    }
  }

  llenarFormulario(alergia: Alergia): void {
    this.alergiaForm.patchValue({
      alergeno: alergia.alergeno,
      tipo: alergia.tipo,
      severidad: alergia.severidad,
      sintomas: alergia.sintomas,
      tratamiento: alergia.tratamiento || '',
      observaciones: alergia.observaciones || '',
      fechaDiagnostico: this.formatearFechaParaInput(alergia.fechaDiagnostico),
      activa: alergia.activo
    });
  }

  onSubmit(): void {
    if (this.alergiaForm.valid) {
      this.guardando = true;
      const alergiaData = this.prepararDatos();
      
      const operacion = this.esEdicion 
        ? this.alergiaService.actualizarAlergia(this.alergiaId!, alergiaData)
        : this.alergiaService.registrarAlergia(alergiaData);
      
      operacion.subscribe({
        next: () => {
          this.guardando = false;
          this.router.navigate(['/alergias']);
        },
        error: (error) => {
          console.error('Error al guardar alergia:', error);
          this.guardando = false;
        }
      });
    } else {
      this.marcarCamposComoTocados();
    }
  }

  prepararDatos(): Alergia {
    const formValue = this.alergiaForm.value;
    
    return {
      alergeno: formValue.alergeno.trim(),
      tipo: formValue.tipo as TipoAlergia,
      severidad: formValue.severidad as SeveridadAlergia,
      sintomas: formValue.sintomas.trim(),
      tratamiento: formValue.tratamiento?.trim() || undefined,
      observaciones: formValue.observaciones?.trim() || undefined,
      fechaDiagnostico: new Date(formValue.fechaDiagnostico),
      activo: formValue.activa
    };
  }

  onSeveridadChange(): void {
    // Lógica adicional cuando cambia la severidad
    const severidad = this.alergiaForm.get('severidad')?.value;
    if (severidad === 'CRITICA') {
      // Sugerir que se marque como activa si es crítica
      this.alergiaForm.patchValue({ activa: true });
    }
  }

  cancelar(): void {
    this.router.navigate(['/alergias']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.alergiaForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  marcarCamposComoTocados(): void {
    Object.keys(this.alergiaForm.controls).forEach(key => {
      this.alergiaForm.get(key)?.markAsTouched();
    });
  }

  formatearFechaParaInput(fecha: Date): string {
    const fechaObj = new Date(fecha);
    const year = fechaObj.getFullYear();
    const month = String(fechaObj.getMonth() + 1).padStart(2, '0');
    const day = String(fechaObj.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

  obtenerDescripcionSeveridad(severidad: SeveridadAlergia): string {
    const descripciones = {
      'LEVE': 'Síntomas menores, no requiere atención médica inmediata',
      'MODERADA': 'Síntomas molestos que pueden requerir medicación',
      'SEVERA': 'Síntomas importantes que requieren atención médica',
      'CRITICA': 'Reacción potencialmente mortal, requiere atención de emergencia'
    };
    return descripciones[severidad] || '';
  }

  mostrarAlerta(): boolean {
    const severidad = this.alergiaForm.get('severidad')?.value;
    return severidad === 'SEVERA' || severidad === 'CRITICA';
  }

  obtenerClaseAlerta(): string {
    const severidad = this.alergiaForm.get('severidad')?.value;
    if (severidad === 'CRITICA') {
      return 'alert-danger';
    } else if (severidad === 'SEVERA') {
      return 'alert-warning';
    }
    return 'alert-info';
  }

  obtenerTituloAlerta(): string {
    const severidad = this.alergiaForm.get('severidad')?.value;
    if (severidad === 'CRITICA') {
      return 'Alergia Crítica:';
    } else if (severidad === 'SEVERA') {
      return 'Alergia Severa:';
    }
    return 'Importante:';
  }

  obtenerMensajeAlerta(): string {
    const severidad = this.alergiaForm.get('severidad')?.value;
    if (severidad === 'CRITICA') {
      return 'Esta alergia puede causar reacciones potencialmente mortales. Asegúrese de tener un plan de emergencia y medicación de rescate disponible.';
    } else if (severidad === 'SEVERA') {
      return 'Esta alergia puede causar síntomas importantes. Consulte con su médico sobre medidas preventivas y tratamiento.';
    }
    return '';
  }
}