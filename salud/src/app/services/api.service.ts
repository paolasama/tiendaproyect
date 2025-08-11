import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root' // Esto sigue siendo necesario
})
export class ApiService {
  private apiUrl = 'http://localhost:8080/api'; // Ajusta esta URL

  constructor(private http: HttpClient) { }

  // Método genérico para manejar errores
  private handleError(error: HttpErrorResponse) {
    console.error('Error en la petición:', error);
    return throwError(() => new Error('Error en la comunicación con el servidor'));
  }

  // Ejemplo de método GET
  getData<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`).pipe(
      catchError(this.handleError)
    );
  }

  // Ejemplo de método POST
  postData<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data).pipe(
      catchError(this.handleError)
    );
  }
}