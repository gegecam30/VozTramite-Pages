# VozTrámite · Landing page responsive (Capítulo V)

Landing page de **VozTrámite**, un asistente conversacional por voz que orienta a las personas para preparar trámites del Estado peruano. Es un proyecto académico (HCI for UX Design, UPC); la constancia que genera es solo de orientación y no reemplaza a ninguna entidad.

## Cómo ejecutarla

```bash
python3 -m http.server 8123
# abrir http://localhost:8123/pages/index.html  (vistas: #/inicio, #/tramite, #/historial, #/conexion, #/glosario, #/ajustes, #/perfil, #/ayuda, #/privacidad, #/accesibilidad, #/acerca, #/opinion)
```

En GitHub Pages se publica desde la raíz de la rama principal; `index.html` de la raíz redirige a `pages/index.html`.

## Estructura (según el Handbook)

```
assets/            imágenes, íconos y fuentes (Instrument Sans, SIL OFL 1.1)
css/styles.css     identidad Onda: tokens, componentes y responsive
js/data.js         trámites (data-driven), requisitos, preguntas y glosario
js/config.js       configuración: URL del Worker de IA (`window.VT_CONFIG.iaEndpoint`)
js/assistant.js    voz (Web Speech API), comprensión local y punto de enchufe de IA
js/pruebas.js      modo prueba para moderadores: registro por trámite, SUS y exportación CSV/JSON
js/main.js         flujo del asistente y componentes
pages/index.html   app shell de una sola página con vistas por hash
docs/              documentación, wireframes, historias de usuario y pruebas
favicon.ico
```

## Qué implementa

Una sola página responsive (Desktop, Tablet y Mobile con el mismo HTML/CSS/JS) con forma de **app shell**:
se muestra una vista a la vez y se cambia por hash, sin recargar ni redirigir (HU-033). Implementa **30 historias de usuario core**; la trazabilidad vive en `docs/` y en
los atributos `data-hu` del marcado (no visibles); el detalle está en [`docs/trazabilidad-hu.md`](trazabilidad-hu.md).

### Vistas (enrutado por hash)

| Hash | Vista | Pantallas |
|---|---|---|
| `#/inicio` (por defecto y para hash desconocido) | Saludo, «Continúa donde quedaste», 4 trámites activos con «Empezar» (DNI, antecedentes, RUC y licencia) y 2 «Próximamente», franja de beneficios, 4 pasos y nota de alcance | D01 |
| `#/tramite` | Asistente: «Tu avance», conversación (Hablar, Repetir, Teclado, Tengo una duda, Ayuda) y panel «Lo que voy entendiendo» / ejemplo / Tengo una duda / privacidad / conexión (se oculta en modo simple; entonces privacidad, conexión y «Empezar otro trámite» pasan a la columna principal en forma compacta) | D02–D06 (layout D04) |
| `#/historial` | Trámites «En curso» (paso actual, barra de avance y «Continuar») y «Preparados» (código VT-…, fecha, «Ver resumen» y «Escuchar resumen»), con filtros Todos / En curso / Preparados y estado vacío | — |
| `#/conexion` | Diagnóstico, modo ligero, simular señal, avance guardado y pendientes | D07, D08 |
| `#/glosario` | Buscador y lista de términos | — |
| `#/ajustes` | Tamaño de texto, contraste, modo simple y voz (`#btn-ajustes` lleva aquí) el bloque «Probar voz» (probar micrófono, probar cómo te hablo, selector «Voz del asistente» y compatibilidad del navegador) y «Asistente con IA» (interruptor «Usar IA», bloque «¿Qué hace la IA?», estado y «Probar IA») | D09 |
| `#/ayuda` | Preguntas frecuentes con `<details>`: «Usar VozTrámite» (voz, teclado, señal débil, modo simple, avance, «¿cobran algo?») y una sección por trámite (qué es, costo con «referencial» y dónde se hace, con el canal como texto). Buscador, y enlaces a Glosario y a «Envíanos tu opinión» | — |
| `#/privacidad` | Qué se guarda en este equipo y qué no, qué recibe la IA y cuándo, cómo apagarla y botón «Borrar mis datos» | HU-016 |
| `#/accesibilidad` | Declaración: criterios WCAG 2.1 A/AA con «cómo se cumple», apoyos adicionales, limitaciones y cómo reportar un problema | — |
| `#/acerca` | Qué es y qué no hace, cómo funciona en 3 pasos, «Proyecto académico · UPC · HCI for UX Design · Grupo 1», versión y fecha. Los integrantes quedan como `<!-- TODO: agregar integrantes -->` | — |
| `#/opinion` | «Envíanos tu opinión»: ¿qué estabas haciendo?, ¿qué pasó? (10 a 500 caracteres) y ¿qué tan difícil fue? (1–5). Se guarda en `voztramite:opiniones:v1` | — |
| `#/perfil` | Avatar con iniciales, «¿Cómo quieres que te llame?» (se usa en el saludo de inicio), resumen de preferencias (incluida la voz elegida) con enlace a Ajustes, accesos a Historial y Conexión, y bloque de privacidad con «Borrar mis datos y mi historial» (confirmación en un `<dialog>`) | — |

