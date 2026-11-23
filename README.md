# VozTrámite · Landing page

Asistente conversacional por voz para preparar trámites del Estado peruano. Proyecto del curso **HCI for UX Design (1ASI0784)**, UPC, Grupo 1. No es un servicio oficial.

- **Demo publicada:** se despliega con GitHub Pages desde la rama principal (carpeta raíz).
- **Documentación completa:** [`docs/README.md`](docs/README.md)
- **Pruebas de aceptación:** [`docs/pruebas/resultados.md`](docs/pruebas/resultados.md)

- **Criterios de interacción humano-IA:** sección en [`docs/README.md`](docs/README.md#criterios-de-interacción-humano-ia)

Abre `index.html` con un servidor estático (`python3 -m http.server`) o directamente en GitHub Pages.

## Criterios de interacción humano-IA

- La IA es opcional: «Usar IA» en Ajustes la enciende o la apaga; apagada, la app solo usa el análisis local y no llama a la red.
- Antes de usarla se explica qué hace y qué no («¿Qué hace la IA?»): entiende lo que dices, no ve tus datos personales, no presenta trámites y puede equivocarse.
- Cada respuesta de IA se puede valorar («¿Te sirvió?») y, si eligió un trámite, se puede rechazar («No es lo que quise decir»).
- Se explica por qué se entendió un trámite y las respuestas con costos o requisitos terminan en «Confírmalo en gob.pe».
- Accesibilidad declarada: WCAG 2.1 nivel **AA**.

Detalle y pruebas en [`docs/README.md`](docs/README.md).
