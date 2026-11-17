export function elemento(etiqueta, texto, clase) {
  const nodo = document.createElement(etiqueta);
  if (texto) nodo.textContent = texto;
  if (clase) nodo.className = clase;
  return nodo;
}
export function fecha(valor) {
  const fecha = new Date(valor);
  return valor && !Number.isNaN(fecha.getTime()) ? fecha.toLocaleDateString('es', { dateStyle: 'long' }) : 'Sin fecha';
}
export function foto(blob, clase = '') {
  const imagen = elemento('img', '', clase);
  imagen.alt = 'Etiqueta del vino';
  const url = URL.createObjectURL(blob);
  imagen.src = url;
  return { imagen, limpiar: () => URL.revokeObjectURL(url) };
}
