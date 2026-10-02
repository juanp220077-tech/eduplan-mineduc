import { inject, Injectable } from '@angular/core';
import { ApiKeyService } from './api-key.service';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private readonly apiKeyService = inject(ApiKeyService);

  async generateDidacticSequence(
    subject: string,
    topic: string,
    code: string,
    description: string,
    duracionHoras: number = 1,
    duracionMinutos: number = 45,
    insertions: string[] = ['CM']
  ): Promise<any> {
    const key = this.apiKeyService.apiKey();

    if (!key || !this.apiKeyService.hasValidKey()) {
      throw new Error('KEY_MISSING');
    }

    const tiempoTotal = duracionHoras * duracionMinutos;

    // Distribución proporcional de los minutos
    const expMin = Math.round(tiempoTotal * 0.15);
    const refMin = Math.round(tiempoTotal * 0.20);
    const conMin = Math.round(tiempoTotal * 0.35);
    const aplMin = tiempoTotal - (expMin + refMin + conMin);

    const isEnglish = subject.toLowerCase().includes('inglés') || 
                      subject.toLowerCase().includes('english') || 
                      code.toUpperCase().startsWith('EFL');

    const insertionListStr = insertions.length > 0 ? insertions.join(', ') : (isEnglish ? 'Communicative Competence' : 'Competencias Disciplinares');

    // Prompt en Inglés o Español según la asignatura
    const systemPrompt = isEnglish 
      ? `You are an expert pedagogical auditor and senior EFL curriculum designer for Ecuador's Ministry of Education (MinEduc).
You MUST generate the lesson plan ENTIRELY IN ENGLISH, strictly aligning with the Ecuadorian EFL Curriculum (Curricular Threads, ERCA framework, and UDL 3.0 guidelines).

LESSON RULES FOR EFL (English as a Foreign Language):
1. Target Skill: [${code}] ${description}.
2. Integrated Competencies/Insertions: [${insertionListStr}].
3. Duration: ${duracionHoras} period(s) (${tiempoTotal} minutes total).
4. All stages must be numbered action steps (1, 2, 3...) written clearly in English.
5. In the APPLICATION stage, include communicative task-based activities, pair work, or textbook practice.
6. Provide specific UDL (Universal Design for Learning) strategies for engagement, representation, and action/expression.

Return ONLY a valid JSON object with this exact structure:
{
  "insertionConnection": "Technical explanation in English on how this skill develops the selected competencies (${insertionListStr}).",
  "stages": [
    {
      "stage": "experiencia",
      "title": "CONCRETE EXPERIENCE",
      "durationMinutes": ${expMin},
      "activity": "Communicative warm-up activity linking students' daily life to the target language...",
      "items": [
        "1. Real-world activation: short interactive hook or multimedia prompt...",
        "2. Eliciting prior vocabulary through pair brainstorming...",
        "3. Setting the communicative purpose of the lesson..."
      ],
      "resources": ["Visual flashcards", "Audio track", "Whiteboard"],
      "dua": {
        "title": "Multiple Means of Engagement (UDL)",
        "strategy": "Connecting linguistic prompts with relatable personal experiences."
      }
    },
    {
      "stage": "reflexion",
      "title": "REFLECTIVE OBSERVATION",
      "durationMinutes": ${refMin},
      "activity": "Guided analysis and guided noticing of language patterns...",
      "items": [
        "1. Guided discussion based on key scaffolding questions...",
        "2. Peer comparison and discovery of language patterns...",
        "3. Clarifying meaning and socio-cultural context..."
      ],
      "guidingQuestions": [
        "What patterns did you notice in the model dialogue?",
        "How does the context change the way we express this idea?",
        "Which expressions can we use to make our message clearer?"
      ],
      "resources": ["Guiding questions chart", "Concept checking cards"],
      "dua": {
        "title": "Multiple Means of Representation (UDL)",
        "strategy": "Visual scaffolding and graphic organizers to support language comprehension."
      }
    },
    {
      "stage": "conceptualizacion",
      "title": "ABSTRACT CONCEPTUALIZATION",
      "durationMinutes": ${conMin},
      "activity": "Formalization of target structures, vocabulary focus, and collaborative rules systematization...",
      "items": [
        "1. Explicit systematization of key structures and pronunciation models...",
        "2. Collaborative construction of a language anchor chart or mind map...",
        "3. Guided controlled practice with corrective feedback..."
      ],
      "keyConcepts": ["Key structure 1", "Vocabulary chunk 2"],
      "resources": ["Student textbook", "Grammar/Vocabulary anchor chart"],
      "dua": {
        "title": "Multiple Means of Representation (UDL)",
        "strategy": "Color-coded syntax markers and multimodal sentence frames."
      }
    },
    {
      "stage": "aplicacion",
      "title": "ACTIVE EXPERIMENTATION / APPLICATION",
      "durationMinutes": ${aplMin},
      "activity": "Communicative output task, role-play or contextualized textbook exercises...",
      "items": [
        "1. Pair work: simulating a meaningful dialogue using the target skill...",
        "2. Completion of task-based application activities in the student notebook...",
        "3. Peer assessment and brief communicative showcase..."
      ],
      "resources": ["Student's workbook", "Task rubrics"],
      "dua": {
        "title": "Multiple Means of Action and Expression (UDL)",
        "strategy": "Flexible production choices: spoken role-play, written postcard, or digital showcase."
      }
    }
  ],
  "evaluation": {
    "technique": "Oral interview / Formative communicative observation / Task performance",
    "instrument": "Analytical Rubric / Checklist",
    "rubric": [
      { "level": "Excellent", "descriptor": "Communicates fluently with accurate grammar and precise pronunciation." },
      { "level": "Satisfactory", "descriptor": "Conveys the message effectively with minor linguistic inaccuracies." },
      { "level": "In Progress", "descriptor": "Requires teacher scaffolding and vocabulary prompts to complete the task." }
    ]
  }
}`
      : `Eres un auditor técnico y diseñador curricular senior del Ministerio de Educación de Ecuador (MinEduc).
Genera una planificación microcurricular diaria de aula (${duracionHoras} hora(s) clase, ${tiempoTotal} minutos en total) que integre la metodología ERCA y los principios del Diseño Universal para el Aprendizaje (DUA 3.0).

REGLAS PEDAGÓGICAS FUNDAMENTALES:
1. Las actividades deben articularse directamente con la destreza [${code}] y con las competencias/inserciones curriculares seleccionadas: [${insertionListStr}].
2. Cada fase del ciclo ERCA debe formularse mediante actividades concretas, mediadas y secuenciales (puntos numerados 1, 2, 3...).
3. En la fase de APLICACIÓN se debe incluir trabajo contextualizado con el texto escolar y resolución de problemas prácticos.
4. Para cada fase se debe especificar la adaptación DUA correspondiente (Implicación, Representación o Acción y Expresión).

Devuelve EXCLUSIVAMENTE un objeto JSON válido con esta estructura exacta:
{
  "insertionConnection": "Explicación concisa y técnica (1-2 oraciones) de cómo esta destreza específica desarrolla las competencias/inserciones indicadas (${insertionListStr}).",
  "stages": [
    {
      "stage": "experiencia",
      "title": "Experiencia Concreta",
      "durationMinutes": ${expMin},
      "activity": "Actividad vivencial contextualizada vinculada al entorno cotidiano y conocimientos previos.",
      "items": [
        "1. Exploración vivencial o dinámica de partida sobre la situación de aprendizaje...",
        "2. Manipulación de material representativo o planteamiento del reto inicial...",
        "3. Lluvia de ideas guiada sobre situaciones del entorno real..."
      ],
      "resources": ["Material concreto", "Texto del estudiante", "Pizarra"],
      "dua": {
        "title": "Múltiples Formas de Implicación",
        "strategy": "Vincular el reto a situaciones reales y significativas del contexto del estudiante."
      }
    },
    {
      "stage": "reflexion",
      "title": "Reflexión y Análisis",
      "durationMinutes": ${refMin},
      "activity": "Discusión en plenaria a partir de preguntas mediadoras y análisis de procesos.",
      "items": [
        "1. Diálogo guiado sobre las causas, relaciones y condiciones observadas...",
        "2. Comparación de distintas vías y estrategias para abordar el problema...",
        "3. Análisis de errores frecuentes y argumentación de hipótesis..."
      ],
      "guidingQuestions": [
        "¿Qué relación observamos entre los elementos analizados?",
        "¿Por qué es necesario seguir un procedimiento ordenado en este caso?",
        "¿De qué manera podemos validar los resultados obtenidos?"
      ],
      "resources": ["Preguntas generadoras", "Pizarra colaborativa"],
      "dua": {
        "title": "Múltiples Formas de Representación",
        "strategy": "Uso de lluvia de ideas visual, esquemas gráficos y mediación dialógica."
      }
    },
    {
      "stage": "conceptualizacion",
      "title": "Conceptualización y Formalización",
      "durationMinutes": ${conMin},
      "activity": "Construcción formal del conocimiento, reglas y sistematización en organizadores gráficos.",
      "items": [
        "1. Explicación estructurada y formalización teórica de los conceptos clave...",
        "2. Elaboración conjunta de un organizador gráfico (mapa conceptual, diagrama o tabla)...",
        "3. Análisis guiado de ejemplos resueltos y modelado de procedimientos...",
        "4. Registro ordenado de conclusiones y algoritmos en el cuaderno de trabajo..."
      ],
      "keyConcepts": ["Concepto esencial 1", "Concepto esencial 2"],
      "resources": ["Texto escolar", "Organizador visual"],
      "dua": {
        "title": "Múltiples Formas de Representación",
        "strategy": "Código cromático para pasos analíticos y estructuración jerárquica de la información."
      }
    },
    {
      "stage": "aplicacion",
      "title": "Aplicación Práctica / Reto Didáctico",
      "durationMinutes": ${aplMin},
      "activity": "Resolución de reto contextualizado y ejercitación autónoma en el texto escolar.",
      "items": [
        "1. Resolución individual y en parejas de ejercicios de aplicación en el cuaderno de trabajo...",
        "2. Desarrollo de actividades seleccionadas de la sección práctica del texto escolar...",
        "3. Transferencia del aprendizaje mediante la formulación o resolución de un problema práctico contextualizado..."
      ],
      "resources": ["Cuaderno de trabajo", "Texto escolar oficial"],
      "dua": {
        "title": "Múltiples Formas de Acción y Expresión",
        "strategy": "Opciones variadas para demostrar el aprendizaje: resolución manual, informe sintético o sustentación en pares."
      }
    }
  ],
  "evaluation": {
    "technique": "Resolución de situaciones problema / Observación directa",
    "instrument": "Rúbrica analítica por criterios de logro / Lista de cotejo",
    "rubric": [
      { "level": "Excelente", "descriptor": "Aplica la destreza con precisión metodológica, orden analítico y justificación rigurosa." },
      { "level": "Satisfactorio", "descriptor": "Resuelve la situación con procedimiento acertado y errores mínimos de cálculo que no invalidan el resultado." },
      { "level": "En proceso", "descriptor": "Requiere acompañamiento docente para interpretar los enunciados y estructurar los pasos de solución." }
    ]
  }
}`;

    const userPrompt = isEnglish
      ? `Subject: ${subject}
Unit/Topic: ${topic}
Skill DCD: [${code}] ${description}
Duration: ${duracionHoras} class period(s) (${tiempoTotal} minutes).
Active Competencies / Insertions: ${insertionListStr}
Language: Generate the complete response in ENGLISH.`
      : `Asignatura: ${subject}
Tema/Unidad: ${topic}
Destreza DCD: [${code}] ${description}
Duración: ${duracionHoras} hora(s) clase (${tiempoTotal} minutos).
Inserciones / Competencias activas: ${insertionListStr}
Idioma: Español.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Error Groq:', errText);
      if (response.status === 401) throw new Error('Clave de API inválida');
      throw new Error(`API Groq (${response.status}): ${errText}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  }
}