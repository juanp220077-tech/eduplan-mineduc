import { LessonPlan } from '../models/lesson-plan.model';

export const PRESET_LESSON_PLANS: Record<string, LessonPlan> = {
  default: {
    header: {
      subject: 'Matemática',
      topic: 'Álgebra y Funciones: Sistemas de Ecuaciones Lineales 2x2',
      parallel: 'A',
      teacher: 'Docente Responsable',
      date: '2025-2026',
      periods: 2,
      periodDuration: 45,
      insertions: ['CS'],
      insertionConnection: 'Articulación transversal con Competencias Socioemocionales (CS): Trabajo colaborativo y resolución reflexiva.'
    },
    stages: [
      {
        stage: 'experiencia',
        title: 'EXPERIENCIA',
        items: [
          '1. Dinámica vivencial: Simulación de compra escolar con dos artículos y precio total combinado.',
          '2. Manipulación de boletas impresas con incógnitas de valor.',
          '3. Planteamiento de hipótesis iniciales en equipos de trabajo.'
        ],
        duaPrinciple: 'Principio 1: Múltiples formas de Implicación (Activación vivencial)'
      },
      {
        stage: 'reflexion',
        title: 'REFLEXIÓN',
        items: [
          '1. Diálogo guiado: ¿Por qué una sola ecuación con dos variables admite infinitas combinaciones?',
          '2. Contrastación de estrategias: ¿Qué condición matemática permite fijar una solución única?',
          '3. Visualización geométrica del corte entre dos trayectorias.'
        ],
        duaPrinciple: 'Principio 2: Múltiples formas de Representación (Mediación analítica)'
      },
      {
        stage: 'conceptualizacion',
        title: 'CONCEPTUALIZACIÓN',
        items: [
          '1. Formalización del concepto de sistema de ecuaciones lineales 2x2.',
          '2. Construcción del algoritmo de resolución por método analítico y gráfico.',
          '3. Elaboración conjunta de organizador gráfico de verificación de soluciones.'
        ],
        duaPrinciple: 'Principio 3: Múltiples formas de Acción y Expresión (Sistematización)'
      },
      {
        stage: 'aplicacion',
        title: 'APLICACIÓN',
        items: [
          '1. Resolución de problemas contextualizados del texto escolar oficial.',
          '2. Verificación de resultados mediante retos aplicados en hojas de trabajo.'
        ],
        duaPrinciple: 'Principio 1: Implicación y Transferencia'
      }
    ],
    evaluation: {
      indicator: 'I.M.4.2.1. Emplea sistemas de ecuaciones en la resolución de problemas geométricos y cotidianos.',
      activities: 'Resolución de situaciones problema en el cuaderno de trabajo.',
      technique: 'Observación directa y resolución de problemas',
      instrument: 'Rúbrica analítica por criterios de logro'
    }
  }
};