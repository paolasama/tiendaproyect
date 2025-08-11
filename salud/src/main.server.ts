import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component'; // Importa el componente correcto
import { appConfig } from './app/app.config'; // Configuración del cliente
import { provideClientHydration } from '@angular/platform-browser';

// Configuración específica para SSR
const serverConfig = {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideClientHydration() // Añade hidratación para SSR
  ]
};

const bootstrap = () => bootstrapApplication(AppComponent, serverConfig);

export default bootstrap;