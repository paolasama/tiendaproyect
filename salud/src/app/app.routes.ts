import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  // Página de inicio
  { path: '', component: HomeComponent },
  
  // Ruta principal - Dashboard
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },

  // Rutas de Medicaciones
  {
    path: 'medicaciones',
    loadComponent: () => import('./components/medicacion/lista-medicaciones.component').then(m => m.ListaMedicacionesComponent)
  },
  {
    path: 'medicaciones/nueva',
    loadComponent: () => import('./components/medicacion/formulario-medicacion.component').then(m => m.FormularioMedicacionComponent)
  },
  {
    path: 'medicaciones/editar/:id',
    loadComponent: () => import('./components/medicacion/formulario-medicacion.component').then(m => m.FormularioMedicacionComponent)
  },
  {
    path: 'medicaciones/:id',
    loadComponent: () => import('./components/medicacion/detalle-medicacion.component').then(m => m.DetalleMedicacionComponent)
  },

  // Rutas de Alergias
  {
    path: 'alergias',
    loadComponent: () => import('./components/alergia/lista-alergias.component').then(m => m.ListaAlergiasComponent)
  },
  {
    path: 'alergias/nueva',
    loadComponent: () => import('./components/alergia/formulario-alergia.component').then(m => m.FormularioAlergiaComponent)
  },
  {
    path: 'alergias/editar/:id',
    loadComponent: () => import('./components/alergia/formulario-alergia.component').then(m => m.FormularioAlergiaComponent)
  },
  {
    path: 'alergias/:id',
    loadComponent: () => import('./components/alergia/detalle-alergia.component').then(m => m.DetalleAlergiaComponent)
  },

  // Rutas de Notas Médicas
  {
    path: 'notas-medicas',
    loadComponent: () => import('./components/nota-medica/lista-notas-medicas.component').then(m => m.ListaNotasMedicasComponent)
  },
  {
    path: 'notas-medicas/nueva',
    loadComponent: () => import('./components/nota-medica/formulario-nota-medica.component').then(m => m.FormularioNotaMedicaComponent)
  },
  {
    path: 'notas-medicas/editar/:id',
    loadComponent: () => import('./components/nota-medica/formulario-nota-medica.component').then(m => m.FormularioNotaMedicaComponent)
  },
  {
    path: 'notas-medicas/:id',
    loadComponent: () => import('./components/nota-medica/detalle-nota-medica.component').then(m => m.DetalleNotaMedicaComponent)
  },

  // Rutas de Empleados
  {
    path: 'empleados',
    loadComponent: () => import('./components/empleado/lista-empleados.component').then(m => m.ListaEmpleadosComponent)
  },

  // Ruta de configuración (futura)
  {
    path: 'configuracion',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent) // Temporal
  },

  // Ruta wildcard - debe ir al final
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