Al cambiar de vista se actualiza `document.title` («Mi trámite · VozTrámite»), `aria-current="page"` en la navegación, el foco pasa al encabezado de la vista y se anuncia en `#live`. Si se recarga a mitad del trámite sin hash, se retoma en `#/tramite` con el aviso «Retomaste donde quedaste». «Ir al asistente» es el primer foco y lleva a `#/tramite` con el foco dentro del asistente.

### Shell por breakpoint

| Ancho | Navegación | Detalle |
|---|---|---|
| ≥ 1100 px | Barra lateral fija de 248 px | Logo y, con ícono + texto: Inicio, Mi trámite, Historial, Conexión, Glosario, Ajustes y Ayuda. Al pie, el chip de conexión y la tarjeta de usuario (avatar + nombre o «Mi perfil», lleva a `#/perfil`). Barra superior fina con el título de la vista. El asistente usa 3 columnas desde 1280 px; entre 1100 y 1279 px «Tu avance» pasa a una fila horizontal sobre 2 columnas |
| 768–1099 px | Riel lateral de íconos (72 px, objetivos de 56 px) | Los mismos 7 ítems (con Ayuda) y, abajo, el avatar de Perfil; cada uno con `aria-label` y tooltip. El chip de conexión de la barra superior es un enlace a `#/conexion` |
| < 768 px | Barra superior simple + 5 pestañas inferiores (≥ 48 px, con safe-area) | Inicio, Mi trámite, Historial, Glosario y Perfil. Conexión se abre desde el chip de la barra superior y Ajustes desde el botón `#btn-ajustes` o desde Perfil. Ayuda y «Envíanos tu opinión» se abren desde Perfil y desde el pie (no hay 6.ª pestaña). HABLAR de 64 px |

**Pie global.** Un solo `<footer>` (contentinfo) al final de la columna de contenido de todas las vistas y en los 3 tamaños: Ayuda · Privacidad · Accesibilidad · Acerca de · Envíanos tu opinión (enlaces internos de 48 px de alto) y «Proyecto académico · UPC · HCI for UX Design · Grupo 1». En `#/tramite` queda después de la conversación sin quitarle altura (PA-48).

**Layout del asistente (punto 0 de la revisión).** El nombre del paso, el interruptor «Privado» (`#sw-privado` con su `<label>`) y el estado van en la cabecera de la tarjeta; «Privacidad y conexión» (modo simple) es un `<details>` debajo del contenido del paso; con `max-height: 820px` se reducen los paddings; la barra «Continuar / Atrás» tiene fondo sólido y sombra; y en móviles de menos de 700 px de alto la barra de Hablar deja de ser fija para que la pregunta y «Continuar» quepan sin desplazarse (PA-47).

El cambio entre vistas hace un fade corto, desactivado con `prefers-reduced-motion` y en modo ligero.

| Área | Qué se puede probar |
|---|---|
| Voz | Botón **Hablar** con reconocimiento real (Web Speech API, `es-PE`), transcripción en vivo, lectura en voz alta de cada pregunta y de cada dato; el teclado siempre está disponible |
| Baja conectividad | Diagnóstico de red, **modo ligero**, estado «sin señal» con avance guardado en `localStorage` y sincronización al volver |
| Accesibilidad | Contraste AA, objetivos táctiles ≥ 48 px, bordes de campos ≥ 3:1, foco visible, navegación por teclado, `aria-live`, ajustes de tamaño y contraste, modo simple |
| Lenguaje claro | Traducción de lo que dice la persona al nombre oficial del trámite, glosario con ejemplos |
| Privacidad | Modo privado que oculta los datos, constancia de orientación con código |

### Perfil e historial

