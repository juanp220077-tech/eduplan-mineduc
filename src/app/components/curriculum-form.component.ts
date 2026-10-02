import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurriculumDataService } from '../services/curriculum-data.service';
import { PlanningService } from '../services/planning.service';
import { ApiKeyService } from '../services/api-key.service';
import { CurricularDcd, LessonPlanHeader, OFFICIAL_INSERTIONS } from '../models/lesson-plan.model';

@Component({
  selector: 'app-curriculum-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div class="border-b pb-2">
        <h2 class="text-sm font-bold text-slate-800 uppercase tracking-wider">Parámetros Curriculares</h2>
        <p class="text-[11px] text-slate-500">Catálogo Oficial MinEduc Ecuador</p>
      </div>

      <!-- 1. Subnivel Educativo -->
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">1. Subnivel Educativo</label>
        <select 
          [ngModel]="selectedLevelId()" 
          (ngModelChange)="onLevelChange($event)"
          class="w-full text-xs rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border bg-slate-50">
          @for (lvl of levels(); track (lvl.id || lvl.name || $index)) {
            <option [value]="lvl.id || lvl.name">{{ lvl.name || lvl.nombre || lvl.id }}</option>
          }
        </select>
      </div>

      <!-- 2. Asignatura -->
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">2. Asignatura</label>
        <select 
          [ngModel]="selectedSubjectId()" 
          (ngModelChange)="onSubjectChange($event)"
          [disabled]="availableSubjects().length === 0"
          class="w-full text-xs rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border bg-slate-50 disabled:opacity-50">
          <option value="" disabled>Seleccione una asignatura...</option>
          @for (sub of availableSubjects(); track (sub.id || sub.name || $index)) {
            <option [value]="sub.id || sub.name">{{ sub.name || sub.nombre || sub.id }}</option>
          }
        </select>
      </div>

      <!-- 3. Criterio de Evaluación / Bloque Curricular -->
      @if (availableGroups().length > 0) {
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">3. Criterio de Evaluación / Bloque</label>
          <select 
            [ngModel]="selectedGroupId()" 
            (ngModelChange)="onGroupChange($event)"
            class="w-full text-xs rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border bg-slate-50">
            <option value="">Todos los criterios y bloques</option>
            @for (grp of availableGroups(); track (grp.id || grp.code || grp.name || $index)) {
              <option [value]="grp.id || grp.code || grp.name">
                {{ grp.code ? '[' + grp.code + '] ' : '' }}{{ grp.name || grp.description || grp.nombre }}
              </option>
            }
          </select>
        </div>
      }

      <!-- 4. Destreza con Criterio de Desempeño (DCD) Desagregada -->
      <div>
        <div class="flex items-center justify-between mb-1">
          <label class="block text-xs font-semibold text-slate-700">
            {{ availableGroups().length > 0 ? '4. DCD Oficial Desagregada' : '3. DCD Oficial Desagregada' }}
          </label>
          <span class="text-[10px] text-indigo-600 font-semibold">{{ filteredDcds().length }} disponible(s)</span>
        </div>
        
        <!-- Búsqueda rápida por código o texto -->
        <div class="relative mb-1.5">
          <input 
            type="text" 
            [ngModel]="filterText()" 
            (ngModelChange)="onFilterChange($event)"
            placeholder="🔍 Escribe código (ej. M.5.3.1, CN.4.1.2) o texto..." 
            class="w-full text-xs rounded-lg border-slate-300 shadow-sm py-1.5 pl-3 pr-8 border bg-slate-50 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500"
          />
          @if (filterText()) {
            <button 
              type="button" 
              (click)="clearFilter()" 
              class="absolute right-2 top-1.5 text-xs text-slate-400 hover:text-slate-700">
              ✕
            </button>
          }
        </div>

        <select 
          [ngModel]="selectedDestreza" 
          (ngModelChange)="onDestrezaSelected($event)"
          [disabled]="filteredDcds().length === 0"
          class="w-full text-xs rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border bg-slate-50 disabled:opacity-50">
          <option [ngValue]="null" disabled>
            {{ filteredDcds().length === 0 ? 'No se encontraron destrezas' : 'Seleccione la destreza a desarrollar...' }}
          </option>
          @for (dest of filteredDcds(); track (dest.code || dest.codigo || $index)) {
            <option [ngValue]="dest">
              [{{ dest.code || dest.codigo }}] {{ dest.description || dest.descripcion }}
            </option>
          }
        </select>
      </div>

      <!-- 5. Tema / Unidad Didáctica Sugerido (Editable) -->
      <div>
        <div class="flex items-center justify-between mb-1">
          <label class="block text-xs font-bold text-slate-800">Tema / Unidad Didáctica</label>
          <span class="text-[10px] text-slate-400 italic">Sugerido (editable)</span>
        </div>
        <input 
          type="text" 
          [(ngModel)]="temaUnidad" 
          placeholder="Ej: Ecuaciones e Inecuaciones / Estadística Descriptiva"
          class="w-full text-xs rounded-lg border-slate-300 shadow-sm py-1.5 px-3 border bg-slate-50 focus:bg-white focus:border-indigo-500"
        />
      </div>

      <!-- 6. Competencias e Inserciones Oficiales (Autoasignadas por DCD) -->
      <div class="pt-2 border-t border-slate-100">
        <div class="flex items-center justify-between mb-1.5">
          <label class="block text-xs font-bold text-slate-800">Competencias e Inserciones MinEduc</label>
          <span class="text-[10px] text-slate-500">Autoasignadas por DCD</span>
        </div>

        <div class="flex flex-wrap gap-1.5">
          @for (ins of officialInsertionsList; track ins.code) {
            <button
              type="button"
              (click)="toggleInsertion(ins.code)"
              [style.backgroundColor]="isInsertionSelected(ins.code) ? ins.colorBg : '#f8fafc'"
              [style.color]="isInsertionSelected(ins.code) ? ins.colorText : '#475569'"
              class="px-2 py-1 rounded-md text-[10px] font-bold border transition flex items-center gap-1 shadow-sm"
              [class.border-transparent]="isInsertionSelected(ins.code)"
              [class.border-slate-300]="!isInsertionSelected(ins.code)">
              <span>{{ ins.code }}</span>
              <span class="text-[9px] font-medium hidden sm:inline">{{ ins.name }}</span>
            </button>
          }
        </div>
      </div>

      <!-- Duración de la Clase Diaria -->
      <div class="pt-2 border-t border-slate-100 space-y-2">
        <label class="block text-xs font-bold text-slate-800">Duración de la Clase Diaria</label>
        <div class="grid grid-cols-2 gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <div>
            <label class="block text-[11px] font-semibold text-slate-700 mb-1">Horas Clase</label>
            <select 
              [(ngModel)]="horasClase" 
              class="w-full text-xs rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 py-1.5 px-2 border bg-white">
              <option [value]="1">1 hora clase (45 min)</option>
              <option [value]="2">2 horas clase (90 min)</option>
            </select>
          </div>
          <div>
            <label class="block text-[11px] font-semibold text-slate-700 mb-1">Minutos por hora</label>
            <select 
              [(ngModel)]="minutosPorHora" 
              class="w-full text-xs rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 py-1.5 px-2 border bg-white">
              <option [value]="45">45 minutos</option>
              <option [value]="40">40 minutos</option>
            </select>
          </div>
          <div class="col-span-2 text-[11px] text-indigo-800">
            ⏱ <strong>Tiempo de clase:</strong> {{ horasClase * minutosPorHora }} minutos de ciclo didáctico.
          </div>
        </div>
      </div>

      <!-- Datos del Docente -->
      <div class="grid grid-cols-2 gap-3 pt-1">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Docente</label>
          <input 
            type="text" 
            [(ngModel)]="docente" 
            class="w-full text-xs rounded-lg border-slate-300 shadow-sm py-1.5 px-2 border" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Paralelo</label>
          <input 
            type="text" 
            [(ngModel)]="paralelo" 
            class="w-full text-xs rounded-lg border-slate-300 shadow-sm py-1.5 px-2 border" />
        </div>
      </div>

      <!-- Botón de Generación -->
      <button 
        type="button"
        (click)="generar()"
        [disabled]="isGenerating() || !selectedDestreza"
        class="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-xl font-bold text-xs tracking-wide shadow transition flex items-center justify-center gap-2 mt-2">
        @if (isGenerating()) {
          <svg class="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Estructurando Planificación Didáctica...</span>
        } @else {
          <span>Estructurar Planificación Didáctica</span>
        }
      </button>
    </div>
  `
})
export class CurriculumFormComponent {
  private readonly curriculumService = inject(CurriculumDataService);
  private readonly planningService = inject(PlanningService);
  private readonly apiKeyService = inject(ApiKeyService);

  readonly levels = this.curriculumService.levels;
  readonly isGenerating = this.planningService.isGenerating;

  selectedLevelId = signal<string>('');
  selectedSubjectId = signal<string>('');
  selectedGroupId = signal<string>('');
  selectedDestreza: any = null;
  filterText = signal<string>('');
  temaUnidad = '';

  selectedInsertions = signal<string[]>(['CM']);
  readonly officialInsertionsList = Object.values(OFFICIAL_INSERTIONS);

  horasClase = 2;
  minutosPorHora = 40;

  docente = 'Docente Responsable';
  paralelo = 'A';

  // Subnivel seleccionado
  readonly availableSubjects = computed(() => {
    const lvlId = this.selectedLevelId();
    const all = this.levels();
    if (all.length === 0) return [];
    const current = all.find((l: any) => (l.id === lvlId || l.name === lvlId || l.nombre === lvlId)) || all[0];
    return current?.subjects || current?.asignaturas || [];
  });

  // Asignatura actual
  readonly currentSubject = computed(() => {
    const subId = this.selectedSubjectId();
    const subs = this.availableSubjects();
    if (subs.length === 0) return null;
    return subs.find((s: any) => (s.id === subId || s.name === subId || s.nombre === subId)) || subs[0];
  });

  // Grupos disponibles (busca criteria, topics o blocks indistintamente)
  readonly availableGroups = computed(() => {
    const sub = this.currentSubject();
    if (!sub) return [];
    return sub.criteria || sub.topics || sub.blocks || sub.bloques || [];
  });

  // Extracción exhaustiva de DCDs asegurando que NUNCA quede vacío
  readonly availableDcds = computed(() => {
    const sub = this.currentSubject();
    if (!sub) return [];

    const grpId = this.selectedGroupId();
    const groups = this.availableGroups();

    // 1. Si hay grupos (criteria, topics, blocks)
    if (groups.length > 0) {
      if (grpId) {
        const found = groups.find((g: any) => 
          g.code === grpId || g.id === grpId || g.name === grpId || g.description === grpId
        );
        return (found?.dcds || found?.destrezas || []).map((d: any) => ({
          ...d,
          parentGroup: found
        }));
      }
      return groups.flatMap((g: any) => (g.dcds || g.destrezas || []).map((d: any) => ({
        ...d,
        parentGroup: g
      })));
    }

    // 2. Si las destrezas están directamente bajo la asignatura
    return sub.dcds || sub.destrezas || [];
  });

  // Filtro que busca en tiempo real sin trabarse
  readonly filteredDcds = computed(() => {
    const list = this.availableDcds();
    const rawQuery = this.filterText().trim().toLowerCase();
    if (!rawQuery) return list;

    const cleanQuery = rawQuery.replace(/[\.\s\-_]/g, '');

    return list.filter((item: any) => {
      const code = (item.code || item.codigo || '').toLowerCase();
      const cleanCode = code.replace(/[\.\s\-_]/g, '');
      const desc = (item.description || item.descripcion || '').toLowerCase();

      return cleanCode.includes(cleanQuery) || desc.includes(rawQuery);
    });
  });

  constructor() {
    effect(() => {
      const allLevels = this.levels();
      if (allLevels.length > 0 && !this.selectedLevelId()) {
        const firstLvl = allLevels[0];
        this.selectedLevelId.set(firstLvl.id || firstLvl.name || '');
        const firstSub = (firstLvl.subjects || firstLvl.asignaturas || [])[0];
        if (firstSub) {
          this.selectedSubjectId.set(firstSub.id || firstSub.name || '');
          const firstGrp = (firstSub.criteria || firstSub.topics || firstSub.blocks || [])[0];
          if (firstGrp) {
            this.selectedGroupId.set(firstGrp.code || firstGrp.id || firstGrp.name || '');
          }
        }
        setTimeout(() => {
          const firstDcd = this.availableDcds()[0];
          if (firstDcd) this.onDestrezaSelected(firstDcd);
        }, 60);
      }
    });
  }

  onGroupChange(newGrpId: string): void {
    this.selectedGroupId.set(newGrpId);
    const dcds = this.availableDcds();
    if (dcds.length > 0) {
      this.onDestrezaSelected(dcds[0]);
    } else {
      this.selectedDestreza = null;
    }
  }

  onDestrezaSelected(dcd: any): void {
    this.selectedDestreza = dcd;
    if (!dcd) return;

    // Sugerencia de Tema / Unidad Didáctica
    if (dcd.parentGroup?.unitTopic) {
      this.temaUnidad = dcd.parentGroup.unitTopic;
    } else if (dcd.parentGroup?.name) {
      this.temaUnidad = dcd.parentGroup.name;
    }

    // Autoasignación de competencias e inserciones oficiales
    const inherent = dcd.insertions || dcd.inserciones || dcd.competencias || [];
    if (Array.isArray(inherent) && inherent.length > 0) {
      const normalized = inherent.map((c: string) => c === 'C' ? 'CC' : c);
      this.selectedInsertions.set(normalized);
      return;
    }

    // Detección automática de respaldo
    const code = (dcd.code || dcd.codigo || '').toUpperCase();
    if (code.startsWith('M.')) this.selectedInsertions.set(['CM']);
    else if (code.startsWith('EFL.')) this.selectedInsertions.set(['CC', 'CS']);
    else if (code.startsWith('LL.')) this.selectedInsertions.set(['CC']);
    else if (code.startsWith('CN.')) this.selectedInsertions.set(['AMB', 'CS']);
    else this.selectedInsertions.set(['CS']);
  }

  onFilterChange(text: string): void {
    this.filterText.set(text);
    const results = this.filteredDcds();
    if (results.length > 0) {
      this.onDestrezaSelected(results[0]);
    } else {
      this.selectedDestreza = null;
    }
  }

  clearFilter(): void {
    this.filterText.set('');
    const dcds = this.availableDcds();
    if (dcds[0]) this.onDestrezaSelected(dcds[0]);
  }

  toggleInsertion(code: string): void {
    const current = [...this.selectedInsertions()];
    const index = current.indexOf(code);
    if (index > -1) {
      if (current.length > 1) current.splice(index, 1);
    } else {
      current.push(code);
    }
    this.selectedInsertions.set(current);
  }

  isInsertionSelected(code: string): boolean {
    return this.selectedInsertions().includes(code);
  }

  onLevelChange(newLevelId: string): void {
    this.selectedLevelId.set(newLevelId);
    const firstSub = this.availableSubjects()[0];
    this.selectedSubjectId.set(firstSub?.id || firstSub?.name || '');
    const firstGrp = (firstSub?.criteria || firstSub?.topics || firstSub?.blocks || [])[0];
    this.selectedGroupId.set(firstGrp?.code || firstGrp?.id || firstGrp?.name || '');
    const firstDcd = this.availableDcds()[0];
    if (firstDcd) this.onDestrezaSelected(firstDcd);
  }

  onSubjectChange(newSubId: string): void {
    this.selectedSubjectId.set(newSubId);
    const firstGrp = (this.availableGroups() || [])[0];
    this.selectedGroupId.set(firstGrp?.code || firstGrp?.id || firstGrp?.name || '');
    const firstDcd = this.availableDcds()[0];
    if (firstDcd) this.onDestrezaSelected(firstDcd);
  }

  generar(): void {
    if (!this.apiKeyService.hasValidKey()) {
      alert('Por favor configure su clave de IA en la cabecera antes de generar.');
      return;
    }

    if (!this.selectedDestreza) {
      alert('Por favor seleccione una destreza curricular.');
      return;
    }

    const dcdStandard: CurricularDcd = {
      code: this.selectedDestreza.code || this.selectedDestreza.codigo || 'DCD.GEN',
      description: this.selectedDestreza.description || this.selectedDestreza.descripcion || '',
      indicator: this.selectedDestreza.indicator || this.selectedDestreza.indicador || '',
      insertions: this.selectedInsertions()
    };

    const currentSub = this.currentSubject();

    const headerData: LessonPlanHeader = {
      subject: currentSub?.name || currentSub?.nombre || 'Asignatura',
      topic: this.temaUnidad || dcdStandard.description,
      parallel: this.paralelo,
      teacher: this.docente,
      date: '',
      periods: Number(this.horasClase),
      periodDuration: Number(this.minutosPorHora),
      insertions: this.selectedInsertions()
    } as unknown as LessonPlanHeader;

    (headerData as any).criterion = this.selectedDestreza.parentGroup;

    this.planningService.generateFromCurriculum(headerData, dcdStandard);
  }
}