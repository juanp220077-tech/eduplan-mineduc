import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiKeyService } from '../../services/api-key.service';

@Component({
  selector: 'app-api-key-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        
        <div class="bg-slate-900 p-5 text-white flex justify-between items-start border-b border-slate-800">
          <div>
            <span class="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
              🔒 100% Gratuito y Privado
            </span>
            <h3 class="text-base font-bold text-slate-100">Configurar Llave IA (Groq Cloud)</h3>
            <p class="text-slate-400 text-xs mt-0.5">Usa tu propia clave para generar planificaciones sin límites ni costo.</p>
          </div>
          <button (click)="close.emit()" class="text-slate-400 hover:text-white text-2xl font-bold leading-none p-1">&times;</button>
        </div>

        <div class="p-6 overflow-y-auto space-y-4 text-slate-700 text-xs">
          <div class="bg-blue-50 border-l-4 border-blue-600 p-3 rounded-r-lg text-blue-900 leading-relaxed">
            EduPlan no almacena tu información en servidores externos. Tu clave se guarda de manera segura únicamente en tu navegador.
          </div>

          <div class="space-y-2.5">
            <p class="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Pasos para obtener tu clave gratuita:</p>
            <div class="p-2.5 bg-slate-50 border rounded-lg">
              <strong>1.</strong> Entra a <a href="https://console.groq.com/keys" target="_blank" class="text-indigo-600 font-bold hover:underline">console.groq.com/keys ↗</a> con tu cuenta Google.
            </div>
            <div class="p-2.5 bg-slate-50 border rounded-lg">
              <strong>2.</strong> Haz clic en <strong>"+ Create API Key"</strong> y copia el código que empieza con <code class="font-mono bg-indigo-50 text-indigo-700 font-bold px-1">gsk_...</code>.
            </div>
          </div>

          <div class="pt-2">
            <label class="block font-bold text-slate-800 mb-1">Pega aquí tu clave API:</label>
            <input 
              type="password" 
              [(ngModel)]="tempKey" 
              placeholder="gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" 
              class="w-full px-3 py-2 rounded-lg border font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              [ngClass]="{'border-red-400': tempKey && !isValidFormat(), 'border-slate-300': !tempKey || isValidFormat()}"
            />
            @if (tempKey && !isValidFormat()) {
              <p class="text-red-600 font-medium mt-1 text-[11px]">La clave debe comenzar con "gsk_" y tener más de 20 caracteres.</p>
            }
          </div>
        </div>

        <div class="bg-slate-50 px-6 py-3 flex items-center justify-between border-t border-slate-200">
          <div>
            @if (apiKeyService.hasValidKey()) {
              <button (click)="onDeleteKey()" class="text-xs text-red-600 hover:text-red-800 underline font-semibold">
                Eliminar clave
              </button>
            }
          </div>
          <div class="flex gap-2">
            <button (click)="close.emit()" class="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg">
              Cerrar
            </button>
            <button 
              (click)="onSave()" 
              [disabled]="!isValidFormat()"
              class="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg shadow">
              Guardar Clave
            </button>
          </div>
        </div>

      </div>
    </div>
  `
})
export class ApiKeyModalComponent {
  @Output() close = new EventEmitter<void>();
  apiKeyService = inject(ApiKeyService);
  tempKey = this.apiKeyService.apiKey();

  isValidFormat(): boolean {
    return this.tempKey.trim().startsWith('gsk_') && this.tempKey.trim().length > 20;
  }

  onSave(): void {
    if (this.isValidFormat()) {
      this.apiKeyService.saveKey(this.tempKey);
      this.close.emit();
    }
  }

  onDeleteKey(): void {
    this.apiKeyService.clearKey();
    this.tempKey = '';
    this.close.emit();
  }
}