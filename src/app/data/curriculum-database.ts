export interface CurricularDcd {
  code: string;
  description: string;
  indicator: string;
  defaultPlan: {
    exp: { activity: string; dua: string; resources: string[] };
    ref: { questions: string[]; dua: string };
    con: { concepts: string[]; dua: string };
    apl: { challenge: string; dua: string; rubricEx: string; rubricSat: string; rubricProc: string };
  };
}

export interface CurricularTopic {
  id: string;
  name: string;
  dcds: CurricularDcd[];
}

export interface CurricularSubject {
  id: string;
  name: string;
  topics: CurricularTopic[];
}

export interface CurricularLevel {
  id: string;
  name: string;
  subjects: CurricularSubject[];
}

export const ECUADOR_CURRICULUM: CurricularLevel[] = [
  {
    id: 'egb-superior',
    name: 'EGB Superior (8.°, 9.°, 10.° EGB)',
    subjects: [
      {
        id: 'matematica-egb',
        name: 'Matemática (10.° EGB)',
        topics: [
          {
            id: 'algebra-lineal',
            name: 'Álgebra y Funciones: Sistemas de Ecuaciones Lineales 2x2',
            dcds: [
              {
                code: 'M.4.1.20',
                description: 'Resolver sistemas de dos ecuaciones lineales con dos incógnitas utilizando los métodos analíticos (sustitución, igualación, eliminación) y gráfico.',
                indicator: 'I.M.4.2.1. Emplea las operaciones con polinomios y sistemas de ecuaciones en la resolución de problemas geométricos y cotidianos.',
                defaultPlan: {
                  exp: {
                    activity: 'Problema del comercio local: plantear la compra de dos tipos de cuadernos y lápices conociendo únicamente el valor total pagado por dos clientes distintos.',
                    dua: 'Presentación mediante simulación de tienda escolar con boletas de compra impresas y precios ocultos.',
                    resources: ['Facturas simuladas', 'Material concreto representativo']
                  },
                  ref: {
                    questions: [
                      '¿Por qué una sola ecuación con dos variables tiene infinitas respuestas?',
                      '¿Qué condición permite hallar un precio único para cada producto?',
                      '¿Qué representa visualmente el punto de corte entre dos rectas?'
                    ],
                    dua: 'Esquematización en pizarra de intersección geométrica y contrastación de hipótesis en parejas.'
                  },
                  con: {
                    concepts: ['Sistema 2x2', 'Punto de intersección', 'Método algebraico vs gráfico', 'Conjunto solución'],
                    dua: 'Uso de GeoGebra proyectado con deslizadores dinámicos para verificar la solución gráfica al instante.'
                  },
                  apl: {
                    challenge: 'Determinar la tarifa fija y el costo por kilómetro recorrido en un servicio de transporte urbano a partir de dos carreras registradas.',
                    dua: 'Opciones de entrega: resolución manual en hoja de trabajo o verificación guiada en software dinámico.',
                    rubricEx: 'Plantea el sistema correctamente, despeja con método ordenado y valida la coherencia económica del resultado.',
                    rubricSat: 'Plantea el sistema pero comete errores aritméticos mínimos de signos que no invalidan el proceso lógico.',
                    rubricProc: 'Confunde los coeficientes o aplica de manera inconsistente el método algebraico seleccionado.'
                  }
                }
              }
            ]
          }
        ]
      },
      {
        id: 'lengua-egb',
        name: 'Lengua y Literatura (9.° EGB)',
        topics: [
          {
            id: 'texto-argumentativo',
            name: 'Comunicación Oral y Escrita: El Ensayo Argumentativo',
            dcds: [
              {
                code: 'LL.4.4.2',
                description: 'Lograr cohesión y coherencia en la escritura de ensayos breves mediante la formulación de tesis clara y argumentos sustentados.',
                indicator: 'I.LL.4.7.1. Estructura diferentes tipos de textos periodísticos y académicos aplicando la propiedad textual y citación.',
                defaultPlan: {
                  exp: {
                    activity: 'Mini-debate relámpago: "¿Debe prohibirse el uso de smartphones durante el recreo escolar?". Los estudiantes se posicionan a favor o en contra.',
                    dua: 'Activación del interés mediante temas de alta controversia y pertinencia inmediata para su vida escolar.',
                    resources: ['Tarjetas de postura (A favor / En contra)', 'Cronómetro de debate']
                  },
                  ref: {
                    questions: [
                      '¿Qué diferencia a una opinión subjetiva de un argumento basado en evidencia?',
                      '¿Por qué una tesis no puede ser una simple afirmación obvia?',
                      '¿Cómo evitamos caer en contradicciones lógicas al escribir?'
                    ],
                    dua: 'Mural colaborativo digital o físico clasificando argumentos fuertes vs falacias comunes.'
                  },
                  con: {
                    concepts: ['Tesis argumentativa', 'Tipos de argumentos (datos, autoridad, causa)', 'Contraargumento', 'Conectores lógicos'],
                    dua: 'Plantilla estructurada tipo "árbol de ideas" y lista guía de conectores lógicos de causa y consecuencia.'
                  },
                  apl: {
                    challenge: 'Redactar un micro-ensayo de 3 párrafos defendiendo una postura sobre el impacto de la inteligencia artificial en la educación secundaria.',
                    dua: 'Múltiples formatos: texto redactado tradicional, podcast grabado de 90 segundos o presentación visual sintética.',
                    rubricEx: 'Formula una tesis clara e indiscutible, desarrolla dos argumentos sólidos bien conectados y refuta un contraargumento.',
                    rubricSat: 'Escribe el texto de forma coherente pero uno de los argumentos carece de evidencia demostrable.',
                    rubricProc: 'Confunde un texto narrativo o de opinión vaga con una estructura formal argumentativa.'
                  }
                }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'bgu',
    name: 'Bachillerato General Unificado (1.°, 2.°, 3.° BGU)',
    subjects: [
      {
        id: 'matematica-bgu',
        name: 'Matemática (1.° BGU)',
        topics: [
          {
            id: 'funciones-cuadraticas',
            name: 'Álgebra y Geometría: Función Cuadrática y Parábolas',
            dcds: [
              {
                code: 'M.5.1.20',
                description: 'Graficar y analizar el dominio, recorrido, monotonía, ceros, extremos y paridad de las funciones cuadráticas en ℝ.',
                indicator: 'I.M.5.3.1. Grafica funciones reales y analiza sus características de concavidad, vértice y puntos de corte.',
                defaultPlan: {
                  exp: {
                    activity: 'Tiro parabólico con proyectores: registrar el lanzamiento de un balón de baloncesto y pausar el video en el punto de máxima altura.',
                    dua: 'Análisis de video en cámara lenta y captura de trayectorias con trazadores visuales.',
                    resources: ['Video de tiro deportivo', 'Cuadrícula transparente superpuesta']
                  },
                  ref: {
                    questions: [
                      '¿Por qué la subida y la bajada del balón son simétricas?',
                      '¿Qué punto representa el instante de mayor elevación y qué velocidad vertical tiene ahí?',
                      '¿Cómo se refleja algebraicamente la concavidad de la curva?'
                    ],
                    dua: 'Discusión en mesas redondas con apoyo de modelos físicos y gráficas cinemáticas.'
                  },
                  con: {
                    concepts: ['Forma canónica f(x)=ax²+bx+c', 'Coordenadas del vértice', 'Eje de simetría', 'Discriminante y raíces'],
                    dua: 'Código de colores para relacionar el coeficiente "a" con la orientación de apertura de la parábola.'
                  },
                  apl: {
                    challenge: 'Modelar algebraicamente la curvatura de un puente colgante o el alcance de un aspersor de riego encontrando su altura máxima.',
                    dua: 'Verificación inmediata con GeoGebra o entrega mediante resolución manual paso a paso.',
                    rubricEx: 'Encuentra las coordenadas exactas del vértice, calcula los cortes con los ejes y explica el fenómeno físico.',
                    rubricSat: 'Calcula el vértice correctamente con pequeñas imprecisiones en el cálculo de las raíces cuadradas.',
                    rubricProc: 'Confunde las coordenadas (h, k) del vértice o invierte los signos en la fórmula general.'
                  }
                }
              }
            ]
          }
        ]
      },
      {
        id: 'informatica-bgu',
        name: 'Informática Aplicada / Programación (1.° BGU)',
        topics: [
          {
            id: 'algoritmos-condicionales',
            name: 'Lógica Algorítmica: Estructuras Condicionales (if / else)',
            dcds: [
              {
                code: 'CS.INF.4.1.3',
                description: 'Codificar algoritmos estructurados aplicando condicionales lógicas simples y dobles para resolver problemas de toma de decisiones cotidianas.',
                indicator: 'I.CS.INF.4.1.3. Diseña y ejecuta algoritmos con estructuras condicionales verificando la exactitud de sus salidas lógicas.',
                defaultPlan: {
                  exp: {
                    activity: 'Dinámica "Semáforo Inteligente": simular el control de acceso a un laboratorio donde los estudiantes plantean condiciones reales.',
                    dua: 'Vincular el reto a situaciones reales del entorno escolar para activar interés y pertinencia.',
                    resources: ['Tarjetas físicas de colores', 'Simulador visual web']
                  },
                  ref: {
                    questions: [
                      '¿Qué ocurre en un cajero si la clave es correcta pero el saldo es cero?',
                      '¿Podemos evaluar más de un camino al mismo tiempo?',
                      '¿Por qué las máquinas requieren instrucciones binarias estrictas?'
                    ],
                    dua: 'Presentar ramas lógicas con diagramas de flujo interactivos y código comentado.'
                  },
                  con: {
                    concepts: ['Condición booleana', 'Rama verdadera (if)', 'Rama falsa (else)', 'Indentación de bloques'],
                    dua: 'Resaltado de sintaxis con alto contraste y fichas de operadores lógicos.'
                  },
                  apl: {
                    challenge: 'Implementar un algoritmo de cálculo de calificaciones trimestrales que clasifique estudiantes en Aprobado, Supletorio o Remedial.',
                    dua: 'Entrega por código estructurado en editor, pseudocódigo en PSeInt o diagrama de flujo verificado.',
                    rubricEx: 'Estructura la lógica sin errores sintácticos, valida los límites de rango y optimiza bifurcaciones.',
                    rubricSat: 'Aplica condicionales con lógica adecuada con errores menores en operadores de comparación.',
                    rubricProc: 'Tiene dificultades al anidar condiciones o confunde asignación con igualdad lógica.'
                  }
                }
              }
            ]
          }
        ]
      },
      {
        id: 'fisica-bgu',
        name: 'Física (1.° BGU)',
        topics: [
          {
            id: 'cinematica-mruv',
            name: 'Cinemática: Movimiento Rectilíneo Uniformemente Variado (MRUV)',
            dcds: [
              {
                code: 'CN.F.5.1.3',
                description: 'Obtener la velocidad y aceleración de un móvil a partir de las tablas de posición-tiempo y de gráficos v-t.',
                indicator: 'I.CN.F.5.1.1. Determina magnitudes cinemáticas del MRUV mediante experimentos y análisis de gráficas vectoriales.',
                defaultPlan: {
                  exp: {
                    activity: 'Rampa de desaceleración: rodar esferas sobre superficies con diferente fricción y medir distancias de parada con cinta métrica.',
                    dua: 'Asignación de roles rotativos y empleo de cronómetros digitales con pulsadores grandes.',
                    resources: ['Rampa graduada', 'Cronómetros', 'Esferas de acero y goma']
                  },
                  ref: {
                    questions: [
                      '¿Por qué la velocidad disminuye paulatinamente en lugar de detenerse de golpe?',
                      '¿Qué representa la pendiente negativa en una gráfica velocidad-tiempo?',
                      '¿La aceleración de frenado es constante?'
                    ],
                    dua: 'Tabulación compartida en tiempo real y visualización gráfica simultánea.'
                  },
                  con: {
                    concepts: ['Aceleración negativa', 'Pendiente de desaceleración', 'Ecuación v = v0 - a*t', 'Distancia de frenado'],
                    dua: 'Código cromático para cada variable física en el pizarrón y en la guía didáctica.'
                  },
                  apl: {
                    challenge: 'Calcular la distancia mínima de seguridad de un bus de transporte público a 60 km/h en asfalto húmedo.',
                    dua: 'Resolución analítica paso a paso o comprobación gráfica en simulación PhET.',
                    rubricEx: 'Aplica ecuaciones dimensionales correctas, interpreta el signo de la aceleración y argumenta la distancia crítica.',
                    rubricSat: 'Plantea las fórmulas correctas con fallas operativas menores en la conversión de km/h a m/s.',
                    rubricProc: 'Confunde fórmulas de velocidad constante con movimiento acelerado.'
                  }
                }
              }
            ]
          }
        ]
      }
    ]
  }
];