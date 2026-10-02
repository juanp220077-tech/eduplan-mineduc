export interface CurricularInsertion {
  code: string;
  name: string;
  colorBg: string;
  colorText: string;
}

export const OFFICIAL_INSERTIONS: Record<string, CurricularInsertion> = {
  CC: { code: 'CC', name: 'Competencias Comunicacionales', colorBg: '#0284c7', colorText: '#ffffff' },
  CM: { code: 'CM', name: 'Competencias Matemáticas', colorBg: '#1d4ed8', colorText: '#ffffff' },
  CD: { code: 'CD', name: 'Competencias Digitales', colorBg: '#ea580c', colorText: '#ffffff' },
  CS: { code: 'CS', name: 'Competencias Socioemocionales', colorBg: '#eab308', colorText: '#0f172a' },
  CIV: { code: 'CIV', name: 'Cívica, Ética e Integridad', colorBg: '#7c3aed', colorText: '#ffffff' },
  AMB: { code: 'AMB', name: 'Educación Ambiental y Sostenibilidad', colorBg: '#16a34a', colorText: '#ffffff' },
  FIN: { code: 'FIN', name: 'Educación Financiera', colorBg: '#059669', colorText: '#ffffff' },
  VIAL: { code: 'VIAL', name: 'Seguridad Vial y Movilidad', colorBg: '#dc2626', colorText: '#ffffff' }
};

export interface CurricularDcd {
  code: string;
  description: string;
  indicator?: string;
  codigo?: string;
  descripcion?: string;
  indicador?: string;
  insertions?: string[];
  inserciones?: string[];
  competencias?: string[];
  [key: string]: any;
}

export interface LessonPlanHeader {
  subject: string;
  topic: string;
  parallel: string;
  teacher: string;
  date?: string;
  periods?: number;
  periodDuration?: number;
  insertions?: string[];
  insertionConnection?: string;
  [key: string]: any;
}

export interface StagePlan {
  stage: string;
  title: string;
  durationMinutes?: number;
  activity?: string;
  items?: string[];
  resources?: string[];
  guidingQuestions?: string[];
  keyConcepts?: string[];
  dua?: { title?: string; strategy?: string; [key: string]: any };
  [key: string]: any;
}

export interface LessonPlan {
  header: LessonPlanHeader;
  stages: StagePlan[];
  evaluation: {
    indicator?: string;
    technique?: string;
    instrument?: string;
    rubric?: Array<{ level: string; descriptor: string }>;
    [key: string]: any;
  };
  [key: string]: any;
}