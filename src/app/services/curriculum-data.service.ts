import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CurriculumDataService {
  private readonly http = inject(HttpClient);

  readonly levels = signal<any[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  constructor() {
    this.loadCurriculum();
  }

  loadCurriculum(): void {
    this.isLoading.set(true);
    // Intento 1: ruta relativa public
    this.http.get<any[]>('data/curriculum-bgu.json').subscribe({
      next: (data) => {
        this.levels.set(data || []);
        this.isLoading.set(false);
      },
      error: () => {
        // Intento 2: fallback ruta absoluta
        this.http.get<any[]>('/data/curriculum-bgu.json').subscribe({
          next: (data) => {
            this.levels.set(data || []);
            this.isLoading.set(false);
          },
          error: (err) => {
            console.error('Error cargando el catálogo completo:', err);
            this.error.set('No se pudo cargar el archivo curricular.');
            this.isLoading.set(false);
          }
        });
      }
    });
  }
}