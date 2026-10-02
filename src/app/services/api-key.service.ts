import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiKeyService {
  private readonly STORAGE_KEY = 'eduplan_groq_api_key';

  private apiKeySignal = signal<string>(this.getStoredKey());
  readonly apiKey = this.apiKeySignal.asReadonly();
  readonly hasValidKey = computed(() => {
    const key = this.apiKeySignal();
    return key.startsWith('gsk_') && key.length > 20;
  });

  private getStoredKey(): string {
    return localStorage.getItem(this.STORAGE_KEY) || '';
  }

  saveKey(key: string): void {
    const cleanKey = key.trim();
    localStorage.setItem(this.STORAGE_KEY, cleanKey);
    this.apiKeySignal.set(cleanKey);
  }

  clearKey(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.apiKeySignal.set('');
  }
}