/**
 * VozTrámite · modo prueba (pruebas.js)
 * Apoyo para quien modera las pruebas de usabilidad (U4S13): anota, solo mientras el modo está activo,
 * el tiempo, los errores, las ayudas, el canal (voz o teclado) y el éxito de cada trámite, y calcula el SUS.
 * Todo vive en localStorage de este equipo (clave `voztramite:pruebas:v1`). Fuera del modo prueba no se escribe nada.
 */
(function (global) {
  "use strict";
  var VT = global.VT = global.VT || {};
  var KEY = "voztramite:pruebas:v1";

  /* Los 3 segmentos del informe */
  var SEGMENTOS = [
    "Adulto mayor con baja alfabetización digital",
    "Zona rural o con baja conectividad",
    "No familiarizado con la autenticación digital del Estado"
  ];

  /* System Usability Scale (Brooke, 1986) en la traducción al español de uso común. Impares: positivos; pares: negativos */
  var SUS_ITEMS = [
    "Creo que me gustaría utilizar este sistema con frecuencia.",
    "Encontré el sistema innecesariamente complejo.",
    "Pensé que el sistema era fácil de usar.",
    "Creo que necesitaría el apoyo de un experto para poder utilizar este sistema.",
    "Encontré que las diversas funciones de este sistema estaban bien integradas.",
    "Pensé que había demasiada inconsistencia en este sistema.",
    "Imagino que la mayoría de las personas aprenderían a utilizar este sistema muy rápidamente.",
    "Encontré el sistema muy complicado de usar.",
    "Me sentí muy seguro/a utilizando el sistema.",
    "Necesité aprender muchas cosas antes de poder empezar a usar el sistema."
  ];
  var SUS_ESCALA = ["Totalmente en desacuerdo", "En desacuerdo", "Ni de acuerdo ni en desacuerdo", "De acuerdo", "Totalmente de acuerdo"];

  function vacio() { return { activo: false, participante: "", segmento: "", sesiones: [], actual: null, pendienteSus: null }; }
  function leer() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY) || "null");
      if (!v || typeof v !== "object") return vacio();
      return Object.assign(vacio(), v, { sesiones: Array.isArray(v.sesiones) ? v.sesiones : [] });
    } catch (e) { return vacio(); }
  }
  var D = leer();
  function guardar() { try { localStorage.setItem(KEY, JSON.stringify(D)); } catch (e) { /* almacenamiento lleno o bloqueado */ } }

  /* «P-03», «p3» y «03» se aceptan y se guardan como P-03; devuelve "" si no es un código válido */
  function codigo(v) {
    var m = /^p?-?\s*(\d{1,3})$/i.exec(String(v || "").trim());
    if (!m) return "";
    var n = m[1]; if (n.length < 2) n = "0" + n;
    return "P-" + n;
  }

  /* Puntaje SUS: impares (r−1), pares (5−r), suma × 2.5. Devuelve null si faltan respuestas */
  function susPuntaje(r) {
    if (!r || r.length !== 10) return null;
    var s = 0;
    for (var i = 0; i < 10; i++) {
      var v = Number(r[i]); if (!(v >= 1 && v <= 5)) return null;
      s += (i % 2 === 0) ? v - 1 : 5 - v;
    }
    return s * 2.5;
  }
  function susInterpreta(p) {
    return p >= 68 ? { ok: true, t: "Por encima del promedio (68): la facilidad de uso se percibe como buena." }
      : { ok: false, t: "Por debajo del promedio (68): hay cosas que mejorar en la facilidad de uso." };
  }

  /* ----------------------------------------------------------- sesión en curso */
  function nueva() {
    return { id: "s" + Date.now().toString(36) + Math.floor(Math.random() * 1000).toString(36), participante: D.participante, segmento: D.segmento,
      tramiteId: null, tramite: "", t0: Date.now(), inicio: new Date().toISOString(), fin: null, tiempo_seg: null,
      pasos: 0, errores: 0, ayudas: 0, voz: 0, teclado: 0, exito: false, sus: null, sus_total: null };
  }
  function asegurar() { if (!D.actual) D.actual = nueva(); return D.actual; }
  function cerrarActual(exito) {
    var a = D.actual; if (!a) return null;
    D.actual = null;
    if (!a.tramiteId) { guardar(); return null; }   // no llegó a elegir ningún trámite: no hay nada que registrar
    a.fin = new Date().toISOString(); a.tiempo_seg = Math.max(0, Math.round((Date.now() - a.t0) / 1000)); a.exito = !!exito;
    D.sesiones.push(a);
    if (exito) D.pendienteSus = a.id;
    guardar();
    return a;
  }

  var P = {
    SEGMENTOS: SEGMENTOS, SUS_ITEMS: SUS_ITEMS, SUS_ESCALA: SUS_ESCALA, susPuntaje: susPuntaje, susInterpreta: susInterpreta, codigo: codigo,
    on: function () { return !!D.activo; },
    estado: function () { return { activo: !!D.activo, participante: D.participante, segmento: D.segmento, sesiones: D.sesiones.length }; },
    hayDatos: function () { return D.sesiones.length > 0; },
    activar: function (cod, seg) {
      D.activo = true; D.participante = cod; D.segmento = seg; D.actual = null; guardar();
    },
    /* Cierra la sesión de la persona (si había un trámite a medias, queda como no completado) y apaga el modo */
    terminar: function () {
      var a = cerrarActual(false); D.activo = false; D.participante = ""; D.segmento = ""; guardar(); return a;
    },
    /* Eventos: error, ayuda, voz y teclado. El primero abre la sesión (la hora de inicio es la del primer gesto) */
    evento: function (tipo) {
      if (!D.activo) return;
      var a = asegurar();
      if (tipo === "error") a.errores++; else if (tipo === "ayuda") a.ayudas++; else if (tipo === "voz") a.voz++; else if (tipo === "teclado") a.teclado++;
      guardar();
    },
    /* La persona eligió (o cambió) de trámite. Cambiar a otro trámite cierra el anterior como no completado */
    tramite: function (id, nombre) {
      if (!D.activo || !id) return;
      if (D.actual && D.actual.tramiteId && D.actual.tramiteId !== id) cerrarActual(false);
      var a = asegurar(); a.tramiteId = id; a.tramite = nombre || id; guardar();
    },
    /* Paso del asistente al que se llegó (1 a 6): solo actualiza una sesión ya abierta */
    paso: function (n) {
      if (!D.activo || !D.actual || !(n > D.actual.pasos)) return;
      D.actual.pasos = n; guardar();
    },
    /* Llegó a la constancia (éxito) o se abandonó (reiniciar) */
    finalizar: function (exito) { if (!D.activo) return null; return cerrarActual(exito); },
    pendienteSus: function () {
      if (!D.activo || !D.pendienteSus) return null;
      return D.sesiones.filter(function (s) { return s.id === D.pendienteSus; })[0] || null;
    },
    guardarSus: function (resp) {
      var s = P.pendienteSus(); var p = susPuntaje(resp);
      if (!s || p == null) return null;
      s.sus = resp.map(Number); s.sus_total = p; D.pendienteSus = null; guardar(); return p;
    },
    ultimoSus: function () { var l = D.sesiones.filter(function (s) { return s.sus_total != null; }); return l.length ? l[l.length - 1] : null; },
    sesiones: function () { return D.sesiones.slice(); },
    borrar: function () {
      var activo = D.activo, p = D.participante, s = D.segmento;
      D = vacio(); D.activo = activo; D.participante = p; D.segmento = s;
      try { if (activo) localStorage.setItem(KEY, JSON.stringify(D)); else localStorage.removeItem(KEY); } catch (e) { /* bloqueado */ }
    },

    /* ------------------------------------------------------------ exportación */
    COLUMNAS: ["participante", "segmento", "tramite", "fecha", "inicio", "fin", "tiempo_seg", "pasos", "errores", "ayudas", "usos_voz", "usos_teclado", "exito",
      "sus_1", "sus_2", "sus_3", "sus_4", "sus_5", "sus_6", "sus_7", "sus_8", "sus_9", "sus_10", "sus_total"],
    csv: function () {
      function celda(v) {
        if (v == null) return "";
        v = String(v);
        if (/^[=+\-@]/.test(v)) v = "'" + v;            // evita que una hoja de cálculo lo tome por fórmula
        return /[",\r\n;]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
      }
      var filas = [P.COLUMNAS.join(",")];
      D.sesiones.forEach(function (s) {
        var f = [s.participante, s.segmento, s.tramite, (s.inicio || "").slice(0, 10), s.inicio, s.fin, s.tiempo_seg, s.pasos, s.errores, s.ayudas, s.voz, s.teclado, s.exito ? 1 : 0];
        for (var i = 0; i < 10; i++) f.push(s.sus ? s.sus[i] : "");
        f.push(s.sus_total);
        filas.push(f.map(celda).join(","));
      });
      return filas.join("\r\n") + "\r\n";
    },
    json: function (extra) {
      return JSON.stringify(Object.assign({ exportado: new Date().toISOString(), version: 1, sesiones: D.sesiones }, extra || {}), null, 2);
    }
  };
  VT.pruebas = P;
})(window);
