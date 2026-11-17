import { mostrarLista } from './vistas/lista.js';
import { mostrarNueva } from './vistas/nueva.js';
import { mostrarDetalle } from './vistas/detalle.js';
const app = document.querySelector('#app');
let limpiar = () => {}, navegacion = 0;
async function navegar() {
  const turno = ++navegacion;
  limpiar(); limpiar = () => {};
  const contenido = document.createElement('div');
  const ruta = location.hash || '#/lista';
  document.querySelector('#atras').hidden = ruta === '#/lista';
  app.textContent = 'Cargando…';
  try {
    let liberar;
    if (ruta === '#/lista') liberar = await mostrarLista(contenido);
    else if (ruta === '#/nueva') liberar = mostrarNueva(contenido);
    else if (/^#\/cata\/[^/]+$/.test(ruta)) liberar = await mostrarDetalle(contenido, decodeURIComponent(ruta.slice(7)));
    else { location.replace('#/lista'); return; }
    if (turno !== navegacion) { liberar?.(); return; }
    limpiar = liberar || (() => {});
    app.replaceChildren(contenido); app.focus();
  } catch {
    if (turno === navegacion) app.textContent = 'No se pudieron cargar los datos. Vuelve a intentarlo.';
  }
}
window.addEventListener('hashchange', navegar);
if (!location.hash) location.replace('#/lista');
else navegar();
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {
    const aviso = document.createElement('p');
    aviso.textContent = 'No se pudo preparar el modo sin conexión. Vuelve a abrir la app con conexión.';
    document.body.append(aviso);
  });
}