Todo se guarda **solo en `localStorage` de este equipo** (con `try/catch`); nada sale del navegador.

| Clave | Contenido |
|---|---|
| `voztramite:landing:v1` | Avance del trámite y ajustes (ya existía) |
| `voztramite:perfil:v1` | `{ nombre }` para el saludo de inicio («Hola, Rosa…») |
| `voztramite:historial:v1` | Lista de trámites preparados: `{ id, tramite, entidad, codigo, fecha, estado: "Solicitud preparada", campos: [{ k, v, p }] }` |
| `voztramite:voz:v1` | `{ id }` de la voz elegida en Ajustes |
| `voztramite:opiniones:v1` | Lista `{ fecha, que, texto, dificultad }` de «Envíanos tu opinión» |
| `voztramite:pruebas:v1` | Solo existe si se usó el modo prueba: participante, segmento, sesiones y SUS |

- **Cómo funciona el historial.** Cada vez que se genera la constancia (`emitir()` / `codigo()` en `js/main.js`) se registra un ítem, una sola vez por código VT-…. El trámite actual aparece en «En curso» mientras haya progreso y no se haya emitido la constancia; al emitirla pasa a «Preparados». No se siembran datos falsos: sin trámites se ve «Aún no tienes trámites» y el botón «Empezar mi trámite».
- **Ver resumen** abre un `<dialog>` con los datos confirmados; con el modo privado activo se ocultan la fecha de nacimiento y el celular. **Escuchar resumen** usa `speechSynthesis`.
- **Borrar mis datos y mi historial** (en Perfil) pide confirmación en un `<dialog>` y elimina las claves de arriba y reinicia el estado.

## Accesibilidad (verificable)

