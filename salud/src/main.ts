import 'zone.js'; // Necesario para la detección de cambios basada en zonas
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config'; // Asegúrate que el nombre coincida
import { AppComponent } from './app/app.component'; // Importa el componente correcto

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));