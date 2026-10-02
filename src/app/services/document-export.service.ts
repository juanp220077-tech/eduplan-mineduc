import { Injectable } from '@angular/core';
import { LessonPlan } from '../models/lesson-plan.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentExportService {

  copyToClipboard(plan: LessonPlan): void {
    if (!plan) return;

    const stagesText = (plan.stages || []).map((s: any) => {
      const itemsList = s.items && s.items.length > 0 
        ? s.items.join('\n   ') 
        : (s.activity || '');
      return `[${(s.stage || '').toUpperCase()}]\n   ${itemsList}`;
    }).join('\n\n');

    const fullText = `======================================================
UNIDAD EDUCATIVA
PLANIFICACIÓN MICROCURRICULAR 2025 - 2026
ESTÁNDAR MINEDUC ECUADOR (ERCA + DUA)
======================================================

1. DATOS INFORMATIVOS:
Docente: ${plan.header.teacher || ''}
Asignatura: ${plan.header.subject || ''}
Curso/Paralelo: ${plan.header.parallel || ''}
Destreza (DCD): ${plan.header.topic || ''}
Períodos: ${plan.header.periods || 1} (${(plan.header.periods || 1) * (plan.header.periodDuration || 45)} min)
Eje Transversal: ${plan.header.insertionConnection || 'Articulación institucional'}

2. MATRIZ DE APRENDIZAJE DISCIPLINAR:

[ESTRATEGIAS METODOLÓGICAS ACTIVAS - ERCA + DUA]
${stagesText}

[EVALUACIÓN]
Indicador: ${plan.evaluation?.indicator || ''}
Técnica: ${plan.evaluation?.technique || 'Observación directa'}
Instrumento: ${plan.evaluation?.instrument || 'Rúbrica analítica'}

======================================================
Firmas de Responsabilidad:
Elaborado: ${plan.header.teacher || ''} | Revisado: Director/a de Área | Aprobado: Vicerrector/a
======================================================`;

    navigator.clipboard.writeText(fullText);
  }

  exportToDocx(plan: LessonPlan): void {
    if (!plan) return;

    // Exportación HTML estructurada compatible con MS Word (.doc/.docx)
    const stagesHtml = (plan.stages || []).map((s: any) => `
      <p style="margin: 4px 0;"><strong>${(s.stage || '').toUpperCase()}:</strong></p>
      ${s.items && s.items.length > 0 
        ? `<ul style="margin: 2px 0; padding-left: 18px;">${s.items.map((it: string) => `<li>${it}</li>`).join('')}</ul>`
        : `<p style="margin: 2px 0;">${s.activity || ''}</p>`}
      ${s.duaPrinciple ? `<p style="margin: 2px 0; font-size: 10px; color: #1e3a8a; font-style: italic;">DUA: ${s.duaPrinciple}</p>` : ''}
    `).join('<br>');

    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Planificación Microcurricular MinEduc</title>
        <style>
          body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; color: #000; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th, td { border: 1px solid #000; padding: 6px; font-size: 10pt; vertical-align: top; }
          th { background-color: #f2f2f2; text-align: left; }
          .header-box { text-align: center; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 12px; }
          .dua-banner { background-color: #e2e8f0; font-size: 9pt; font-weight: bold; padding: 4px; border: 1px solid #000; text-align: center; margin-top: 8px; }
        </style>
      </head>
      <body>
        <div class="header-box">
          <h2 style="margin:0;">UNIDAD EDUCATIVA</h2>
          <h4 style="margin:2px 0;">PLANIFICACIÓN MICROCURRICULAR 2025 - 2026</h4>
          <p style="margin:0; font-size: 9pt;">APRENDIZAJE DISCIPLINAR / ERCA - DUA</p>
        </div>

        <table>
          <tr>
            <td><strong>Docente:</strong> ${plan.header.teacher || ''}</td>
            <td><strong>Asignatura:</strong> ${plan.header.subject || ''}</td>
            <td><strong>Paralelo:</strong> ${plan.header.parallel || ''}</td>
          </tr>
          <tr>
            <td colspan="2"><strong>Destreza (DCD):</strong> ${plan.header.topic || ''}</td>
            <td><strong>Tiempo:</strong> ${plan.header.periods || 1} períodos (${(plan.header.periods || 1) * (plan.header.periodDuration || 45)} min)</td>
          </tr>
        </table>

        <div class="dua-banner">
          PRINCIPIOS DUA: Implicación (Verde) | Representación (Morado) | Acción y Expresión (Azul)
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 18%;">Contenidos Esenciales</th>
              <th style="width: 18%;">Destrezas con Criterio de Desempeño</th>
              <th style="width: 36%;">Estrategias Metodológicas (ERCA + DUA)</th>
              <th style="width: 14%;">Recursos</th>
              <th style="width: 14%;">Evaluación</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${plan.header.topic || ''}</td>
              <td>${plan.header.topic || ''}</td>
              <td>${stagesHtml}</td>
              <td>
                • Material concreto<br>
                • Pizarra interactiva<br>
                • Texto oficial MinEduc<br>
                • Fichas DUA
              </td>
              <td>
                <strong>Indicador:</strong><br>${plan.evaluation?.indicator || ''}<br><br>
                <strong>Técnica:</strong><br>${plan.evaluation?.technique || 'Observación directa'}<br><br>
                <strong>Instrumento:</strong><br>${plan.evaluation?.instrument || 'Rúbrica analítica'}
              </td>
            </tr>
          </tbody>
        </table>

        <br><br>
        <table>
          <tr>
            <th style="text-align:center;">ELABORADO POR DOCENTE</th>
            <th style="text-align:center;">REVISADO POR DIRECTOR/A DE ÁREA</th>
            <th style="text-align:center;">APROBADO POR VICERRECTOR/A</th>
          </tr>
          <tr style="height: 60px;">
            <td>Firma:<br><br>Fecha:</td>
            <td>Firma:<br><br>Fecha:</td>
            <td>Firma:<br><br>Fecha:</td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', htmlContent], {
      type: 'application/msword'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Planificacion_${(plan.header.subject || 'MinEduc').replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}