- Contraste (WCAG 2.1 **AA**): Tinta/blanco 18.72:1, Gris Texto/blanco 7.60:1, blanco/Cobalto 7.81:1. El texto principal supera 7:1, pero no se declara AAA para todo el sitio (verde, ámbar y rojo sobre sus fondos están entre 5:1 y 6.5:1).
- Bordes de campos, opciones e interruptores: token `--borde-campo` (#6B76A3) con 4.43:1 sobre blanco y 3.66:1 sobre el tinte (mínimo 3:1, WCAG 1.4.11); en contraste alto, #454F78. `--linea` (1.52:1) solo se usa en divisores decorativos.
- Encabezados sin saltos en todas las vistas (h1 → h2 → h3). Los avisos que no bloquean («No te entendí») usan `role="status"`; `role="alert"` queda para errores críticos (bloqueo de identidad, fallo de voz que impide seguir).
- El formulario de Perfil valida el nombre (2 a 40 letras y espacios) con mensaje, `aria-invalid`, `aria-describedby` y foco, igual que el resto.
- Botones y campos de al menos 48 px (HABLAR 64 px); verificado por la prueba PA-31.
- Todo estado usa **ícono + texto + color**, nunca solo color.
- `<html lang="es">`, enlace «Ir al asistente», regiones `aria-live`, formularios con etiquetas.
- Respeta `prefers-reduced-motion`.
- Navegación por vistas con foco en el encabezado y `aria-current="page"` (PA-35); objetivos de 48 px en la navegación de cada breakpoint (PA-31).

## Trámites (motor data-driven)

El asistente tiene 6 pasos fijos por trámite: Trámite → Requisitos → Identidad → Datos → Confirmación → Constancia. Todo lo propio de cada trámite vive en `VT.TRAMITES` (`js/data.js`): nombre formal, explicación simple, entidad, requisitos (3 visibles + «Ver todos»), costo y vigencia (con la marca «referencial · confírmalo en gob.pe» cuando no está verificado), modo de identidad, preguntas de datos, «Qué hacer después» y canal oficial (siempre como texto, sin enlaces externos). `js/main.js` solo dibuja lo que dice esa configuración. Las fuentes y la fecha de consulta están en [`fuentes-tramites.md`](fuentes-tramites.md).

| Trámite | Flujo en una línea |
|---|---|
| Renovación de DNI (RENIEC) | 5 requisitos → 2 preguntas biográficas (demo) → fecha de nacimiento, agencia y celular → constancia |
| Certificado de antecedentes | Pregunta si es **policial** o **penal** → requisitos y costo de cada uno (penal S/ 40.40, verificado en pj.gob.pe) → 2 preguntas biográficas → uso o modalidad, quién lo pide y correo → constancia |
| Inscripción o activación de RUC (SUNAT) | 5 requisitos → «Cómo valida SUNAT quién eres» y «¿Ya tienes Clave SOL?» (sí/no, y orienta) → actividad, domicilio fiscal, inicio de actividades y correo → constancia |
| Revalidación de licencia A-I (MTC) | 5 requisitos y costos referenciales → 2 preguntas biográficas → categoría, fecha del examen médico y ¿papeletas? (sí/no) → constancia |

Tipos de pregunta (parser en `assistant.js`, todos devuelven `{valor, leido}`): `fecha`, `celular`, `agencia`, `opcion` (lista con sinónimos, por voz o botones), `sino` y `correo` («arroba» → @, «punto» → «.», sin espacios; si falla 2 veces se ofrece el teclado). La constancia lleva el código VT-AAAA-NNNNNN, el resumen, 3 a 5 pasos y el canal oficial (p. ej. «gob.pe/309»), y queda en el historial. Los términos del glosario del trámite activo se resaltan en los requisitos con `[data-term]`.

## Asistente con IA (opcional)

La IA es un Cloudflare Worker (código en `voztramite-ia-proxy/worker.js`). Para conectarla, pega su URL en `js/config.js`:

```js
window.VT_CONFIG = { iaEndpoint: "https://voztramite-ia.gegecam29.workers.dev" };  // "" = solo análisis local
// POST { texto, contexto: { paso, tramiteId } }  →  { tramiteId | null, respuesta | null }
```

`assistant.js` toma `VT.assistant.endpoint.endpoint` de ahí. **Qué se envía y cuándo:** solo el texto que la persona dice en el paso «tramite» y sus preguntas libres («Tengo una duda» en `#/tramite`), junto con el paso y el id del trámite. **Nunca** se envía nada en Identidad, Datos ni Confirmación, ni los datos guardados; una pregunta libre que parece traer datos personales (6 o más dígitos o «@») no sale del equipo. La respuesta de IA se muestra como burbuja del asistente con la etiqueta «Respuesta generada con IA · puede equivocarse» y se lee en voz alta si la voz está activa. Si la IA devuelve `tramiteId`, se elige ese trámite.

Sin endpoint, con error o pasados 6 s, la app **siempre cae al análisis local**: el trámite se reconoce por palabras clave y las dudas se responden buscando en el glosario y en los requisitos del trámite («No tengo esa respuesta. Puedes confirmarlo en gob.pe.» si no hay nada). Mientras espera se muestra «Pensando…» (`aria-live`). En `#/ajustes`, «Asistente con IA» tiene el interruptor «Usar IA» (apagado = cero llamadas a la red, solo análisis local), el bloque «¿Qué hace la IA?» y el estado (conectado / apagada / no configurado / sin respuesta); «Probar IA» lanza una pregunta de prueba. Cada respuesta de IA lleva «¿Te sirvió?» y, si eligió un trámite, «No es lo que quise decir». Más abajo, «Criterios de interacción humano-IA». Las pruebas simulan el Worker con `page.route` y bloquean la URL real por defecto.

## Elegir el trámite (clic, voz y texto)

- **Clic o toque en una tarjeta** (en `#/tramite` o «Empezar» en `#/inicio`) es una elección explícita: pasa directo a **Requisitos**, con el aviso «Elegiste: …» (`role="status"`, leído en voz si está activa). En «antecedentes» se queda un momento en este paso para preguntar si es policial o penal.
- **Voz o texto libre**: el resultado reemplaza a la lista. Arriba aparece «Entendí «X» porque dijiste “…”» con «Sí, continuar» (botón principal) y «No, elegir otro»; la lista queda colapsada en «Ver otros trámites». Por voz o texto, «sí», «continuar», «correcto» o «dale» avanzan; «no» u «otro» vuelven a la lista.
- **Regla general en todos los pasos**: cuando aparece contenido nuevo o un aviso, la conversación se desplaza hasta mostrarlo y el foco va a la siguiente acción principal o al encabezado nuevo (sin quitarle el foco a quien escribe en el campo). La barra de acciones de cada paso queda fija abajo, también en móvil 360×640 y en desktop 1366×768 (PA-43). Con `prefers-reduced-motion` o modo ligero el desplazamiento es instantáneo.
- **«Empezar otro trámite»** es el único nombre para reiniciar (antes «Empezar de nuevo» y «Hacer otro trámite»: hacían lo mismo). Pide confirmación en un `<dialog>` y después muestra «Se reinició tu trámite» con «Deshacer» durante 8 s (PA-46). Si la constancia ya se generó no pregunta, porque el trámite quedó en el historial.

## Voz del asistente (selector)

En `#/ajustes`, «Voz del asistente» lista las voces `es-*` de `speechSynthesis` (p. ej. «Helena · España», «Google español · Estados Unidos») y se recarga en `onvoiceschanged`. Por defecto se usa una voz femenina (por nombre: Helena, Laura, Sabina, Dalia, Elvira, Paloma, Camila, Paulina, Mónica, Google español; a igual nombre, es-PE > es-419/es-US/es-MX > es-ES) y, si no hay ninguna, la mejor `es-*`. «Escuchar esta voz» la prueba; la elección se guarda en `localStorage` (`voztramite:voz:v1`) y la usa `speak()`. Sin voces o sin `speechSynthesis` se muestra un aviso con ícono y texto. La voz elegida aparece en el resumen de `#/perfil`.

## Requisitos para la voz

El reconocimiento de voz usa la Web Speech API del navegador, así que depende de dónde y con qué se abra la página:

| Requisito | Detalle |
|---|---|
| Navegador | **Chrome o Edge** (escritorio y Android). Firefox no tiene reconocimiento de voz; en Brave suele fallar con el error `network` porque bloquea el servicio de reconocimiento. Safari tiene soporte parcial |
| Origen | `http://localhost` o `https` (por ejemplo GitHub Pages). **No funciona abriendo el archivo como `file://`**: usa `py -m http.server 8123` o la página publicada |
| Permiso del micrófono | Antes del primer reconocimiento se pide el permiso con `getUserMedia` y se suelta el micrófono enseguida. Si se denegó: ícono del candado junto a la dirección → Micrófono → Permitir → «Intentar de nuevo» |
| Internet | Chrome y Edge envían el audio a su servicio de reconocimiento, por lo que necesitan conexión |
| Teclado | Siempre disponible como alternativa; la lectura en voz alta (`speechSynthesis`) funciona sin internet con las voces del sistema |

Mensajes según la causa (ícono + texto + color y salida por teclado):

| Causa | Mensaje |
|---|---|
| Abierto como `file://` | «Abre VozTrámite desde un servidor o desde la página publicada para usar la voz.» |
| Sin `SpeechRecognition` | «Tu navegador no reconoce voz. Usa Chrome o Edge, o escribe con el teclado.» |
| Permiso denegado | Cómo activar el micrófono con el candado y botón «Intentar de nuevo» |
| Error `network` | «El reconocimiento de voz de tu navegador necesita internet o está bloqueado (por ejemplo en Brave). Usa Chrome o Edge, o el teclado.» |
| Sin micrófono | «No encontré un micrófono.» |
| Dos silencios seguidos | «Sigo sin escucharte. Prueba con el teclado.» |

Robustez: el idioma es `es-PE` y, si el navegador responde `language-not-supported`, se reintenta con `es-ES`; un temporizador de ~10 s llama a `stop()` si no llega `onend`. En `#/ajustes`, «Probar voz» permite comprobar el micrófono, escuchar la voz del asistente y ver la compatibilidad del navegador. Dentro del navegador integrado de algunas aplicaciones el micrófono está bloqueado (`not-allowed`): abre la página en Chrome o Edge.

## Pruebas

```bash
py -m http.server 8123 &
py docs/pruebas/acceptance.py   # 52/52: PA-36 perfil, PA-37 historial, PA-38 voz sin soporte, PA-39 antecedentes, PA-40 selector de voz, PA-41 IA simulada, PA-42 correo dictado, PA-43 elegir trámite (clic y texto), PA-44 «Usar IA» apagado, PA-45 «¿Te sirvió?» y explicación, PA-46 reinicio con «Deshacer», PA-47 layout (modo simple en móvil y altura en desktop), PA-48 vistas de ayuda y pie global, PA-49 opinión con validación, PA-50 modo prueba con SUS y CSV
```

Genera [`docs/pruebas/resultados.md`](docs/pruebas/resultados.md) con el formato ID prueba · HU · criterio · acción · esperado · obtenido · estado.

## Cómo usar el modo prueba en las sesiones de validación

Para quien modera (U4S13). Todo queda en el navegador del equipo de la prueba; no se envía nada.

1. Abre VozTrámite con `pages/index.html?modo=prueba` (o activa «Modo prueba (para quien modera)» en `#/ajustes`).
2. Escribe el código del participante (P-01, P-02…) y elige su segmento: adulto mayor con baja alfabetización digital, zona rural o con baja conectividad, o no familiarizado con la autenticación digital del Estado. Aparece la banda «Modo prueba activo · Participante … · Segmento: …».
3. Pide a la persona que haga el trámite. La sesión empieza con su primer gesto y se anota: hora de inicio y fin, tiempo, pasos alcanzados (de 6), errores («No te entendí», identidad incorrecta), usos de Ayuda / «Tengo una duda» / «Ver la pista», usos de voz y de teclado, y si llegó a la constancia.
4. En la constancia aparece «Responder el cuestionario». El SUS tiene 10 preguntas, una por pantalla, con escala 1–5; el puntaje (impares r−1, pares 5−r, suma × 2.5) se muestra con su interpretación (≥ 68, sobre el promedio).
5. Al terminar con la persona, pulsa «Terminar sesión» en la banda y repite desde el paso 1 con el siguiente participante.
6. En `#/ajustes` → «Modo prueba»: «Exportar resultados» descarga un CSV (una fila por sesión: participante, segmento, tramite, fecha, inicio, fin, tiempo_seg, pasos, errores, ayudas, usos_voz, usos_teclado, exito, sus_1…sus_10, sus_total), «Exportar JSON» incluye además las opiniones y «Borrar resultados» pide confirmación. Exporta antes de cerrar el navegador.

Fuera del modo prueba no se registra nada. «Borrar mis datos» de Perfil no borra los resultados de las pruebas. El texto del SUS es la traducción al español de uso común; si el curso exige otra redacción, se cambia en `js/pruebas.js`.

## Criterios de interacción humano-IA

Reglas que sigue VozTrámite cuando una IA interviene (guías de interacción humano-IA, U4S14). Cada una se puede comprobar en la app y en las pruebas.

| Criterio | Cómo se cumple | Dónde se ve / prueba |
|---|---|---|
| Decir qué hace y qué no hace la IA | Bloque «¿Qué hace la IA?»: entiende lo que dices para elegir el trámite y responder dudas; no ve tus datos personales, no presenta trámites y puede equivocarse; la pregunta se envía a un servicio externo (Cloudflare) y no se guarda | `#/ajustes` y, una sola vez (descartable y recordado), en la primera respuesta de IA · PA-45 |
| Control del usuario | Interruptor «Usar IA» (encendido por defecto si hay endpoint, guardado en `localStorage`). Apagado = solo análisis local y cero llamadas a la red; el estado «Asistente con IA» lo refleja | `#/ajustes` · PA-44 |
| Comentarios sobre cada respuesta | «¿Te sirvió?» Sí/No (`aria-pressed`) se guarda en el equipo como `{fecha, paso, util}` en `voztramite:ia-votos:v1` | Cada respuesta de IA · PA-45 |
| Salida fácil de un error de la IA | Si la IA eligió un trámite, «No es lo que quise decir» vuelve a la lista sin elegir nada; «No, elegir otro» hace lo mismo con cualquier propuesta | Paso Trámite · PA-43 y PA-45 |
| Explicar el porqué | «Entendí «Renovación de DNI…» porque dijiste “documento”» (la palabra sale del análisis local) o «(según la IA)» con la etiqueta de IA | Paso Trámite · PA-45 |
| Confianza calibrada | Si la respuesta de IA habla de soles, costo, precio, requisito o plazo, termina con «Confírmalo en gob.pe» | PA-45 |
| Siempre hay una alternativa | Sin endpoint, con error, sin red o tras 6 s se usa el análisis local; el teclado y la lista siempre están | PA-41 y PA-44 |
| Privacidad por diseño | La IA solo ve el texto del paso «Trámite» y las dudas; nunca Identidad, Datos ni Confirmación; una duda con 6 o más dígitos o «@» no sale del equipo | PA-41 |

## Créditos

Equipo VozTrámite, Grupo 1 · UPC. Tipografía Instrument Sans (Rodrigo Fuenzalida y Jordan Egstad, SIL OFL 1.1). Íconos propios de trazo de 2 px.

## Versiones y caché

Los archivos CSS y JS se cargan con `?v=1.0.0` en `pages/index.html`. Al publicar cambios, sube ese número en las 6 etiquetas (por ejemplo `?v=1.0.1`): así el navegador descarga los archivos nuevos juntos y no mezcla versiones guardadas en caché.
