import { Injectable, inject, signal } from '@angular/core';
import { GeminiService } from './gemini.service';
import { LessonPlan, LessonPlanHeader, CurricularDcd } from '../models/lesson-plan.model';

@Injectable({
  providedIn: 'root'
})
export class PlanningService {
  private readonly geminiService = inject(GeminiService);

  readonly currentPlan = signal<LessonPlan | null>(null);
  readonly isGenerating = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  async generateFromCurriculum(
    header: LessonPlanHeader,
    dcd: CurricularDcd
  ): Promise<void> {
    this.isGenerating.set(true);
    this.error.set(null);

    try {
      const generated = await this.geminiService.generateDidacticSequence(
        header.subject,
        header.topic,
        dcd.code || dcd.codigo || 'DCD.GEN',
        dcd.description || dcd.descripcion || '',
        header.periods || 1,
        header.periodDuration || 45,
        header.insertions || ['CS']
      );

      const completePlan: LessonPlan = {
        header: {
          ...header,
          insertionConnection: generated.insertionConnection || 'Articulación transversal con competencias socioemocionales.'
        },
        stages: generated.stages || [],
        evaluation: {
          indicator: dcd.indicator || dcd.indicador || 'Aplica la destreza en situaciones cotidianas y académicas.',
          technique: generated.evaluation?.technique || 'Resolución de problemas contextualizados',
          instrument: generated.evaluation?.instrument || 'Rúbrica analítica por criterios de logro',
          rubric: generated.evaluation?.rubric || []
        }
      };

      this.currentPlan.set(completePlan);
    } catch (err: any) {
      console.error('Error al generar la planificación:', err);
      this.error.set(err.message || 'Error en servicio de IA.');
      alert('Error al generar la planificación: ' + (err.message || 'Compruebe su conexión o API Key.'));
    } finally {
      this.isGenerating.set(false);
    }
  }

  setPlan(plan: LessonPlan): void {
    this.currentPlan.set(plan);
  }

  clearPlan(): void {
    this.currentPlan.set(null);
  }
}