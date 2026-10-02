import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlanningService } from '../services/planning.service';
import { DocumentExportService } from '../services/document-export.service';
import { OFFICIAL_INSERTIONS, CurricularInsertion } from '../models/lesson-plan.model';

@Component({
  selector: 'app-workspace-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (!plan()) {
      <div class="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
        <p class="text-sm font-semibold text-slate-500">
          Selecciona una Destreza en el panel izquierdo y presiona "Estructurar Planificación Didáctica".
        </p>
      </div>
    } @else {
      <div class="space-y-4">
        <!-- Barra de herramientas superior -->
        <div class="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm print:hidden">
          <div class="flex items-center gap-2">
            <button
              type="button"
              (click)="activeView = 'cards'"
              [class]="activeView === 'cards' 
                ? 'px-3.5 py-1.5 text-xs font-bold bg-slate-900 text-white rounded-lg shadow' 
                : 'px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg'">
              Vista Didáctica (Tarjetas ERCA)
            </button>
            <button
              type="button"
              (click)="activeView = 'table'"
              [class]="activeView === 'table' 
                ? 'px-3.5 py-1.5 text-xs font-bold bg-slate-900 text-white rounded-lg shadow' 
                : 'px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg'">
              Vista Oficial MinEduc (Tabla)
            </button>
          </div>

          <div class="flex items-center gap-2">
            <button 
              type="button"
              (click)="exportDocx()" 
              class="px-3.5 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition">
              Descargar Word (.docx)
            </button>
            <button 
              type="button"
              (click)="copyText()" 
              class="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition">
              Copiar Texto
            </button>
            <button 
              type="button"
              (click)="printPdf()" 
              class="px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow transition">
              Imprimir / PDF
            </button>
          </div>
        </div>

        <!-- Banner de Inserciones Curriculares con Iconografía Oficial -->
        <div class="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 flex flex-wrap items-center gap-2">
          <span class="text-xs font-bold text-amber-950">Competencias e Inserciones:</span>
          @for (ins of getInsertionsObjects(); track ins.code) {
            <span 
              [style.backgroundColor]="ins.colorBg"
              [style.color]="ins.colorText"
              class="px-2 py-0.5 rounded font-black text-[11px] shadow-sm tracking-wide">
              {{ ins.code }}
            </span>
          }
          <div class="text-xs text-amber-950 flex-1 ml-2">
            <span contenteditable="true" class="outline-none hover:bg-amber-100/50 rounded px-1 cursor-text">
              {{ plan()?.header?.insertionConnection }}
            </span>
          </div>
        </div>

        <!-- VISTA DIDÁCTICA (TARJETAS ERCA EDITABLES) -->
        @if (activeView === 'cards') {
          <div class="space-y-4">
            @for (st of plan()?.stages; track st.stage) {
              <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
                <div class="flex items-center justify-between border-b pb-2">
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase"
                          [ngClass]="{
                            'bg-amber-100 text-amber-900': st.stage === 'experiencia',
                            'bg-purple-100 text-purple-900': st.stage === 'reflexion',
                            'bg-blue-100 text-blue-900': st.stage === 'conceptualizacion',
                            'bg-emerald-100 text-emerald-900': st.stage === 'aplicacion'
                          }">
                      {{ st.stage }}
                    </span>
                    <h3 class="text-xs font-bold text-slate-800 uppercase">{{ st.title }}</h3>
                  </div>
                  <span class="text-xs text-slate-500 font-mono">{{ st.durationMinutes }} min</span>
                </div>

                <div>
                  <span class="block text-[11px] font-semibold text-slate-400 mb-1">
                    Actividad mediada (clic para editar):
                  </span>
                  <div 
                    contenteditable="true" 
                    class="text-xs text-slate-700 leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-200 hover:border-indigo-300 focus:bg-white focus:border-indigo-500 outline-none cursor-text">
                    {{ st.activity }}
                  </div>
                </div>

                @if (st.guidingQuestions && st.guidingQuestions.length > 0) {
                  <div class="space-y-1">
                    <span class="block text-[11px] font-semibold text-slate-500">Preguntas generadoras:</span>
                    <ul class="list-disc list-inside text-xs text-slate-600 space-y-1 pl-1">
                      @for (q of st.guidingQuestions; track q) {
                        <li contenteditable="true" class="outline-none hover:bg-slate-100 rounded px-1">{{ q }}</li>
                      }
                    </ul>
                  </div>
                }

                @if (st.dua) {
                  <div class="bg-emerald-50/80 border border-emerald-200 rounded-lg p-3 space-y-1">
                    <div class="flex items-center gap-1.5">
                      <span class="bg-emerald-200 text-emerald-900 text-[10px] font-bold px-1.5 py-0.5 rounded">DUA</span>
                      <span class="text-xs font-bold text-emerald-900">{{ st.dua.title }}</span>
                    </div>
                    <p contenteditable="true" class="text-xs text-emerald-800 outline-none cursor-text">
                      {{ st.dua.strategy }}
                    </p>
                  </div>
                }
              </div>
            }
          </div>
        }

        <!-- VISTA OFICIAL MINEDUC (TABLA CON OBJETIVOS Y CRITERIOS) -->
        @if (activeView === 'table') {
          <div class="bg-white border-2 border-slate-800 shadow-md p-6 font-sans text-slate-900 text-xs space-y-4">
            
            <!-- Encabezado Institucional -->
            <div class="border-b-2 border-slate-800 pb-3 text-center space-y-1">
              <h2 contenteditable="true" class="text-sm font-black uppercase tracking-wider outline-none cursor-text">
                UNIDAD EDUCATIVA
              </h2>
              <p contenteditable="true" class="text-[11px] font-semibold text-slate-600 outline-none cursor-text">
                PLANIFICACIÓN MICROCURRICULAR DE CLASE
              </p>
            </div>

            <!-- Datos Informativos -->
            <div class="border border-slate-800 text-xs">
              <div class="grid grid-cols-3 divide-x divide-y border-slate-800">
                <div class="p-1.5">
                  <strong>Docente:</strong>
                  <span contenteditable="true" class="outline-none px-1">{{ plan()?.header?.teacher }}</span>
                </div>
                <div class="p-1.5">
                  <strong>Asignatura:</strong>
                  <span contenteditable="true" class="outline-none px-1">{{ plan()?.header?.subject }}</span>
                </div>
                <div class="p-1.5">
                  <strong>Paralelo:</strong>
                  <span contenteditable="true" class="outline-none px-1">{{ plan()?.header?.parallel }}</span>
                </div>
                <div class="p-1.5 col-span-2">
                  <strong>Unidad / Tema:</strong>
                  <span contenteditable="true" class="outline-none px-1 font-semibold text-indigo-950">{{ plan()?.header?.topic }}</span>
                </div>
                <div class="p-1.5">
                  <strong>Duración:</strong>
                  <span contenteditable="true" class="outline-none px-1">
                    {{ plan()?.header?.periods }} hora(s) clase ({{ (plan()?.header?.periods || 1) * (plan()?.header?.periodDuration || 40) }} min)
                  </span>
                </div>
                <div class="p-1.5 col-span-3">
                  <strong>Fecha:</strong>
                  <span contenteditable="true" class="outline-none px-1 italic text-slate-500">[Clic para escribir fecha]</span>
                </div>
              </div>

              <!-- Bloque Oficial: Objetivos de la Unidad y Criterios de Evaluación -->
              <div class="border-t border-slate-800 p-2 bg-slate-50 space-y-1.5">
                <div>
                  <strong class="text-slate-900 block text-[11px]">Objetivos de la Unidad:</strong>
                  <p contenteditable="true" class="text-slate-700 italic outline-none cursor-text">
                    {{ getObjetivoSugerido() }}
                  </p>
                </div>
                <div class="border-t border-slate-200 pt-1">
                  <strong class="text-slate-900 block text-[11px]">Criterio de Evaluación:</strong>
                  <p contenteditable="true" class="text-slate-700 italic outline-none cursor-text">
                    {{ getCriterioSugerido() }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Matriz de Estrategias y Evaluación con Iconos -->
            <table class="w-full border-collapse border-2 border-slate-800 text-xs">
              <thead>
                <tr class="bg-slate-100 font-bold border-b border-slate-800 uppercase text-[10px]">
                  <th class="border border-slate-800 p-2 text-left w-1/4">DESTREZA CON CRITERIO DE DESEMPEÑO</th>
                  <th class="border border-slate-800 p-2 text-left w-2/4">ESTRATEGIAS METODOLÓGICAS (ERCA + DUA)</th>
                  <th class="border border-slate-800 p-2 text-left w-1/4">ACTIVIDADES EVALUATIVAS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="border border-slate-800 p-3 align-top font-medium leading-relaxed">
                    <!-- Iconografía de sellos oficiales -->
                    <div class="flex flex-wrap gap-1 mb-2">
                      @for (ins of getInsertionsObjects(); track ins.code) {
                        <span 
                          [style.backgroundColor]="ins.colorBg"
                          [style.color]="ins.colorText"
                          class="px-1.5 py-0.5 rounded text-[10px] font-black">
                          {{ ins.code }}
                        </span>
                      }
                    </div>
                    <div contenteditable="true" class="outline-none">
                      {{ plan()?.header?.topic }}
                    </div>
                  </td>
                  <td class="border border-slate-800 p-3 align-top space-y-3">
                    @for (st of plan()?.stages; track st.stage) {
                      <div class="border-b pb-2 last:border-b-0 last:pb-0">
                        <strong class="uppercase text-[11px] block text-slate-900">
                          {{ st.stage }} ({{ st.durationMinutes }} min):
                        </strong>
                        <p contenteditable="true" class="text-slate-700 leading-relaxed outline-none cursor-text">
                          {{ st.activity }}
                        </p>
                        @if (st.dua) {
                          <p contenteditable="true" class="text-[11px] text-emerald-800 italic mt-0.5 outline-none">
                            Adaptación DUA: {{ st.dua.strategy }}
                          </p>
                        }
                      </div>
                    }
                  </td>
                  <td class="border border-slate-800 p-3 align-top space-y-2">
                    <div>
                      <strong>Indicador de Evaluación:</strong>
                      <p contenteditable="true" class="text-slate-600 outline-none">{{ plan()?.evaluation?.indicator }}</p>
                    </div>
                    <div class="border-t pt-1">
                      <strong>Técnica / Instrumento:</strong>
                      <p contenteditable="true" class="text-slate-600 outline-none">
                        {{ plan()?.evaluation?.technique }} / {{ plan()?.evaluation?.instrument }}
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Firmas de Responsabilidad Editables -->
            <div class="border border-slate-800 mt-4 text-[10px]">
              <div class="grid grid-cols-3 divide-x border-slate-800 text-center">
                <div class="p-1.5 bg-slate-100 font-bold border-b border-slate-800">ELABORADO POR DOCENTE</div>
                <div class="p-1.5 bg-slate-100 font-bold border-b border-slate-800">REVISADO POR DIRECTOR/A</div>
                <div class="p-1.5 bg-slate-100 font-bold border-b border-slate-800">APROBADO POR VICERRECTOR/A</div>

                <div class="p-2 h-16 flex flex-col justify-between text-left">
                  <span>Nombre: {{ plan()?.header?.teacher }}</span>
                  <span>Firma: ________________</span>
                </div>
                <div class="p-2 h-16 flex flex-col justify-between text-left">
                  <span>Nombre:</span>
                  <span>Firma: ________________</span>
                </div>
                <div class="p-2 h-16 flex flex-col justify-between text-left">
                  <span>Nombre:</span>
                  <span>Firma: ________________</span>
                </div>
              </div>
            </div>

          </div>
        }
      </div>
    }
  `
})
export class WorkspacePanelComponent {
  private readonly planningService = inject(PlanningService);
  private readonly exportService = inject(DocumentExportService);

  readonly plan = this.planningService.currentPlan;
  activeView: 'cards' | 'table' = 'cards';

  getInsertionsObjects(): CurricularInsertion[] {
    const codes = this.plan()?.header?.insertions || ['CM'];
    return codes.map(c => OFFICIAL_INSERTIONS[c] || {
      code: c,
      name: c,
      colorBg: '#64748b',
      colorText: '#ffffff'
    });
  }

  // SUGERENCIA DE OBJETIVOS Y CRITERIOS SEGÚN EL TEMA Y ASIGNATURA
  getObjetivoSugerido(): string {
    const topic = (this.plan()?.header?.topic || '').toLowerCase();
    const subject = (this.plan()?.header?.subject || '').toLowerCase();

    if (subject.includes('matemát')) {
      if (topic.includes('cuadrát') || topic.includes('función')) {
        return 'O.M.5.1. Proponer soluciones creativas a situaciones concretas mediante modelos funcionales y algoritmos apropiados. / O.M.4.3. Representar y resolver ecuaciones de manera analítica y gráfica.';
      }
      if (topic.includes('vector') || topic.includes('recta')) {
        return 'O.M.5.2. Producir, comunicar y generalizar información de manera gráfica y tecnológica mediante conocimientos matemáticos. / OG.M.6. Desarrollar la curiosidad y creatividad para resolver problemas del entorno.';
      }
      return 'O.M.5.1. Proponer soluciones creativas a situaciones concretas mediante modelos funcionales. / O.M.5.3. Desarrollar estrategias de cálculo mental y escrito.';
    }

    if (subject.includes('física') || subject.includes('ciencias naturales')) {
      return 'O.CN.F.2. Comprender que la Física es un conjunto de teorías comprobables por medio de la experimentación. / O.CN.F.5. Describir los fenómenos naturales analizando sus magnitudes.';
    }

    return 'Desarrollar habilidades comunicativas y de pensamiento crítico aplicadas a la resolución de problemas en el entorno cotidiano.';
  }

  getCriterioSugerido(): string {
    const topic = (this.plan()?.header?.topic || '').toLowerCase();
    const subject = (this.plan()?.header?.subject || '').toLowerCase();

    if (subject.includes('matemát')) {
      if (topic.includes('cuadrát') || topic.includes('función')) {
        return 'CE.M.5.3. Opera y emplea funciones reales, lineales, cuadráticas y polinomiales para plantear situaciones cotidianas que puedan resolverse mediante modelos matemáticos con apoyo de las TIC.';
      }
      if (topic.includes('vector')) {
        return 'CE.M.5.6. Emplea vectores geométricos en el plano y operaciones en ℝ² con aplicaciones en física y en la ecuación de la recta mediante métodos analíticos y tecnológicos.';
      }
      return 'CE.M.5.1. Emplea conceptos básicos de las propiedades algebraicas de los números reales para optimizar procesos y resolver ejercicios de ecuaciones e inecuaciones.';
    }

    if (subject.includes('física')) {
      return 'CE.CN.F.5.1. Obtiene las magnitudes cinemáticas de un objeto que se mueve a lo largo de una trayectoria rectilínea elaborando tablas y gráficas en un sistema de referencia.';
    }

    return 'Aplica los principios disciplinares para argumentar y resolver situaciones comunicativas y de indagación científica.';
  }

  exportDocx(): void {
    const current = this.plan();
    if (current) this.exportService.exportToDocx(current);
  }

  copyText(): void {
    const current = this.plan();
    if (current) this.exportService.copyToClipboard(current);
  }

  printPdf(): void {
    window.print();
  }
}